import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { META_PIXEL_ID, metaPixelHead, metaPixelBody } from './meta-pixel-snippet.mjs';

const pages = [
  'index.html', 'presentes-canaa.html', '404.html', 'links/index.html',
  'presentes-canaa-dos-carajas/index.html', 'buques-canaa-dos-carajas/index.html',
  'floricultura-canaa-dos-carajas/index.html', 'cestas-de-presente-canaa/index.html',
  'cesta-cafe-da-manha-canaa/index.html', 'cesta-de-aniversario-canaa/index.html',
  'presentes-romanticos-canaa/index.html', 'rosas-perfumadas-canaa/index.html',
  'revenda-chocolates-canaa/index.html', 'perfumaria-cosmeticos-canaa/index.html',
  'monte-sua-cesta/index.html', 'achadinhos/index.html',
  'achadinhos/presentes-criativos/index.html',
  'achadinhos/presentes-de-aniversario/index.html',
  'achadinhos/presentes-para-namorada/index.html'
];
const code = metaPixelHead.match(/<script>([\s\S]*?)<\/script>/)[1];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)[1];
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)[1];
  assert.equal(html.split(metaPixelHead).length - 1, 1, `${page}: base count`);
  assert.equal(html.split(metaPixelBody).length - 1, 1, `${page}: fallback count`);
  assert.ok(head.includes(metaPixelHead), `${page}: base belongs in head`);
  assert.ok(body.includes(metaPixelBody), `${page}: fallback belongs in body`);
  const remaining = html.replace(metaPixelHead, '').replace(metaPixelBody, '');
  assert.ok(!/\bfbq\b|fbevents\.js|facebook\.com\/tr|connect\.facebook\.net/i.test(remaining), `${page}: extra Meta installation`);
}

// Execute twice before library arrival, after arrival, and with an existing fbq.
for (const alreadyLoaded of [false, true]) {
  let loads = 0;
  const calls = [];
  const context = {
    document: {
      createElement(tag) { assert.equal(tag, 'script'); return {}; },
      getElementsByTagName() {
        return [{ parentNode: { insertBefore(script) {
          assert.equal(script.src, 'https://connect.facebook.net/en_US/fbevents.js');
          assert.equal(script.async, true);
          loads++;
        } } }];
      }
    }
  };
  context.window = context;
  if (alreadyLoaded) context.fbq = (...args) => calls.push(args);
  vm.createContext(context);
  vm.runInContext(code, context);
  vm.runInContext(code, context);
  if (!alreadyLoaded) {
    calls.push(...context.fbq.queue.map(args => Array.from(args)));
    context.fbq.callMethod = (...args) => calls.push(args);
    vm.runInContext(code, context);
  }
  assert.equal(loads, alreadyLoaded ? 0 : 1);
  assert.equal(JSON.stringify(calls), JSON.stringify([
    ['init', META_PIXEL_ID], ['track', 'PageView']
  ]));
}

for (const file of ['assets/js/app.js', 'assets/js/ux-cro.js', 'assets/js/google-ads-whatsapp.js']) {
  assert.ok(!/\bfbq\b|fbevents\.js|connect\.facebook\.net/.test(fs.readFileSync(file, 'utf8')), `${file}: second mechanism`);
}
for (const file of ['generate-seo-pages.mjs', 'generate-achadinhos-pages.mjs', 'generate-perfumaria.mjs']) {
  const source = fs.readFileSync('scripts/' + file, 'utf8');
  assert.equal(source.split('${metaPixelHead}').length - 1, 1, file);
  assert.equal(source.split('${metaPixelBody}').length - 1, 1, file);
}
console.log(`Meta Pixel ${META_PIXEL_ID}: 19 pages; one init and PageView per document; repeat execution and existing library passed.`);
