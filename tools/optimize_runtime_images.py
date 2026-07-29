"""Build the WebP images used by the browser release.

Source PNGs stay untouched. Character sheets, selection art, and alpha-heavy
UI are encoded losslessly; photographic course art and distant scenery use a
high quality visually-lossless setting. The output keeps every source pixel
dimension so sprite-cell geometry cannot change during optimization.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MANIFEST = ASSETS / "runtime-image-manifest.json"

CAT_SLUGS = [
    "aruka-sham", "kurone-night", "kohaku-taiga", "ghost-rex",
    "nerine-korat", "fumika-scotty", "bell-savanna", "popo-munch",
    "marron-maine", "milfi-ragdoll", "yukine-silky", "rhythm-sphynx",
    "tick-abyssinian", "flora-turkishvan", "reska-americancurl",
    "cleo-mau", "ciel-norwegian", "sucre-persian", "moka-oriental",
    "garnet-bengal", "rinka-somali", "stella-russianblue",
    "honey-british", "liber-birman",
    "masuka-chartreux", "soyi-tonkinese", "shino-cornish",
    "aroma-balinese", "matsuri-japanese-bobtail",
]

ENVIRONMENT = [
    "sweets-circuit-v1", "course-sweets", "course-steam", "course-neon",
    "course-rain", "course-royal", "course-aurora", "course-jungle",
    "course-sakura", "course-coral", "course-phantom", "course-lunatic",
    "racer-set-garage",
]

UI = [
    "course-map-v2", "items", "mobile-controls-gpt2",
    "driving-vfx-animated-gpt2-v1", "item-vfx-animated-gpt2-v1",
    "weather-driving-vfx-gpt2-v1", "cat-can-gears-gpt2-v1",
    "mia-charme-intrusion-gpt2-v2", "mia-charme-boss-portrait-gpt2",
    "result-ceremony-gpt2",
]

TRACKSIDE = [
    "candy-sign", "cupcake-tower", "jump-ramps-angled-gpt2-v2",
    "jungle-dual-gimmicks-gpt2-v1", "course-dynamic-gimmicks-gpt2-v1",
    "scenery-candy-houses", "scenery-forest",
    "course-tunnel-portals-gpt2-v1", "course-tunnel-interiors-gpt2-v1",
    *[f"course-scenery-{slug}-gpt2" for slug in (
        "sweets", "steam", "neon", "rain", "royal", "aurora", "jungle",
        "sakura", "coral", "phantom", "lunatic",
    )],
    *[f"course-scenery-{slug}-near-gpt2-v1" for slug in (
        "jungle", "aurora", "sakura", "coral", "phantom", "lunatic",
    )],
    *[f"course-vfx-{effect}-gpt2-v1" for effect in (
        "rain", "steam", "bubbles", "sakura", "snow", "fireflies",
        "stardust",
    )],
    *[f"spectator-{slug}" for slug in (
        "pink-human", "blond-cookie", "cyan-cat", "purple-witch",
        "teal-glasses",
    )],
    *[f"{theme}-prop-{index}" for theme in ("steam", "neon", "rain", "royal") for index in range(6)],
]


def runtime_sources() -> list[Path]:
    paths = [ASSETS / "environment" / f"{name}.png" for name in ENVIRONMENT]
    paths += [ASSETS / "sprites" / f"{slug}.png" for slug in [*CAT_SLUGS, "mia-charme", "mia-throw-gpt2-v1"]]
    paths += [ASSETS / "select-heroes" / f"{slug}.png" for slug in CAT_SLUGS]
    paths += [ASSETS / "select-chibis" / f"{slug}.png" for slug in CAT_SLUGS]
    paths += [ASSETS / "skill-cutins" / f"{slug}.png" for slug in CAT_SLUGS]
    paths += sorted((ASSETS / "costumes").glob("*/*/*.png"))
    paths += [ASSETS / "ui" / f"{name}.png" for name in UI]
    paths += [ASSETS / "trackside" / f"{name}.png" for name in TRACKSIDE]
    return paths


def has_alpha(image: Image.Image) -> bool:
    return image.mode in {"RGBA", "LA"} or "transparency" in image.info


def policy(source: Path, image: Image.Image) -> tuple[str, int]:
    group = source.parent.name
    if "costumes" in source.parts:
        return ("lossless", 100) if source.stem == "sprite" else ("high-quality-alpha", 94)
    if group in {"sprites", "select-heroes"}:
        return "lossless", 100
    if group == "select-chibis":
        return "high-quality-alpha", 94
    if group == "skill-cutins":
        return "high-quality", 93
    if group == "ui" and has_alpha(image):
        return "lossless", 100
    if group == "environment":
        return "high-quality", 91
    if group == "trackside":
        return "high-quality-alpha", 94
    return "high-quality", 93


def verify_pair(source: Path, output: Path, mode: str) -> None:
    with Image.open(source) as before, Image.open(output) as after:
        if before.size != after.size:
            raise RuntimeError(f"Dimension changed: {source.relative_to(ROOT)}")
        if has_alpha(before) and not has_alpha(after):
            raise RuntimeError(f"Alpha channel lost: {source.relative_to(ROOT)}")
        if mode == "lossless":
            left, right = before.convert("RGBA"), after.convert("RGBA")
            if ImageChops.difference(left, right).getbbox() is not None:
                raise RuntimeError(f"Lossless verification failed: {source.relative_to(ROOT)}")


def optimize(check_only: bool = False, force: bool = False) -> dict:
    sources = runtime_sources()
    missing = [path for path in sources if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing runtime PNGs:\n" + "\n".join(str(path.relative_to(ROOT)) for path in missing))

    rows = []
    for source in sources:
        output = source.with_suffix(".webp")
        with Image.open(source) as image:
            mode, quality = policy(source, image)
            reusable = False
            if not force and output.is_file() and output.stat().st_mtime >= source.stat().st_mtime:
                try:
                    verify_pair(source, output, mode)
                    reusable = True
                except (OSError, RuntimeError):
                    reusable = False
            if not check_only and not reusable:
                options = {"format": "WEBP", "method": 4, "exact": True}
                if mode == "lossless":
                    options.update(lossless=True, quality=100)
                else:
                    options.update(quality=quality, alpha_quality=100)
                image.save(output, **options)
            if not output.is_file():
                raise FileNotFoundError(f"Missing optimized WebP: {output.relative_to(ROOT)}")
            width, height = image.size
        verify_pair(source, output, mode)
        before, after = source.stat().st_size, output.stat().st_size
        rows.append({
            "source": source.relative_to(ROOT).as_posix(),
            "output": output.relative_to(ROOT).as_posix(),
            "width": width,
            "height": height,
            "policy": mode,
            "quality": quality,
            "sourceBytes": before,
            "outputBytes": after,
            "savedBytes": before - after,
        })

    source_bytes = sum(row["sourceBytes"] for row in rows)
    output_bytes = sum(row["outputBytes"] for row in rows)
    report = {
        "format": "NYAN CART runtime image optimization v1",
        "files": len(rows),
        "sourceBytes": source_bytes,
        "outputBytes": output_bytes,
        "savedBytes": source_bytes - output_bytes,
        "savedPercent": round((1 - output_bytes / source_bytes) * 100, 2),
        "assets": rows,
    }
    if not check_only:
        MANIFEST.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Verify existing WebP outputs without rewriting them")
    parser.add_argument("--force", action="store_true", help="Rebuild every WebP even when an up-to-date output exists")
    args = parser.parse_args()
    report = optimize(args.check, args.force)
    print(
        f"Runtime images: {report['files']} / "
        f"{report['sourceBytes'] / 1024 / 1024:.2f} MiB -> "
        f"{report['outputBytes'] / 1024 / 1024:.2f} MiB "
        f"({report['savedPercent']:.2f}% saved)"
    )


if __name__ == "__main__":
    main()
