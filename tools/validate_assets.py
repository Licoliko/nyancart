from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
errors = []

cat_slugs = (
    "aruka-sham", "kurone-night", "kohaku-taiga", "ghost-rex",
    "nerine-korat", "fumika-scotty", "bell-savanna", "popo-munch",
    "marron-maine", "milfi-ragdoll", "yukine-silky", "rhythm-sphynx",
)
sprites = [ROOT / "assets" / "sprites" / f"{slug}.png" for slug in cat_slugs]
portraits = [ROOT / "assets" / "portraits" / f"{slug}.webp" for slug in cat_slugs]
for path in sprites + portraits:
    if not path.exists():
        errors.append(f"missing active cat-racer asset: {path.name}")

for path in sprites:
    if not path.exists():
        continue
    with Image.open(path).convert("RGBA") as image:
        alpha = image.getchannel("A")
        if alpha.getextrema()[0] != 0:
            errors.append(f"{path.name}: no transparent pixels")
        w, h = image.size
        if w % 7 or h % 2:
            errors.append(f"{path.name}: sheet is not an exact 7x2 cell grid ({w}x{h})")
            continue
        cell_w, cell_h = w // 7, h // 2
        for row in range(2):
            for col in range(7):
                box=(cell_w*col,cell_h*row,cell_w*(col+1),cell_h*(row+1))
                cell_alpha = alpha.crop(box)
                content = cell_alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
                if not content:
                    errors.append(f"{path.name}: empty cell {row},{col}")
                    continue
                safe_x = round(cell_w * .08)
                if content[0] < safe_x or content[2] > cell_w - safe_x:
                    errors.append(
                        f"{path.name}: cell {row},{col} violates horizontal isolation "
                        f"({content[0]}..{content[2]} inside width {cell_w})"
                    )

for name, cols, rows in [("items.png",4,2),("vfx.png",4,2)]:
    path=ROOT/"assets"/"ui"/name
    with Image.open(path).convert("RGBA") as image:
        alpha=image.getchannel("A");w,h=image.size
        if alpha.getextrema()[0] != 0:
            errors.append(f"{name}: no transparent pixels")
        for row in range(rows):
            for col in range(cols):
                box=(round(w*col/cols),round(h*row/rows),round(w*(col+1)/cols),round(h*(row+1)/rows))
                if not alpha.crop(box).getbbox():errors.append(f"{name}: empty cell {row},{col}")

if errors:
    raise SystemExit("\n".join(errors))
print("OK: 12 cat-racer sheets (168 isolated cells), 12 portraits, 8 item cells, and 8 VFX cells validated")
