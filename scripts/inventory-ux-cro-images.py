"""Read-only local image audit. Never fetches or substitutes product photographs."""
import json
from pathlib import Path
from urllib.parse import urlsplit, unquote
from PIL import Image
from seo_baseline import ROOT, Document

pages = ['index.html', 'presentes-canaa.html'] + [p + '/index.html' for p in (
    'floricultura-canaa-dos-carajas', 'cestas-de-presente-canaa', 'cesta-de-aniversario-canaa',
    'cesta-cafe-da-manha-canaa', 'buques-canaa-dos-carajas', 'presentes-canaa-dos-carajas',
    'presentes-romanticos-canaa', 'rosas-perfumadas-canaa', 'monte-sua-cesta')]
files = {}
for directory in ('assets', 'monte-sua-cesta', 'cesta-cafe-da-manha-canaa', 'buques-canaa-dos-carajas', 'cestas-de-presente-canaa', 'floricultura-canaa-dos-carajas', 'Categoria Cesta de aniversario', 'Fotos adicionais para incluir'):
    for file in (ROOT / directory).rglob('*'):
        if file.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp', '.avif'):
            continue
        try:
            with Image.open(file) as im:
                files[file.relative_to(ROOT).as_posix()] = {'width': im.width, 'height': im.height, 'bytes': file.stat().st_size}
        except OSError:
            pass
rows = []
for page in pages:
    nodes = Document((ROOT / page).read_text(encoding='utf-8')).root.walk()
    for node in nodes:
        if node.tag != 'img':
            continue
        src = node.attrs.get('src', '')
        if urlsplit(src).netloc:
            continue
        file = ((ROOT / page).parent / unquote(src)).resolve()
        relative = file.relative_to(ROOT).as_posix()
        size = files.get(relative, {})
        problems = []
        if not file.exists(): problems.append('arquivo ausente')
        if size.get('width', 9999) < 360 and 'logo' not in relative: problems.append('original maior necessário para card mobile')
        if size.get('bytes', 0) > 200000: problems.append('verificar derivado WebP já disponível')
        if not node.attrs.get('width') or not node.attrs.get('height'): problems.append('sem dimensões HTML; verificar aspect-ratio CSS')
        variants = [p for p, dims in files.items() if Path(relative).stem.split('-480')[0].split('-720')[0] in Path(p).stem and dims.get('width', 0) > size.get('width', 99999)]
        rows.append({'page': page, 'product': node.attrs.get('alt', ''), 'file': relative, **size,
                     'ratio': round(size['width']/size['height'], 3) if size else None,
                     'loading': node.attrs.get('loading'), 'problems': problems, 'largerLocalVariants': variants,
                     'action': 'Preservar origem; contain e proporção reservada nos cards; revisar original se indicado'})
(ROOT / 'docs/inventario-imagens-ux-cro.json').write_text(json.dumps({'filesInspected': len(files), 'images': rows}, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
lines = ['# Inventário de imagens UX/CRO', '', f'{len(files)} arquivos locais inspecionados; {len(rows)} usos HTML nas 11 páginas. Derivados existentes não são duplicados. Fotos originais e atributos protegidos preservados.', '',
         '| Página | Produto/alt | Arquivo | Dimensão | Bytes | Proporção | Problema | Ação |', '|---|---|---|---|---:|---:|---|---|']
for row in rows:
    lines.append('| ' + ' | '.join(str(v).replace('|', '/') for v in [row['page'], row['product'], row['file'], f"{row.get('width','?')}×{row.get('height','?')}", row.get('bytes',0), row['ratio'], '; '.join(row['problems']) or 'Nenhum estrutural detectado', row['action']]) + ' |')
lines += ['', '## Origem e pendências', '', 'Nenhuma imagem substituída ou obtida externamente; direitos de novas imagens não se aplicam. O CSS preserva o produto inteiro com contain. Correspondência comercial de cada foto exige validação humana; dimensão suficiente não comprova nitidez. Variantes locais maiores estão listadas no JSON. Imagens decorativas de categoria e imagens dinâmicas do montador são verificadas no navegador; este inventário tabular enumera usos estáticos.']
(ROOT / 'docs/inventario-imagens-ux-cro.md').write_text('\n'.join(lines)+'\n', encoding='utf-8')
print(f'{len(files)} files; {len(rows)} HTML image uses; {sum(bool(r["problems"]) for r in rows)} flagged uses')
