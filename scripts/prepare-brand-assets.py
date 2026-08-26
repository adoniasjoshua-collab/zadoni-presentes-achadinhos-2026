from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "img" / "brand" / "logo-zadoni-master.png"
OUTPUT_DIR = SOURCE.parent


def main() -> None:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"Logo oficial ausente: {SOURCE}")

    with Image.open(SOURCE) as source:
        logo = ImageOps.exif_transpose(source).convert("RGB")

        if logo.width != logo.height:
            raise ValueError("O logo oficial deve permanecer quadrado.")

        for size in (320, 160, 96):
            output = logo.resize((size, size), Image.Resampling.LANCZOS)
            output.save(
                OUTPUT_DIR / f"logo-zadoni-{size}.webp",
                "WEBP",
                quality=88,
                method=6,
            )

        touch_icon = logo.resize((180, 180), Image.Resampling.LANCZOS)
        touch_icon.save(OUTPUT_DIR / "logo-zadoni-180.png", "PNG", optimize=True)

    print("Ativos de marca gerados: WebP 96/160/320 e PNG 180.")


if __name__ == "__main__":
    main()
