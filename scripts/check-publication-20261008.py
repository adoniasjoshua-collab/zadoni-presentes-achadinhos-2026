"""Read-only release checks against the committed site before the bouquet update."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = '5b68ebebad24b690872f517f3cada6dc07d9ed0e'


def original(name):
    return subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT)


class References(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.ids = []
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('src', 'href', 'srcset'):
            value = attrs.get(key, '')
            self.refs.extend(x.strip().split(' ')[0] for x in value.split(',')) if key == 'srcset' else self.refs.append(value)


def main():
    files = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASE], cwd=ROOT).decode().splitlines()
    pages = [p for p in files if p.endswith('.html') and not p.startswith(('docs/', '.tmp/'))]
    patterns = [r'<title>.*?</title>', r'<h1\b[^>]*>.*?</h1>', r'<meta\b[^>]*>',
                r'<link\b[^>]*rel="canonical"[^>]*>', r'<script\b[^>]*>.*?</script>']
    parsed = {}
    for name in pages:
        old = original(name).decode('utf-8')
        source = (ROOT / name).read_text(encoding='utf-8')
        for pattern in patterns:
            assert re.findall(pattern, old, re.S) == re.findall(pattern, source, re.S), (name, pattern)
        before = References(name)
        before.feed(old)
        after = References(name)
        after.feed(source)
        assert set(before.ids) <= set(after.ids), f'Removed anchors: {name}'
        assert len(after.ids) == len(set(after.ids)), f'Duplicate IDs: {name}'
        parsed[name] = after
    for name, page in parsed.items():
        for ref in page.refs:
            url = urlsplit(ref)
            if not ref or url.scheme or url.netloc:
                continue
            target = (ROOT / unquote(url.path.lstrip('/'))) if url.path.startswith('/') else (ROOT / name).parent / unquote(url.path)
            if not url.path:
                target = ROOT / name
            if target.is_dir():
                target /= 'index.html'
            assert target.exists(), f'Missing resource: {name}: {ref}'
    protected = ['CHANGELOG-SEO.md', 'robots.txt', 'sitemap.xml', '.htaccess']
    protected += [p for p in files if p.startswith(('.github/workflows/', 'assets/data/'))]
    for name in protected:
        if name in files:
            assert original(name).replace(b'\r\n', b'\n') == (ROOT / name).read_bytes().replace(b'\r\n', b'\n'), name
    bouquet = (ROOT / 'buques-canaa-dos-carajas/index.html').read_text(encoding='utf-8')
    assert bouquet.index('id="buque-rosas-vermelhas-dourado-250"') < bouquet.index('id="buque-cetim-lilas-borboletas"') < bouquet.index('id="destaque-rosas-naturais"')
    result = dict(passed=True, baseline=BASE, pages=len(pages), protected_files=len(set(protected)),
                  checks=['metadata', 'H1', 'canonical', 'scripts and JSON-LD', 'existing anchors',
                          'unique IDs', 'local resources', 'robots and sitemap', '28/10 schedule', 'bouquet order'])
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
