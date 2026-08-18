"""
convert_single_image.py

Usage:
  python convert_single_image.py "path/to/CESTA NA BANDEJA.png" --outdir ../assets/optimized/products/responsive --basename cesta-na-bandeja

This script creates webp and resized images (480, 720, 1080 widths) using Pillow.
It preserves aspect ratio and saves files named like: cesta-na-bandeja-480.webp

Dependencies:
  pip install pillow

Note: run from the repository root or adjust paths accordingly.
"""
from PIL import Image
import os
import sys
import argparse

SIZES = [480, 720, 1080]
QUALITY = 80


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def convert(input_path, outdir, basename):
    ensure_dir(outdir)
    with Image.open(input_path) as im:
        im = im.convert("RGBA")
        w, h = im.size
        # Save original as webp
        out_full = os.path.join(outdir, f"{basename}.webp")
        im.save(out_full, format="WEBP", quality=QUALITY)
        print("Saved:", out_full)
        for sw in SIZES:
            if sw >= w:
                # skip upscaling, but still create copy at original size if needed
                target_w = w
            else:
                target_w = sw
            target_h = int(h * (target_w / w))
            resized = im.resize((target_w, target_h), Image.LANCZOS)
            out_path = os.path.join(outdir, f"{basename}-{target_w}.webp")
            resized.save(out_path, format="WEBP", quality=QUALITY)
            print("Saved:", out_path)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Convert image to responsive WebP files')
    parser.add_argument('input', help='Input image path')
    parser.add_argument('--outdir', default='../assets/optimized/products/responsive', help='Output directory')
    parser.add_argument('--basename', default='image', help='Base filename for outputs')
    args = parser.parse_args()
    convert(args.input, args.outdir, args.basename)
