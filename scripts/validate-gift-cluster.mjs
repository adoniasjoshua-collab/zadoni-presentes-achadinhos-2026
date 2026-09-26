import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { metaPixelHead, metaPixelBody } from './meta-pixel-snippet.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://zadonipresentes.com.br';
const pages = ['presentes-de-natal-canaa-dos-carajas', 'guias-de-presentes', 'mensagens-para-acompanhar-presentes'];
const required = [
  ['cestas-de-presente-canaa/', 'cesta-cafe-da-manha-canaa/', 'presentes-romanticos-canaa/', 'rosas-perfumadas-canaa/', 'monte-sua-cesta/', 'guias-de-presentes/', 'mensagens-para-acompanhar-presentes/'],
  ['presentes-canaa.html', 'achadinhos/presentes-para-namorada/', 'presentes-romanticos-canaa/', 'cesta-de-aniversario-canaa/', 'buques-canaa-dos-carajas/', 'cestas-de-presente-canaa/', 'presentes-de-natal-canaa-dos-carajas/', 'mensagens-para-acompanhar-presentes/'],
  ['guias-de-presentes/', 'presentes-de-natal-canaa-dos-carajas/', 'presentes-romanticos-canaa/', 'cesta-de-aniversario-canaa/']
];
const read = p => fs.readFileSync(path.join(root, p), 'utf8').replaceAll('\r\n', '\n');
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const sitemap = read('sitemap.xml');
const titles = new Set(), descriptions = new Set();
for (const [index, slug] of pages.entries()) {
  const html = read(slug + '/index.html');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, slug + ': one H1');
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(canonical, `${site}/${slug}/`);
  assert.equal(sitemap.split(`<loc>${canonical}</loc>`).length - 1, 1, slug + ': one canonical in sitemap');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const description = html.match(/name="description" content="([^"]+)"/)[1];
  assert(!titles.has(title) && !descriptions.has(description), slug + ': unique metadata');
  titles.add(title); descriptions.add(description);
  for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) assert(html.includes(`="${key}"`));
  assert(html.includes('lang="pt-BR"'));
  assert(!/noindex|"@type":\s*"Product"|entrega imediata|melhor preço|disponível hoje|entrega garantida/i.test(html));
  for (const target of required[index]) assert(html.includes(`href="../${target}"`), slug + ': required link ' + target);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, slug + ': unique IDs');
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const value = decode(raw);
    const url = new URL(value, canonical);
    if (url.origin === site) {
      const target = path.join(root, decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
      assert(fs.existsSync(target), `${slug}: broken ${attr} ${value}`);
      if (url.hash) assert(read(path.relative(root, target)).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), 'Missing fragment: ' + value);
    }
    if (url.hostname === 'wa.me') assert.equal(url.pathname, '/5594992993138');
  }
  const schema = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema.map(x => x['@type']), ['WebPage', 'BreadcrumbList', 'FAQPage']);
  for (const q of schema[2].mainEntity) {
    assert(html.includes(`<summary>${q.name}</summary>`));
    assert(html.includes(`<p>${q.acceptedAnswer.text}</p>`));
  }
  assert.equal(html.split(metaPixelHead).length - 1, 1, slug + ': shared pixel');
  assert.equal(html.split(metaPixelBody).length - 1, 1, slug + ': shared pixel fallback');
  assert.equal((html.match(/google-ads-whatsapp\.js/g) || []).length, 1);
  assert.equal((html.match(/gtag\('config', 'AW-16938428518'\)/g) || []).length, 1);
  if (index > 0) {
    assert(/<form[^>]+data-gift-form hidden/.test(html), 'Enhancement hidden until available');
    assert(html.includes('Prefiro conversar direto no WhatsApp'));
    for (const name of ['recipient','occasion','style','budget','message','fulfillment','notes']) assert(html.includes(`name="${name}"`));
    assert(html.includes('<noscript><p>Para receber sugestões'));
  }
}
console.log('Gift cluster: 3 pages, canonical/sitemap, metadata, links/assets/fragments, schema/visible FAQ, shared tracking and fallback passed.');
