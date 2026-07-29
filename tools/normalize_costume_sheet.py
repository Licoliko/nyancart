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


def split_frames(sheet: Image.Image) -> list[Image.Image]:
    frames: list[Image.Image] = []
    for row in range(ROWS):
        top = round(row * sheet.height / ROWS)
        bottom = round((row + 1) * sheet.height / ROWS)
        for column in range(COLS):
            left = round(column * sheet.width / COLS)
            right = round((column + 1) * sheet.width / COLS)
            frame = sheet.crop((left, top, right, bottom))
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
