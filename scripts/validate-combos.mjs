import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const slug = 'combos-pastel-canaa';
const data = JSON.parse(read(`${slug}/catalogo.json`));
const html = read(`${slug}/index.html`);
assert.equal(data.status, 'ready');
assert.equal(data.phone, '5594992993138');
assert.equal(data.delivery.price, 500);
assert.equal(data.price, 2000, 'Combo = 1 pastel + canned soda for R$20, same for every flavor');
assert(!('combos' in data), 'Tiered 1/2/3-pastel pricing was retired');
assert.deepEqual(data.flavors.map(f => f.id), ['carne-queijo', 'frango-queijo', 'queijo-presunto']);
assert(data.delivery.areas.length, 'Delivery area must be stated');
assert(data.flavors.every(f => f.image), 'Every flavor card needs an image');
assert.equal(data.duplo.price, 3000);
assert.equal(data.duplo.drinks, 1);
assert.equal((html.match(/data-configurator/g) || []).length, 2);
for (const id of ['combo-individual', 'combo-duplo']) {
  const card = html.split(`id="${id}" data-flavor="${id}"`)[1]?.split('</article>')[0] || '';
  assert(card.includes('name="flavor1"'));
  assert(card.includes('Observações do pedido'));
  assert(!card.includes('data-card-send'), 'Orders are sent only from the single summary');
  assert(card.includes('class="flavor-choices"') && card.includes('data-add') && card.includes('data-cancel'));
  assert(card.includes('1 refrigerante em lata'));
}
assert.equal((html.match(/data-send-order/g) || []).length, 1, 'Exactly one send button: the order summary');
assert(!html.includes('data-bar-send'), 'Sticky bar points to the summary instead of sending');
assert.deepEqual(data.extras.map(e => e.price), [600, 1000, 500, 200, 1000, 4000, 5500, 6900]);
assert.equal(new Set(data.extras.map(e => e.id)).size, data.extras.length);
assert(data.drinks.every(d => d.id && d.name && Number.isInteger(d.price) && d.price >= 0));
assert.equal(new Set(data.drinks.map(d => d.id)).size, data.drinks.length);
assert.deepEqual(data.drinks.map(d => [d.id, d.price]), [['refrigerante', 0], ['suco', 700]], 'Canned soda included; juice adds R$7 per drink');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(html.includes('<meta name="robots" content="index, follow">'));
assert(html.includes(`rel="canonical" href="https://zadonipresentes.com.br/${slug}/"`));
assert.equal(read('sitemap.xml').split(`<loc>https://zadonipresentes.com.br/${slug}/</loc>`).length, 2, 'Exactly one sitemap entry');
for (const [file, href] of [['index.html', `${slug}/`], ['presentes-canaa.html', `${slug}/`], ['links/index.html', `../${slug}/`]]) assert(read(file).includes(`href="${href}"`), 'Missing discovery link in ' + file);
assert(html.includes('AW-16938428518') && html.includes('fbq('), 'Released page keeps the shared Google Ads and Meta tracking');
const schema = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(schema['@graph'].map(s => s['@type']), ['CollectionPage', 'BreadcrumbList', 'ItemList']);
assert(!/"@type":"(Product|Restaurant)"|aggregateRating|InStock/.test(html));
assert.deepEqual(JSON.parse(html.match(/id="combos-data" type="application\/json">([\s\S]*?)<\/script>/)[1]), data);
for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^https?:|^#/.test(value)) continue;
  const target = value.split(/[?#]/)[0];
  const resolved = path.resolve(root, slug, target, target.endsWith('/') ? 'index.html' : '');
  assert(fs.existsSync(resolved), 'Broken local resource: ' + value);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Unique IDs');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), 'Missing anchor ' + id);
const before = JSON.parse(read('docs/combos-preservation-before-20260928.json'));
// Release integration edits only these files; validate-ux-cro.py limits them to the
// approved link additions (docs/seo-approved-additions-20260928.json) and one sitemap entry.
const integration = new Set(['index.html', 'links/index.html', 'presentes-canaa.html', 'sitemap.xml']);
// Home category card for the combos (image + five-column grid). Undoing exactly these
// edits must reproduce the original bytes, so any other change still fails.
const approvedEdits = {
  'assets/css/storefront.css': [[`.home-categories .category-card[href="combos-pastel-canaa/"] .category-icon { background-image: url('../optimized/combos/categoria-pastel-480.webp'); }\n`, '']],
  'assets/css/ux-cro.css': [
    ['[data-ux-cro] .home-categories > .container > .grid { grid-template-columns: repeat(5, minmax(0,1fr)); }', '[data-ux-cro] .home-categories > .container > .grid { grid-template-columns: repeat(4, minmax(0,1fr)); }'],
    ['\n  [data-ux-cro] .home-categories > .container > .grid > .category-card:last-child:nth-child(odd) { grid-column: 1 / -1; }', '']
  ]
};
for (const [file, hash] of Object.entries(before.files)) {
  if (integration.has(file)) continue;
  // Line endings normalized so Windows (CRLF) and CI (LF) checkouts hash alike.
  let content = fs.readFileSync(path.join(root, file)).toString('utf8').replaceAll('\r\n', '\n');
  for (const [added, original] of approvedEdits[file] || []) {
    assert.equal(content.split(added).length, 2, 'Approved edit missing or duplicated in ' + file);
    content = content.replace(added, original);
  }
  content = Buffer.from(content, 'utf8').toString('latin1');
  assert.equal(crypto.createHash('sha256').update(content, 'latin1').digest('hex'), hash, 'Existing site changed: ' + file);
}
const generated = spawnSync(process.execPath, ['scripts/generate-combos.mjs', '--check'], { cwd: root, encoding: 'utf8' });
assert.equal(generated.status, 0, generated.stderr);
console.log(`Combos release: prices, semantics, resources, sitemap, discovery links, source sync and ${Object.keys(before.files).length - integration.size} existing files preserved byte-for-byte.`);
