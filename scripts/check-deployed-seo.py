"""Read-only production/source comparison; no credentials or analytics events."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import time
from urllib.request import Request, urlopen
from seo_baseline import ROOT, SITE, collect, differences, page_snapshot


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('Refusing to overwrite historical deployment inspection')
    expected = collect()
    stamp = str(int(time.time()))

    def fetch(relative):
        request = Request(SITE + relative + '?inspect=' + stamp,
                          headers={'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity'})
        with urlopen(request, timeout=30) as response:
            return response.status, response.read().decode('utf-8-sig')

    def inspect_page(relative):
        try:
            status, source = fetch(relative.removesuffix('index.html'))
            changes = differences(expected['pages'][relative], page_snapshot(source, relative))
            return {'page': relative, 'status': status, 'passed': status == 200 and not changes,
                    'differences': [change['path'] for change in changes]}
        except Exception as error:
            return {'page': relative, 'passed': False, 'error': str(error)}

    with ThreadPoolExecutor(max_workers=4) as pool:
        pages = list(pool.map(inspect_page, expected['pages']))
    assets = []
    for relative in ['assets/css/style.css', 'assets/css/storefront.css', 'assets/js/app.js',
                     'monte-sua-cesta/js/configuracao.js', 'sitemap.xml', 'robots.txt']:
        try:
            status, source = fetch(relative)
            matches = source.replace('\r\n', '\n') == (ROOT / relative).read_text(encoding='utf-8-sig')
            assets.append({'path': relative, 'status': status, 'matchesLocal': matches})
        except Exception as error:
            assets.append({'path': relative, 'matchesLocal': False, 'error': str(error)})
    report = {'checkedAtUtc': datetime.now(timezone.utc).isoformat(),
              'localCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
              'pages': pages, 'assets': assets,
              'passed': all(p['passed'] for p in pages) and all(a['matchesLocal'] for a in assets)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{"PASS" if report["passed"] else "FAIL"}: {len(pages)} pages and {len(assets)} assets; {args.output}')
    for row in pages + assets:
        if row.get('passed', row.get('matchesLocal')) is False:
            print(json.dumps(row, ensure_ascii=True))
    return int(not report['passed'])


if __name__ == '__main__':
    raise SystemExit(main())
