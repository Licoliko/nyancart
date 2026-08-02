import json
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
    "masuka-chartreux", "soyi-tonkinese", "shino-cornish",
    "aroma-balinese", "matsuri-japanese-bobtail",
)
sprites = [ROOT / "assets" / "sprites" / f"{slug}.png" for slug in cat_slugs]
portraits = [ROOT / "assets" / "portraits" / f"{slug}.webp" for slug in cat_slugs[:12]]
select_heroes = [ROOT / "assets" / "select-heroes" / f"{slug}.png" for slug in cat_slugs]
select_chibis = [ROOT / "assets" / "select-chibis" / f"{slug}.png" for slug in cat_slugs]
skill_cutins = [ROOT / "assets" / "skill-cutins" / f"{slug}.png" for slug in cat_slugs]
costume_sets = [
    ("aruka-sham", "cup-champion"),
    ("kurone-night", "moonlight-ace"),
    ("kohaku-taiga", "sunset-rally"),
    ("ghost-rex", "phantom-gala"),
    ("nerine-korat", "aqua-parade"),
    ("fumika-scotty", "sunrise-airmail"),
    ("bell-savanna", "sunset-huntress"),
    ("popo-munch", "berry-clockwork"),
    ("marron-maine", "winter-express"),
    ("milfi-ragdoll", "rose-tea-party"),
    ("yukine-silky", "aurora-nocturne"),
    ("rhythm-sphynx", "pulse-idol"),
    ("tick-abyssinian", "ivory-chronomancer"),
    ("flora-turkishvan", "moonlit-botanica"),
    ("reska-americancurl", "arctic-rescue"),
    ("cleo-mau", "azure-sun-empress"),
    ("ciel-norwegian", "storm-navigator"),
    ("sucre-persian", "midnight-patissier"),
    ("moka-oriental", "aqua-forensic"),
    ("garnet-bengal", "white-tiger-siege"),
    ("rinka-somali", "sky-festival"),
    ("stella-russianblue", "rose-quartz-nova"),
    ("honey-british", "lavender-hive-royal"),
    ("liber-birman", "dawn-celestial"),
    ("masuka-chartreux", "crimson-vine-royal"),
    ("soyi-tonkinese", "snow-silk-couture"),
    ("shino-cornish", "azure-fox-shinobi"),
    ("aroma-balinese", "noir-rose-perfumer"),
    ("matsuri-japanese-bobtail", "aqua-summer-matsuri"),
]
costume_dirs = [ROOT / "assets" / "costumes" / slug / costume for slug, costume in costume_sets]
costume_sprites = [path / "sprite.png" for path in costume_dirs]
costume_selects = [path / "select.png" for path in costume_dirs]
costume_webp = [path / name for path in costume_dirs for name in ("sprite.webp", "select.webp")]
for path in sprites + portraits + select_heroes + select_chibis + skill_cutins + costume_sprites + costume_selects + costume_webp:
    if not path.exists():
        errors.append(f"missing active cat-racer asset: {path.name}")

visual_spec_path = ROOT / "assets" / "racer-visual-spec.json"
if not visual_spec_path.exists():
    errors.append("missing playable racer visual specification: racer-visual-spec.json")
else:
    visual_spec = json.loads(visual_spec_path.read_text(encoding="utf-8"))
    race_sprite_spec = visual_spec.get("raceSprite", {})
    if race_sprite_spec.get("proportion") != "2.5-head chibi":
        errors.append("race sprite proportion must remain 2.5-head chibi")
    if (race_sprite_spec.get("columns"), race_sprite_spec.get("rows")) != (7, 2):
        errors.append("race sprite direction atlas must remain 7x2")
    if len(race_sprite_spec.get("directionOrder", [])) != 14:
        errors.append("race sprite visual specification needs all 14 directions")
    approved = tuple(visual_spec.get("approvedRacers", ()))
    if set(approved) != set(cat_slugs):
        missing = sorted(set(cat_slugs) - set(approved))
        retired = sorted(set(approved) - set(cat_slugs))
        errors.append(
            "new playable racers must pass the 2.5-head chibi workflow "
            f"(missing={missing}, unknown={retired})"
        )

for path in select_heroes:
    if not path.exists():
        continue
    with Image.open(path).convert("RGBA") as image:
        if image.size != (1024, 1536):
            errors.append(f"{path.name}: selection hero must be 1024x1536, got {image.size}")
        alpha = image.getchannel("A")
        if alpha.getextrema() != (0, 255):
            errors.append(f"{path.name}: selection hero needs transparent and opaque pixels")

for path in [*select_chibis, *costume_selects]:
    if not path.exists():
        continue
    with Image.open(path).convert("RGBA") as image:
        if image.size != (1024, 1536):
            errors.append(f"{path.name}: selection chibi must be 1024x1536, got {image.size}")
        alpha = image.getchannel("A")
        if alpha.getextrema() != (0, 255):
            errors.append(f"{path.name}: selection chibi needs transparent and opaque pixels")
        content = alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
        if not content:
            errors.append(f"{path.name}: empty selection chibi")
        elif content[0] < 4 or content[1] < 4 or content[2] > 1020 or content[3] > 1532:
            errors.append(f"{path.name}: selection chibi touches the safe edge ({content})")

for path in skill_cutins:
    if not path.exists():
        continue
    with Image.open(path) as image:
        w, h = image.size
        if w < 1400 or h < 700 or not 1.9 < w / h < 2.1:
            errors.append(f"{path.name}: skill cut-in must be a high-resolution 2:1 banner, got {w}x{h}")

for path in [*sprites, *costume_sprites]:
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

jungle_gimmicks = ROOT / "assets" / "trackside" / "jungle-dual-gimmicks-gpt2-v1.png"
if not jungle_gimmicks.exists():
    errors.append("missing jungle Dual Corridor gimmick sheet")
else:
    with Image.open(jungle_gimmicks).convert("RGBA") as image:
        alpha=image.getchannel("A");w,h=image.size
        if w % 4 or h % 2:
            errors.append(f"jungle-dual-gimmicks-gpt2-v1.png: expected exact 4x2 grid, got {w}x{h}")
        else:
            cell_w,cell_h=w//4,h//2
            for row in range(2):
                for col in range(4):
                    cell=alpha.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h))
                    content=cell.point(lambda value:255 if value>=12 else 0).getbbox()
                    if not content:
                        errors.append(f"jungle-dual-gimmicks-gpt2-v1.png: empty cell {row},{col}")
                    elif content[0]<4 or content[2]>cell_w-4:
                        errors.append(f"jungle-dual-gimmicks-gpt2-v1.png: cell {row},{col} crosses horizontal safety margin {content}")

course_gimmicks = ROOT / "assets" / "trackside" / "course-dynamic-gimmicks-gpt2-v1.png"
if not course_gimmicks.exists():
    errors.append("missing all-course dynamic gimmick sheet")
else:
    with Image.open(course_gimmicks).convert("RGBA") as image:
        alpha = image.getchannel("A")
        if image.size != (1024, 1024):
            errors.append(
                f"course-dynamic-gimmicks-gpt2-v1.png: expected 1024x1024, got {image.size}"
            )
        else:
            cell = 256
            for row in range(4):
                for col in range(4):
                    frame = alpha.crop(
                        (col * cell, row * cell, (col + 1) * cell, (row + 1) * cell)
                    )
                    content = frame.point(lambda value: 255 if value >= 12 else 0).getbbox()
                    if not content:
                        errors.append(
                            f"course-dynamic-gimmicks-gpt2-v1.png: empty cell {row},{col}"
                        )
                        continue
                    if (
                        content[0] < 6
                        or content[1] < 6
                        or content[2] > cell - 6
                        or content[3] > cell - 6
                    ):
                        errors.append(
                            "course-dynamic-gimmicks-gpt2-v1.png: "
                            f"cell {row},{col} violates isolation margin {content}"
                        )

result_ceremony = ROOT / "assets" / "ui" / "result-ceremony-gpt2.png"
if not result_ceremony.exists():
    errors.append("missing result ceremony background: result-ceremony-gpt2.png")
else:
    with Image.open(result_ceremony) as image:
        w, h = image.size
        if w < 1280 or h < 720 or not 1.7 < w / h < 1.9:
            errors.append(f"result-ceremony-gpt2.png: expected a 16:9 HD image, got {w}x{h}")

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

for name in (
    "CARAMEL_OVERDRIVE.mp3",
    "clockwork_claw.mp3",
    "over_clock_nyaight_city.mp3",
    "rainbow_prism_overdrive.mp3",
    "crown_sugar_overdrive.mp3",
    "aurora_prism_break.mp3",
    "EMERALD_CLAW.mp3",
    "yukemuri_overdrive.mp3",
    "ABYSSAL_PEARL_OVERDRIVE.mp3",
    "phantom_gear_parade.mp3",
    "lunar_gravity_break.mp3",
):
    path = ROOT / "assets" / "audio" / name
    if not path.exists():
        errors.append(f"missing dedicated course music: {name}")
        continue
    if path.stat().st_size < 500_000:
        errors.append(f"{name}: dedicated course music is unexpectedly small")
    else:
        with path.open("rb") as stream:
            header = stream.read(3)
        if header != b"ID3" and header[:2] not in (
            b"\xff\xfb",
            b"\xff\xf3",
            b"\xff\xf2",
        ):
            errors.append(f"{name}: does not look like an MP3 stream")

if errors:
    raise SystemExit("\n".join(errors))
print("OK: racers, UI sheets, trackside scenery atlases, and racer-set garage validated")
