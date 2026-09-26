"""Compare release semantics; keep the pre-commercial snapshot available for audit."""
from collections import Counter
import json
import re
import sys
from pathlib import Path
from seo_baseline import ROOT, collect, Document

historical = '--pre-commercial' in sys.argv
baseline_name = 'seo-before-ux-cro-20260919.json' if historical else 'seo-release-20260923.json'
blocks_name = 'seo-protected-blocks-ux-cro-20260919.json' if historical else 'seo-protected-blocks-release-20260923.json'
baseline = json.loads((ROOT / 'docs' / baseline_name).read_text(encoding='utf-8'))
before = baseline['snapshot']
protected_blocks = json.loads((ROOT / 'docs' / blocks_name).read_text(encoding='utf-8'))
approved_additions = {} if historical else json.loads((ROOT / 'docs/seo-approved-additions-20260926.json').read_text(encoding='utf-8'))
after = collect()
failures = []
results = []
def bag(items):
    return Counter(json.dumps(item, ensure_ascii=False, sort_keys=True) for item in items)

if before['protectedFiles'] != after['protectedFiles']:
    failures.append('Protected data, robots, sitemap or redirects changed')
if before['pages'].keys() != after['pages'].keys():
    failures.append('Public HTML paths changed')
for page, old in before['pages'].items():
    new = after['pages'][page]
    issues = []
    # These blocks were captured from the recorded revision (tracked HTML clean).
    # Persisted separately so shallow CI checkouts need no historical Git object.
    original = protected_blocks[page]
    current_source = (ROOT / page).read_text(encoding='utf-8')
    new_nodes = list(Document(current_source).root.walk())
    for tag in ('p', 'li'):
        if bag(original[tag]) - bag([n.text() for n in new_nodes if n.tag == tag]):
            issues.append('Original text blocks: ' + tag)
    def first_paragraph(nodes):
        h1_seen = False
        for node in nodes:
            if node.tag == 'h1': h1_seen = True
            if h1_seen and node.tag == 'p': return node.text()
    if original['first'] != first_paragraph(new_nodes):
        issues.append('First principal paragraph')
    def scripts(nodes):
        return [n.attrs.get('src') or n.raw() for n in nodes if n.tag == 'script']
    def script_versions(items):
        return [re.sub(r'^((?:\.\./)?(?:assets/)?js/app\.js)\?v=[^\s]+$', r'\1', item) for item in items]
    if bag(script_versions(original['scripts'])) - bag(script_versions(scripts(new_nodes))):
        issues.append('Existing scripts or analytics integration')
    for field in ('hreflang',):
        old_links = original['hreflang']
        new_links = [n.attrs for n in new_nodes if n.tag == 'link' and field in n.attrs]
        if old_links != new_links: issues.append(field)
    for field in ('url', 'title', 'metadata', 'canonical', 'schemas', 'breadcrumbs'):
        if old[field] != new[field]:
            issues.append(field)
    for field in ('links', 'images', 'pictureSources'):
        added = bag(new[field]) - bag(old[field])
        # Explicit release additions only; removals and unrelated additions still fail.
        added -= bag(approved_additions.get(page, {}).get(field, []))
        if field == 'links' and page == 'monte-sua-cesta/index.html':
            # Single approved additive fallback; no prior link may be removed.
            added -= bag([{'href': 'https://wa.me/5594992993138?text=Ola!%20Quero%20ajuda%20para%20escolher%20um%20presente%20em%20Canaa%20dos%20Carajas.', 'text': 'Pedir ajuda para montar minha cesta no WhatsApp', 'internal': False, 'rel': 'noopener noreferrer'}])
        if bag(old[field]) - bag(new[field]) or added:
            issues.append(field)
    for heading in ('h1',):
        if [h for h in old['headings'] if h['tag'] == heading] != [h for h in new['headings'] if h['tag'] == heading]:
            issues.append(heading)
    if bag(old['headings']) - bag(new['headings']):
        issues.append('Removed or rewritten heading')
    # All original words retained with their multiplicity. Reordering entire
    # sections and adding short interface labels is expressly allowed.
    if Counter(old['mainText'].split()) - Counter(new['mainText'].split()):
        issues.append('Removed indexed text')
    # Existing FAQ strings must survive; new non-FAQ details are allowed.
    if bag(old['faq']) - bag(new['faq']):
        issues.append('FAQ')
    failures.extend(page + ': ' + issue for issue in issues)
    results.append({'page': page, 'passed': not issues, 'issues': issues})
report = {'passed': not failures, 'pages': len(results), 'failures': failures,
          'scope': 'Exact metadata/schema/links/images/data; all original headings, FAQ and indexed words retained. Section ordering and interface labels allowed.', 'results': results}
(ROOT / 'docs' / ('seo-comparison-pre-commercial.json' if historical else 'seo-comparison-release-20260923.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report, ensure_ascii=True))
raise SystemExit(bool(failures))
