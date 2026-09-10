"""Snapshot and strict semantic regression check. Python standard library only."""
import argparse
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import sys
from urllib.parse import urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'docs/seo-baseline-before-ui.json'
SITE = 'https://zadonipresentes.com.br/'
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
SKIP = {'script', 'style', 'template'}


def clean(value):
    return ' '.join(value.split())


class Element:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk()

    def text(self):
        if self.tag in SKIP:
            return ''
        return clean(' '.join(c.text() if isinstance(c, Element) else c for c in self.children))

    def raw(self):
        return ''.join(c.raw() if isinstance(c, Element) else c for c in self.children)


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Element()
        self.stack = [self.root]
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def page_snapshot(source, relative):
    nodes = list(Document(source).root.walk())
    url = urljoin(SITE, relative.removesuffix('index.html'))
    meta = [{'key': n.attrs.get('name') or n.attrs.get('property') or
             n.attrs.get('http-equiv') or 'charset',
             'value': n.attrs.get('content', n.attrs.get('charset', ''))}
            for n in nodes if n.tag == 'meta']
    # Keep duplicate metadata so adding a conflicting canonical/title fails too.
    schemas = [json.loads(n.raw()) for n in nodes if n.tag == 'script'
               and n.attrs.get('type', '').lower() == 'application/ld+json']
    links = []
    for n in nodes:
        if n.tag == 'a' and n.attrs.get('href'):
            href = urljoin(url, n.attrs['href'])
            links.append({'href': href, 'text': n.text(),
                          'internal': urlsplit(href).netloc == urlsplit(SITE).netloc,
                          'rel': n.attrs.get('rel', '')})
    images = [{k: n.attrs.get(k, '') for k in ('src', 'alt', 'srcset', 'sizes', 'width', 'height')}
              for n in nodes if n.tag == 'img']
    sources = [{k: n.attrs.get(k, '') for k in ('srcset', 'sizes', 'type', 'media')}
               for n in nodes if n.tag == 'source']
    mains = [n for n in nodes if n.tag == 'main']
    body = [n for n in nodes if n.tag == 'body']
    content = clean(' '.join(n.text() for n in (mains or body)))
    return {
        'url': url,
        'title': [n.text() for n in nodes if n.tag == 'title'],
        'metadata': meta,
        'canonical': [n.attrs.get('href') for n in nodes if n.tag == 'link'
                      and 'canonical' in n.attrs.get('rel', '').split()],
        'headings': [{'tag': n.tag, 'text': n.text()} for n in nodes
                     if n.tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}],
        'schemas': schemas,
        'faq': [n.text() for n in nodes if n.tag == 'details' or
                'faq' in (n.attrs.get('class', '') + ' ' + n.attrs.get('id', '')).lower()],
        'breadcrumbs': [n.text() for n in nodes if
                        'breadcrumb' in (n.attrs.get('class', '') + ' ' + n.attrs.get('aria-label', '')).lower()],
        'links': links, 'images': images, 'pictureSources': sources,
        'mainText': content,
    }


def collect(root=ROOT):
    # Include all published HTML, including national pages, link page and 404.
    pages = {}
    for file in sorted(root.rglob('*.html')):
        relative = file.relative_to(root).as_posix()
        if any(part in {'.git', 'node_modules', 'docs', '.tmp', 'test-results'}
               for part in file.relative_to(root).parts):
            continue
        pages[relative] = page_snapshot(file.read_text(encoding='utf-8'), relative)
    protected = {}
    for pattern in ('assets/data/*', 'monte-sua-cesta/js/configuracao.js',
                    'monte-sua-cesta/js/modelos.js', 'monte-sua-cesta/js/produtos.js',
                    'monte-sua-cesta/js/niveis.js', 'sitemap.xml', 'robots.txt',
                    '**/.htaccess', '_redirects', 'web.config'):
        for file in sorted(root.glob(pattern)):
            if file.is_file():
                relative = file.relative_to(root).as_posix()
                if file.suffix in {'.js', '.json', '.xml', '.txt', '.config'} or file.name in {'.htaccess', '_redirects'}:
                    protected[relative] = file.read_text(encoding='utf-8')
    return {'pages': pages, 'protectedFiles': protected}


def differences(before, after, location='$'):
    if type(before) is not type(after):
        return [{'path': location, 'before': before, 'after': after}]
    result = []
    if isinstance(before, dict):
        for key in sorted(before.keys() | after.keys()):
            if key not in before or key not in after:
                result.append({'path': f'{location}/{key}', 'before': before.get(key), 'after': after.get(key)})
            else:
                result.extend(differences(before[key], after[key], f'{location}/{key}'))
    elif isinstance(before, list):
        if len(before) != len(after):
            result.append({'path': location, 'before': before, 'after': after})
        else:
            for index, (old, new) in enumerate(zip(before, after)):
                result.extend(differences(old, new, f'{location}/{index}'))
    elif before != after:
        result.append({'path': location, 'before': before, 'after': after})
    return result


def sha(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def classify(changes, approvals):
    approved, rejected = [], []
    for change in changes:
        rule = next((r for r in approvals if r['path'] == change['path']
                     and isinstance(change['before'], str) and isinstance(change['after'], str)
                     and sha(change['before']) == r['beforeSha256']
                     and sha(change['after']) == r['afterSha256']), None)
        (approved if rule else rejected).append(change)
    return approved, rejected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['capture', 'check'])
    parser.add_argument('--output', type=Path, help='New snapshot (capture) or diff report (check)')
    args = parser.parse_args()
    current = collect()
    if args.command == 'capture':
        target = args.output or BASELINE
        if target.exists():
            parser.error(f'Refusing to overwrite historical snapshot: {target}')
        revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
        result = {'formatVersion': 1, 'capturedAt': datetime.now(timezone.utc).isoformat(),
                  'gitRevision': revision, 'scope': 'local static source; HTTP/field metrics not measured',
                  'snapshot': current}
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Captured {len(current["pages"])} pages: {target}')
        return 0
    original = json.loads(BASELINE.read_text(encoding='utf-8'))
    if original.get('formatVersion') != 1:
        raise ValueError('Unsupported baseline version')
    approval_file = ROOT / 'docs/seo-approved-changes.json'
    approvals = json.loads(approval_file.read_text(encoding='utf-8')) if approval_file.exists() else []
    approved, rejected = classify(differences(original['snapshot'], current), approvals)
    result = {'passed': not rejected, 'pages': len(current['pages']),
              'approvedDifferences': approved, 'unexpectedDifferences': rejected}
    if args.output:
        if args.output.resolve() in {BASELINE.resolve(), approval_file.resolve()}:
            parser.error('Diff output cannot overwrite baseline or approvals')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{"PASS" if not rejected else "FAIL"}: {len(current["pages"])} pages; '
          f'{len(approved)} approved differences; {len(rejected)} unexpected differences')
    for change in rejected:
        print(f'  {change["path"]}: {str(change["before"])[:160]!r} -> {str(change["after"])[:160]!r}')
    return int(bool(rejected))


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
