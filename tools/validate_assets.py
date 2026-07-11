from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
errors = []

cat_slugs = (
    "aruka-sham", "kurone-night", "kohaku-taiga", "ghost-rex",
    "nerine-korat", "fumika-scotty", "bell-savanna", "popo-munch",
    "marron-maine", "milfi-ragdoll", "yukine-silky", "rhythm-sphynx",
    "tick-abyssinian", "flora-turkishvan", "reska-americancurl",
    "cleo-mau", "ciel-norwegian", "sucre-persian",
    "moka-oriental", "garnet-bengal", "rinka-somali",
    "stella-russianblue", "honey-british", "liber-birman",
)
sprites = [ROOT / "assets" / "sprites" / f"{slug}.png" for slug in cat_slugs]
portraits = [ROOT / "assets" / "portraits" / f"{slug}.webp" for slug in cat_slugs[:12]]
select_heroes = [ROOT / "assets" / "select-heroes" / f"{slug}.png" for slug in cat_slugs]
for path in sprites + portraits + select_heroes:
    if not path.exists():
        errors.append(f"missing active cat-racer asset: {path.name}")

for path in select_heroes:
    if not path.exists():
        continue
    with Image.open(path).convert("RGBA") as image:
        if image.size != (1024, 1536):
            errors.append(f"{path.name}: selection hero must be 1024x1536, got {image.size}")
        alpha = image.getchannel("A")
        if alpha.getextrema() != (0, 255):
            errors.append(f"{path.name}: selection hero needs transparent and opaque pixels")

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

for name, cols, rows in [("items.png",4,2),("vfx.png",4,2),("mobile-controls.png",3,2),("particle-bursts-gpt2.png",4,2)]:
    path=ROOT/"assets"/"ui"/name
    with Image.open(path).convert("RGBA") as image:
        alpha=image.getchannel("A");w,h=image.size
        if alpha.getextrema()[0] != 0:
            errors.append(f"{name}: no transparent pixels")
        for row in range(rows):
            for col in range(cols):
                box=(round(w*col/cols),round(h*row/rows),round(w*(col+1)/cols),round(h*(row+1)/rows))
                if not alpha.crop(box).getbbox():errors.append(f"{name}: empty cell {row},{col}")

for name in ("scenery-candy-houses.png", "scenery-forest.png"):
    path = ROOT / "assets" / "trackside" / name
    if not path.exists():
        errors.append(f"missing trackside scenery atlas: {name}")
        continue
    with Image.open(path).convert("RGBA") as image:
        alpha = image.getchannel("A")
        w, h = image.size
        if alpha.getextrema() != (0, 255):
            errors.append(f"{name}: scenery atlas needs transparent and opaque pixels")
        for row in range(2):
            for col in range(3):
                box = (round(w*col/3), round(h*row/2), round(w*(col+1)/3), round(h*(row+1)/2))
                if not alpha.crop(box).getbbox():
                    errors.append(f"{name}: empty scenery cell {row},{col}")

for folder, name, cols, rows in (
    ("ui", "driving-vfx-gpt2.png", 3, 2),
    ("trackside", "jump-ramps-angled-gpt2-v2.png", 7, 5),
    ("trackside", "course-scenery-sweets-gpt2.png", 4, 3),
    ("trackside", "course-scenery-steam-gpt2.png", 4, 3),
    ("trackside", "course-scenery-neon-gpt2.png", 4, 3),
    ("trackside", "course-scenery-rain-gpt2.png", 4, 3),
    ("trackside", "course-scenery-royal-gpt2.png", 4, 3),
    ("trackside", "course-scenery-aurora-gpt2.png", 4, 3),
    ("trackside", "course-scenery-jungle-gpt2.png", 4, 3),
    ("trackside", "course-scenery-sakura-gpt2.png", 4, 3),
    ("trackside", "course-scenery-coral-gpt2.png", 4, 3),
    ("trackside", "course-scenery-phantom-gpt2.png", 4, 3),
    ("trackside", "course-scenery-lunatic-gpt2.png", 4, 3),
):
    path = ROOT / "assets" / folder / name
    if not path.exists():
        errors.append(f"missing GPT Image 2.0 atlas: {name}")
        continue
    with Image.open(path).convert("RGBA") as image:
        alpha = image.getchannel("A")
        w, h = image.size
        if alpha.getextrema() != (0, 255):
            errors.append(f"{name}: atlas needs transparent and opaque pixels")
        for row in range(rows):
            for col in range(cols):
                box = (round(w*col/cols), round(h*row/rows), round(w*(col+1)/cols), round(h*(row+1)/rows))
                if not alpha.crop(box).getbbox():
                    errors.append(f"{name}: empty cell {row},{col}")

garage = ROOT / "assets" / "environment" / "racer-set-garage.png"
if not garage.exists():
    errors.append("missing racer-set-garage.png")
else:
    with Image.open(garage) as image:
        w, h = image.size
        if w < 1280 or h < 720 or not 1.7 < w / h < 1.9:
            errors.append(f"racer-set-garage.png: expected a 16:9 HD image, got {w}x{h}")

if errors:
    raise SystemExit("\n".join(errors))
print("OK: racers, UI sheets, trackside scenery atlases, and racer-set garage validated")
