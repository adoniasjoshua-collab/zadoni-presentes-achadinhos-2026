"""
apply_responsive_images.py

Scans HTML files under zadoni-catalogo, finds <img src="../assets/optimized/products/<name>.<ext>">
and replaces with <picture> that points to ../assets/optimized/products/responsive/<name>-480.webp and -720.webp
and uses ../assets/optimized/products/responsive/<name>.webp as fallback if those files exist.

Usage:
  python apply_responsive_images.py

This modifies files in place; make a git commit before running if you want to review changes.
"""
import os, re
from pathlib import Path
ROOT = Path('zadoni-catalogo')
RESP_DIR = ROOT / 'assets' / 'optimized' / 'products' / 'responsive'

img_pattern = re.compile(r"<img\s+([^>]*?)src=[\"'](../assets/optimized/products/([^\"'>]+?))(?:\?[^\"'>]*)?[\"']([^>]*?)>", re.IGNORECASE)

html_files = list(ROOT.rglob('*.html'))
changes = []

def is_inside_picture(text, position):
    before = text[:position]
    opens = len(re.findall(r'<picture\b', before, re.IGNORECASE))
    closes = len(re.findall(r'</picture>', before, re.IGNORECASE))
    return opens > closes

for html in html_files:
    text = html.read_text(encoding='utf-8')
    def repl(m):
        full = m.group(0)
        if is_inside_picture(text, m.start()):
            return full
        before = m.group(1) or ''
        src = m.group(2)
        filename = m.group(3)
        after = m.group(4) or ''
        name, ext = os.path.splitext(filename)
        # check responsive files
        main = RESP_DIR / f"{name}.webp"
        small = RESP_DIR / f"{name}-480.webp"
        large = RESP_DIR / f"{name}-720.webp"
        rel_small = f"../assets/optimized/products/responsive/{name}-480.webp"
        rel_large = f"../assets/optimized/products/responsive/{name}-720.webp"
        rel_main = f"../assets/optimized/products/responsive/{name}.webp"
        if main.exists() or small.exists() or large.exists():
            srcset_parts = []
            if small.exists(): srcset_parts.append(f"{rel_small} 480w")
            if large.exists(): srcset_parts.append(f"{rel_large} 720w")
            srcset = ', '.join(srcset_parts) if srcset_parts else ''
            sizes = '(max-width: 640px) 92vw, 720px'
            picture = '<picture>'
            if srcset:
                picture += f'<source type="image/webp" srcset="{srcset}" sizes="(max-width: 640px) 92vw, 720px">'
            # preserve alt and other attributes from before/after
            # extract alt if present
            alt_match = re.search(r"alt=['\"]([^'\"]*)['\"]", before+after)
            alt = alt_match.group(1) if alt_match else ''
            loading_match = re.search(r"loading=['\"]([^'\"]*)['\"]", before+after)
            loading = loading_match.group(1) if loading_match else 'lazy'
            img_tag = f'<img src="{rel_main if main.exists() else src}" alt="{alt}" width="720" height="900" loading="{loading}" decoding="async">'
            picture += img_tag + '</picture>'
            return picture
        else:
            return full
    new_text = img_pattern.sub(repl, text)
    if new_text != text:
        html.write_text(new_text, encoding='utf-8')
        changes.append(str(html))

print('Updated files:', changes)
