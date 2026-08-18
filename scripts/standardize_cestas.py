"""
standardize_cestas.py

Detecta arquivos com 'cesta' no nome dentro do diretório especificado,
recorta o conteúdo, centraliza em fundo branco quadrado e gera WebP
responsivos (480,720) no diretório de saída (padrão: assets/optimized/products/responsive).

Usage:
  python standardize_cestas.py --src zadoni-catalogo --out zadoni-catalogo/assets/optimized/products/responsive

Dependencies: Pillow (já instalado)
"""
from PIL import Image, ImageStat
import os, sys, argparse

SIZES = [480, 720]
DEFAULT_OUT = 'zadoni-catalogo/assets/optimized/products/responsive'


def find_images(src_dir):
    exts = ('.png','.jpg','.jpeg','.webp')
    for root,dirs,files in os.walk(src_dir):
        for f in files:
            if 'cesta' in f.lower():
                if f.lower().endswith(exts):
                    yield os.path.join(root,f)


def estimate_bg_color(im):
    # sample the four corners and return most common color
    w,h = im.size
    samples = []
    for x in (0, w-1):
        for y in (0, h-1):
            samples.append(im.getpixel((x,y)))
    # reduce to RGB tuple
    samples = [tuple(s[:3]) for s in samples]
    # return the modal color
    return max(set(samples), key=samples.count)


def make_mask(im, bg, threshold=30):
    # create mask where pixels differ from bg by threshold
    im_rgb = im.convert('RGB')
    px = im_rgb.load()
    w,h = im.size
    mask = Image.new('L', (w,h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            r,g,b = px[x,y]
            dr = abs(r-bg[0]); dg = abs(g-bg[1]); db = abs(b-bg[2])
            if (dr+dg+db) > threshold:
                mpx[x,y] = 255
    return mask


def process_image(path, outdir, basename=None, pad=10, target_square=720):
    ensure_dir(outdir)
    name = os.path.splitext(os.path.basename(path))[0]
    if basename: name = basename
    with Image.open(path) as im:
        im = im.convert('RGBA')
        w,h = im.size
        # try alpha bbox
        alpha = im.split()[-1]
        bbox = alpha.getbbox()
        if not bbox:
            # estimate background color from corners
            bg = estimate_bg_color(im)
            mask = make_mask(im,bg,threshold=30)
            bbox = mask.getbbox()
        if not bbox:
            # nothing detected, use center crop
            bbox = (0,0,w,h)
        # crop and add small padding
        x0,y0,x1,y1 = bbox
        x0 = max(0, x0 - pad); y0 = max(0, y0 - pad);
        x1 = min(w, x1 + pad); y1 = min(h, y1 + pad);
        cropped = im.crop((x0,y0,x1,y1))
        cw,ch = cropped.size
        # square canvas
        side = max(target_square, cw, ch)
        canvas = Image.new('RGBA', (side, side), (255,255,255,255))
        # paste centered
        ox = (side - cw)//2; oy = (side - ch)//2
        canvas.paste(cropped, (ox,oy), cropped)
        # save main webp
        out_main = os.path.join(outdir, f"{name}.webp")
        canvas.convert('RGB').save(out_main, 'WEBP', quality=85)
        print('Saved', out_main)
        for s in SIZES:
            if s >= side:
                target = side
            else:
                target = s
            resized = canvas.resize((target, target), Image.LANCZOS)
            outp = os.path.join(outdir, f"{name}-{target}.webp")
            resized.convert('RGB').save(outp, 'WEBP', quality=85)
            print('Saved', outp)


def ensure_dir(p):
    os.makedirs(p, exist_ok=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--src', default='zadoni-catalogo', help='Source folder to scan')
    parser.add_argument('--out', default=DEFAULT_OUT, help='Output folder for standardized images')
    parser.add_argument('--only', help='Only process this exact file path')
    args = parser.parse_args()
    paths = []
    if args.only:
        paths = [args.only]
    else:
        paths = list(find_images(args.src))
    if not paths:
        print('No images found to process.')
        sys.exit(0)
    for p in paths:
        try:
            process_image(p, args.out)
        except Exception as e:
            print('Error processing', p, e)
