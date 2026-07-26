from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "optimized" / "products"
OUTPUT_DIR = SOURCE_DIR / "responsive"
SIZES = (480, 720)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for source in sorted(SOURCE_DIR.iterdir()):
    if source.is_dir() or source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue

    with Image.open(source) as image:
      image = image.convert("RGB")
      for width in SIZES:
          ratio = width / image.width
          height = max(1, round(image.height * ratio))
          resized = image.resize((width, height), Image.Resampling.LANCZOS)
          target = OUTPUT_DIR / f"{source.stem}-{width}.webp"
          resized.save(target, "WEBP", quality=78, method=6)
          print(target.relative_to(ROOT))
