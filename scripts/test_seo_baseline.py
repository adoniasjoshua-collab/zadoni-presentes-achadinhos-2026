import copy
import json
import unittest
from seo_baseline import page_snapshot, differences, classify, sha

HTML = '''<html><head><title>Presentes</title><meta content="Descrição" name="description">
<link href="https://zadonipresentes.com.br/" rel="canonical">
<script type="application/ld+json">{"@type":"Product","offers":{"price":50}}</script>
</head><body><main><h1>Presentes <span>em Canaã</span></h1><p>Entrega local.</p>
<nav aria-label="breadcrumb"><a href="/">Início</a></nav>
<details><summary>Como comprar?</summary><p>Pelo WhatsApp.</p></details>
<picture><source srcset="foto.webp 480w"><img src="foto.jpg" alt="Cesta" width="480" height="480"></picture>
<a href="https://wa.me/5594992993138?text=Oi&amp;x=1">Comprar</a><small>Mais escolhida</small>
</main></body></html>'''


class BaselineTests(unittest.TestCase):
    def test_structured_approval_is_exact_and_opt_in(self):
        change = {'path': '$/pages/new.html', 'before': None, 'after': {'title': ['Perfumaria']}}
        rule = {'path': change['path'], 'valueFormat': 'json',
                'beforeSha256': sha(json.dumps(change['before'], ensure_ascii=False, sort_keys=True)),
                'afterSha256': sha(json.dumps(change['after'], ensure_ascii=False, sort_keys=True))}
        self.assertEqual(classify([change], [rule]), ([change], []))
        altered = dict(change, after={'title': ['Alterado']})
        self.assertEqual(classify([altered], [rule]), ([], [altered]))
        del rule['valueFormat']
        self.assertEqual(classify([change], [rule]), ([], [change]))

    def test_presentation_changes_are_allowed(self):
        modified = HTML.replace('<main>', '<main class="new-layout" style="display:grid">')
        modified = modified.replace('<span>', '<strong>').replace('</span>', '</strong>')
        self.assertEqual(page_snapshot(HTML, 'index.html'), page_snapshot(modified, 'index.html'))

    def test_protected_mutations_fail(self):
        for old, new in [('Presentes', 'Flores'), ('Descrição', 'Outra descrição'),
                         ('"price":50', '"price":51'), ('Entrega local.', 'Entrega nacional.'),
                         ('Como comprar?', 'Outra pergunta?'), ('alt="Cesta"', 'alt=""'),
                         ('foto.webp', 'nova.webp'), ('href="/"', 'href="/outra/"'),
                         ('text=Oi', 'text=Outro'), ('<h1>', '<h2>')]:
            with self.subTest(old=old):
                self.assertTrue(differences(page_snapshot(HTML, 'index.html'),
                                            page_snapshot(HTML.replace(old, new), 'index.html')))

    def test_missing_page_and_robots_fail(self):
        before = {'pages': {'index.html': page_snapshot(HTML, 'index.html')},
                  'protectedFiles': {'robots.txt': 'Allow: /'}}
        after = copy.deepcopy(before)
        after['pages'].clear()
        after['protectedFiles']['robots.txt'] = 'Disallow: /'
        self.assertEqual(len(differences(before, after)), 2)

    def test_approval_is_exact_and_does_not_hide_price_or_title_changes(self):
        old, new = 'Mais escolhida R$ 50', 'Versão intermediária R$ 50'
        rule = {'path': '$/mainText', 'beforeSha256': sha(old), 'afterSha256': sha(new)}
        change = {'path': '$/mainText', 'before': old, 'after': new}
        self.assertEqual(classify([change], [rule]), ([change], []))
        for altered in [dict(change, after=new.replace('50', '51')), dict(change, path='$/title')]:
            self.assertEqual(classify([altered], [rule]), ([], [altered]))

    def test_invalid_json_ld_fails(self):
        with self.assertRaises(ValueError):
            page_snapshot(HTML.replace('"price":50', '"price":broken'), 'index.html')


if __name__ == '__main__':
    unittest.main()
