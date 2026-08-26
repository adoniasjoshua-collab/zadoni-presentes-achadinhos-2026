from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "Categoria Cesta de aniversario"
OUTPUT_DIR = ROOT / "assets/img/galerias/cestas-aniversario"

PHOTOS = [
    ("WhatsApp Image 2026-08-25 at 15.04.28 (1).jpeg", "cesta-aniversario-bolo-foto-petiscos"),
    ("WhatsApp Image 2026-08-25 at 15.04.28 (2).jpeg", "cesta-celebracao-te-amo-bolo-brigadeiros"),
    ("WhatsApp Image 2026-08-25 at 15.04.28.jpeg", "caixa-aniversario-personalizada-bolo-vinho"),
    ("WhatsApp Image 2026-08-25 at 15.04.29 (1).jpeg", "cesta-premium-bolo-vinho-ursinho"),
    ("WhatsApp Image 2026-08-25 at 15.04.29 (2).jpeg", "box-aniversario-bolo-balao-azul"),
    ("WhatsApp Image 2026-08-25 at 15.04.29.jpeg", "cesta-bolo-chocolates-te-amo"),
    ("WhatsApp Image 2026-08-25 at 15.04.30.jpeg", "caixa-aniversario-fotos-bolo-brigadeiros"),
]

SIZES = ((720, 900), (480, 600))
CROP_BOXES = {
    # Remove os controles da captura sem cortar o balão ou a caixa do presente.
    "box-aniversario-bolo-balao-azul": (80, 70, 720, 870),
}


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for source_name, basename in PHOTOS:
        source_path = SOURCE_DIR / source_name
        if not source_path.is_file():
            raise FileNotFoundError(f"Foto de origem ausente: {source_path}")

        with Image.open(source_path) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            if basename in CROP_BOXES:
                image = image.crop(CROP_BOXES[basename])
            for width, height in SIZES:
                output_name = f"{basename}-480.webp" if width == 480 else f"{basename}.webp"
                output = ImageOps.fit(image, (width, height), method=Image.Resampling.LANCZOS)
                output.save(OUTPUT_DIR / output_name, "WEBP", quality=78, method=6)

    print(f"Geradas {len(PHOTOS) * len(SIZES)} imagens WebP para {len(PHOTOS)} novos modelos.")


if __name__ == "__main__":
    main()
