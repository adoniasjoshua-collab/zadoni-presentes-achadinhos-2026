"""Prepara as fotos adicionais da Zadoni para uso no site.

O script preserva os arquivos recebidos pelo WhatsApp, corrige a orientacao,
remove metadados ao regravar e gera WebP responsivo em 480 px e 720 px.
Fotos de produto recebem margem neutra para nao cortar a montagem; registros
de entrega usam enquadramento 4:5 para manter a grade consistente.
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "Fotos adicionais para incluir"

PHOTOS = [
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.26 (1).jpeg",
        "target": "assets/img/galerias/romanticos/arranjo-romantico-balao-rosas.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.26.jpeg",
        "target": "assets/img/galerias/buques/buque-rosa-vermelha-delicado.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.30 (1).jpeg",
        "target": "assets/img/galerias/cestas/cesta-cafe-artesanal.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.30 (2).jpeg",
        "target": "assets/img/galerias/cestas/cesta-masculina-azul.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.30 (3).jpeg",
        "target": "assets/img/galerias/cestas/cesta-chocolates-petiscos.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.30 (4).jpeg",
        "target": "assets/img/galerias/buques/buque-rosas-vermelhas-classico.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.31 (1).jpeg",
        "target": "assets/img/galerias/buques/buque-rosas-com-chocolates.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.31.jpeg",
        "target": "assets/img/galerias/buques/buque-rosas-vermelhas-amarelas.webp",
        "mode": "pad",
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.27 (1).jpeg",
        "target": "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-01.webp",
        "mode": "crop",
        "centering": (0.5, 0.45),
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.27 (2).jpeg",
        "target": "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-02.webp",
        "mode": "crop",
        "centering": (0.5, 0.45),
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.28.jpeg",
        "target": "assets/img/prova-social/entregas-canaa/entrega-buque-casal-01.webp",
        "mode": "crop",
        "centering": (0.5, 0.42),
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.29 (2).jpeg",
        "target": "assets/img/prova-social/entregas-canaa/entrega-buques-clientes-03.webp",
        "mode": "crop",
        "centering": (0.5, 0.5),
    },
    {
        "source": "WhatsApp Image 2026-08-18 at 07.10.29 (4).jpeg",
        "target": "assets/img/prova-social/entregas-canaa/entrega-presente-casal-02.webp",
        "mode": "crop",
        "centering": (0.5, 0.43),
    },
]

EXCLUDED = {
    "WhatsApp Image 2026-08-18 at 07.10.27.jpeg": "captura de tela com interface",
    "WhatsApp Image 2026-08-18 at 07.10.29 (1).jpeg": "registro muito semelhante ao selecionado",
    "WhatsApp Image 2026-08-18 at 07.10.29 (3).jpeg": "texto sobreposto e registro semelhante",
    "WhatsApp Image 2026-08-18 at 07.10.29 (5).jpeg": "captura de tela com interface",
    "WhatsApp Image 2026-08-18 at 07.10.29.jpeg": "captura de tela com interface",
    "WhatsApp Image 2026-08-18 at 07.10.30.jpeg": "captura de tela com interface",
    "WhatsApp Image 2026-08-18 at 07.10.31 (2).jpeg": "item sem categoria correspondente no catalogo",
}


def render_variant(image: Image.Image, size: tuple[int, int], photo: dict) -> Image.Image:
    if photo["mode"] == "crop":
        return ImageOps.fit(
            image,
            size,
            method=Image.Resampling.LANCZOS,
            centering=photo.get("centering", (0.5, 0.5)),
        )

    return ImageOps.pad(
        image,
        size,
        method=Image.Resampling.LANCZOS,
        color="#fffafb",
        centering=(0.5, 0.5),
    )


def output_paths(target: Path) -> list[tuple[Path, tuple[int, int]]]:
    return [
        (target.with_name(f"{target.stem}-480.webp"), (480, 600)),
        (target, (720, 900)),
    ]


def main() -> None:
    missing = [photo["source"] for photo in PHOTOS if not (SOURCE_DIR / photo["source"]).is_file()]
    if missing:
        raise FileNotFoundError("Fotos de origem ausentes: " + ", ".join(missing))

    generated = []
    for photo in PHOTOS:
        source_path = SOURCE_DIR / photo["source"]
        target_path = ROOT / photo["target"]
        target_path.parent.mkdir(parents=True, exist_ok=True)

        with Image.open(source_path) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            for output_path, size in output_paths(target_path):
                rendered = render_variant(image, size, photo)
                rendered.save(output_path, "WEBP", quality=84, method=6)
                generated.append(output_path.relative_to(ROOT))

    print(f"Geradas {len(generated)} imagens WebP a partir de {len(PHOTOS)} fotos selecionadas.")
    print(f"Mantidos fora do site: {len(EXCLUDED)} arquivos.")


if __name__ == "__main__":
    main()
