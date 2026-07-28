"""Normalize the GPT Image 2.0 course-gimmick source into a safe 4x4 atlas.

The generated source contains one logical object per quadrant, but effects can
extend beyond the mathematical quarter boundaries. This builder isolates each
visual row first, crops every object independently, then repacks all frames
into exact 256px cells using a shared scale and baseline per row.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CELL = 256
COLS = 4
ROWS = 4
PADDING_X = 16
PADDING_TOP = 10
PADDING_BOTTOM = 12


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--png", type=Path, required=True)
    parser.add_argument("--webp", type=Path, required=True)
    return parser.parse_args()


def row_bands(height: int) -> list[tuple[int, int]]:
    # Tuned to the generated 1254px source. Fractions keep the builder useful
    # if the built-in generator returns a nearby square resolution.
    fractions = ((0.00, 0.31), (0.31, 0.52), (0.49, 0.76), (0.76, 1.00))
    return [(round(height * start), round(height * end)) for start, end in fractions]


def trim_cell(
    source: Image.Image, col: int, band: tuple[int, int]
) -> Image.Image:
    width, _ = source.size
    left = round(width * col / COLS)
    right = round(width * (col + 1) / COLS)
    top, bottom = band
    candidate = source.crop((left, top, right, bottom))
    bbox = candidate.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError(f"empty generated cell row-band={band} col={col}")
    return candidate.crop(bbox)


def build(source: Image.Image) -> Image.Image:
    source = source.convert("RGBA")
    atlas = Image.new("RGBA", (CELL * COLS, CELL * ROWS), (0, 0, 0, 0))
    bands = row_bands(source.height)

    for row, band in enumerate(bands):
        frames = [trim_cell(source, col, band) for col in range(COLS)]
        max_width = max(frame.width for frame in frames)
        max_height = max(frame.height for frame in frames)
        scale = min(
            (CELL - PADDING_X * 2) / max_width,
            (CELL - PADDING_TOP - PADDING_BOTTOM) / max_height,
        )

        for col, frame in enumerate(frames):
            size = (
                max(1, round(frame.width * scale)),
                max(1, round(frame.height * scale)),
            )
            frame = frame.resize(size, Image.Resampling.LANCZOS)
            x = col * CELL + (CELL - frame.width) // 2
            y = row * CELL + CELL - PADDING_BOTTOM - frame.height
            atlas.alpha_composite(frame, (x, y))

    return atlas


def validate(atlas: Image.Image) -> None:
    if atlas.size != (CELL * COLS, CELL * ROWS):
        raise RuntimeError(f"unexpected atlas size: {atlas.size}")
    for row in range(ROWS):
        for col in range(COLS):
            cell = atlas.crop(
                (col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL)
            )
            alpha = cell.getchannel("A")
            if not alpha.getbbox():
                raise RuntimeError(f"empty packed cell {row}:{col}")
            border = max(
                alpha.crop((0, 0, CELL, 5)).getextrema()[1],
                alpha.crop((0, CELL - 5, CELL, CELL)).getextrema()[1],
                alpha.crop((0, 0, 5, CELL)).getextrema()[1],
                alpha.crop((CELL - 5, 0, CELL, CELL)).getextrema()[1],
            )
            if border:
                raise RuntimeError(f"packed cell touches border {row}:{col} alpha={border}")


def main() -> None:
    args = parse_args()
    atlas = build(Image.open(args.input))
    validate(atlas)
    args.png.parent.mkdir(parents=True, exist_ok=True)
    args.webp.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(args.png, optimize=True)
    atlas.save(args.webp, "WEBP", quality=90, method=6)
    print(f"Wrote {args.png} and {args.webp} ({atlas.width}x{atlas.height})")


if __name__ == "__main__":
    main()
