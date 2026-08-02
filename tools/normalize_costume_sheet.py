"""Normalize a generated 7x2 racer costume sheet to NYAN CART's fixed cells."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


COLS = 7
ROWS = 2
CELL_WIDTH = 301
CELL_HEIGHT = 262
OUTPUT_SIZE = (CELL_WIDTH * COLS, CELL_HEIGHT * ROWS)


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    return alpha.point(lambda value: 255 if value >= 8 else 0).getbbox() or (
        0,
        0,
        image.width,
        image.height,
    )


def remove_small_islands(image: Image.Image) -> Image.Image:
    """Remove detached generation flecks without touching the main kart art."""

    width, height = image.size
    alpha = image.getchannel("A")
    mask = bytearray(1 if value >= 12 else 0 for value in alpha.tobytes())
    visited = bytearray(width * height)
    components: list[list[int]] = []

    for start, opaque in enumerate(mask):
        if not opaque or visited[start]:
            continue
        visited[start] = 1
        stack = [start]
        component: list[int] = []
        while stack:
            index = stack.pop()
            component.append(index)
            x = index % width
            y = index // width
            for dy in (-1, 0, 1):
                next_y = y + dy
                if next_y < 0 or next_y >= height:
                    continue
                row = next_y * width
                for dx in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    next_x = x + dx
                    if next_x < 0 or next_x >= width:
                        continue
                    neighbor = row + next_x
                    if mask[neighbor] and not visited[neighbor]:
                        visited[neighbor] = 1
                        stack.append(neighbor)
        components.append(component)

    if len(components) <= 1:
        return image

    largest_component = max(components, key=len)
    largest = len(largest_component)
    # Generated sheets occasionally let a few pixels from the neighbouring
    # kart cross a cell boundary.  A slightly stronger component threshold
    # removes those detached slivers while keeping wheels, ribbons and other
    # meaningful pieces of the current kart.
    minimum = max(96, round(largest * 0.008))
    kept = bytearray(width * height)
    for component in components:
        xs = [index % width for index in component]
        touches_cell_edge = min(xs) <= 1 or max(xs) >= width - 2
        required = max(minimum, round(largest * 0.03)) if touches_cell_edge else minimum
        if component is largest_component or len(component) >= required:
            for index in component:
                kept[index] = 1

    alpha_values = bytearray(alpha.tobytes())
    for index, keep in enumerate(kept):
        if not keep:
            alpha_values[index] = 0
    cleaned = image.copy()
    cleaned.putalpha(Image.frombytes("L", image.size, bytes(alpha_values)))
    return cleaned


def find_row_split(sheet: Image.Image) -> int:
    """Find the transparent gutter between the generated sprite rows.

    GPT-generated grids are not always divided at exactly half the image
    height.  Splitting at the mathematical midpoint can therefore shave the
    ears or hair from the lower row.  Prefer the longest completely empty run
    around the middle; otherwise use the least occupied scanline.
    """

    alpha = sheet.getchannel("A")
    start = round(sheet.height * 0.35)
    end = round(sheet.height * 0.65)
    occupancy: list[tuple[int, int]] = []
    for y in range(start, end):
        row = alpha.crop((0, y, sheet.width, y + 1))
        occupancy.append((sum(value >= 8 for value in row.tobytes()), y))

    empty_rows = [y for count, y in occupancy if count == 0]
    if empty_rows:
        runs: list[list[int]] = [[empty_rows[0]]]
        for y in empty_rows[1:]:
            if y == runs[-1][-1] + 1:
                runs[-1].append(y)
            else:
                runs.append([y])
        middle = sheet.height / 2
        run = min(runs, key=lambda values: (-len(values), abs(sum(values) / len(values) - middle)))
        return round((run[0] + run[-1]) / 2)

    return min(occupancy, key=lambda entry: (entry[0], abs(entry[1] - sheet.height / 2)))[1]


def split_frames(sheet: Image.Image) -> list[Image.Image]:
    frames: list[Image.Image] = []
    split_y = find_row_split(sheet)
    row_bounds = ((0, split_y), (split_y, sheet.height))
    for row in range(ROWS):
        top, bottom = row_bounds[row]
        for column in range(COLS):
            left = round(column * sheet.width / COLS)
            right = round((column + 1) * sheet.width / COLS)
            frame = remove_small_islands(sheet.crop((left, top, right, bottom)))
            frames.append(frame.crop(alpha_bbox(frame)))
    return frames


def build_select_art(frame: Image.Image, output_path: Path, webp_path: Path | None) -> None:
    """Build a portrait locker card from the GPT-generated front-facing cell."""

    canvas = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    scale = min(900 / frame.width, 1120 / frame.height)
    width = max(1, round(frame.width * scale))
    height = max(1, round(frame.height * scale))
    resized = frame.resize((width, height), Image.Resampling.LANCZOS)
    x = (canvas.width - width) // 2
    y = canvas.height - height - 52
    canvas.alpha_composite(resized, (x, y))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, optimize=True)
    if webp_path:
        webp_path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(webp_path, "WEBP", quality=94, method=6)


def normalize(
    input_path: Path,
    output_path: Path,
    webp_path: Path | None,
    select_path: Path | None,
    select_webp_path: Path | None,
) -> None:
    source = Image.open(input_path).convert("RGBA")
    frames = split_frames(source)
    # Both rows intentionally share the same exact left/right profile.
    # Locking these two cells prevents image-generation drift from turning a
    # profile into a front/rear three-quarter view.
    frames[7] = frames[0].copy()
    frames[13] = frames[6].copy()
    max_width = max(frame.width for frame in frames)
    max_height = max(frame.height for frame in frames)
    # Keep the same generous horizontal gutter as the established racer
    # sheets. Side-on karts are the widest frames and must never touch the
    # neighboring 301 px cell when filtered by the browser.
    scale = min((CELL_WIDTH - 56) / max_width, (CELL_HEIGHT - 10) / max_height)
    output = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))

    for index, frame in enumerate(frames):
        width = max(1, round(frame.width * scale))
        height = max(1, round(frame.height * scale))
        resized = frame.resize((width, height), Image.Resampling.LANCZOS)
        column = index % COLS
        row = index // COLS
        x = column * CELL_WIDTH + (CELL_WIDTH - width) // 2
        y = row * CELL_HEIGHT + CELL_HEIGHT - height - 5
        output.alpha_composite(resized, (x, y))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output.save(output_path, optimize=True)
    if webp_path:
        webp_path.parent.mkdir(parents=True, exist_ok=True)
        output.save(webp_path, "WEBP", quality=94, method=6)
    if select_path:
        build_select_art(frames[10], select_path, select_webp_path)

    print(
        f"Normalized {len(frames)} frames to {output.width}x{output.height}; "
        f"cell={CELL_WIDTH}x{CELL_HEIGHT}; scale={scale:.4f}"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--webp", type=Path)
    parser.add_argument("--select", type=Path)
    parser.add_argument("--select-webp", type=Path)
    args = parser.parse_args()
    normalize(args.input, args.output, args.webp, args.select, args.select_webp)


if __name__ == "__main__":
    main()
