"""Check sitemap indexability and existing business identity without changing SEO."""
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

from seo_baseline import ROOT, collect


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


def validate():
    pages = collect()['pages']
    urls = [node.text for node in ET.parse(ROOT / 'sitemap.xml').iter()
            if node.tag.endswith('}loc')]
    errors = []
    seen = {key: set() for key in ('title', 'description', 'canonical')}
    businesses = [node for node in objects(pages['index.html']['schemas'])
                  if node.get('@type') == 'LocalBusiness']
    if len(businesses) != 1:
        raise ValueError('Home must contain one reference LocalBusiness')
    reference = businesses[0]
    business_count = 0
    if len(urls) != len(set(urls)):
        errors.append('Duplicate sitemap URLs')
    for url in urls:
        parsed = urlsplit(url)
        relative = parsed.path.lstrip('/')
        if not relative or relative.endswith('/'):
            relative += 'index.html'
        page = pages.get(relative)
        if page is None:
            errors.append(f'{url}: missing local HTML')
            continue
        if parsed.scheme != 'https' or parsed.netloc != 'zadonipresentes.com.br' or parsed.query or parsed.fragment:
            errors.append(f'{url}: unexpected sitemap URL format')
        metadata = page['metadata']
        description = [m['value'] for m in metadata if m['key'] == 'description']
        values = {'title': page['title'], 'description': description,
                  'canonical': page['canonical']}
        for field, items in values.items():
            if len(items) != 1 or not items[0].strip():
                errors.append(f'{relative}: missing or repeated {field}')
                continue
            normalized = ' '.join(items[0].split()).casefold()
            if normalized in seen[field]:
                errors.append(f'{relative}: duplicate {field}')
            seen[field].add(normalized)
        if page['canonical'] != [url]:
            errors.append(f'{relative}: canonical differs from sitemap URL')
        if sum(h['tag'] == 'h1' for h in page['headings']) != 1:
            errors.append(f'{relative}: expected one H1')
        for meta in metadata:
            if meta['key'].lower() in ('robots', 'googlebot'):
                directives = re.split(r'[\s,]+', meta['value'].lower())
                if {'noindex', 'none'} & set(directives):
                    errors.append(f'{relative}: sitemap page blocks indexing')
        for node in objects(page['schemas']):
            if node.get('@type') != 'LocalBusiness':
                continue
            business_count += 1
            for field in ('name', 'telephone'):
                if node.get(field) != reference.get(field):
                    errors.append(f'{relative}: inconsistent business {field}')
            for field in ('addressLocality', 'addressRegion', 'addressCountry'):
                if node.get('address', {}).get(field) != reference['address'].get(field):
                    errors.append(f'{relative}: inconsistent business {field}')
    if errors:
        raise ValueError('\n'.join(errors))
    print(f'Local SEO integrity ok: {len(urls)} sitemap pages, '
          f'{business_count} consistent LocalBusiness records. '
          'Local HTML checks only; Google indexation and business facts require external verification.')


if __name__ == '__main__':
    validate()
