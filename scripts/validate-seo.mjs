import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SITE = "https://zadonipresentes.com.br";
const pages = [
  "index.html",
  "presentes-canaa.html",
  "presentes-canaa-dos-carajas/index.html",
  "buques-canaa-dos-carajas/index.html",
  "cestas-de-presente-canaa/index.html",
  "cesta-de-aniversario-canaa/index.html",
  "floricultura-canaa-dos-carajas/index.html",
  "cesta-cafe-da-manha-canaa/index.html",
  "monte-sua-cesta/index.html",
  "presentes-romanticos-canaa/index.html",
  "rosas-perfumadas-canaa/index.html",
  "revenda-chocolates-canaa/index.html",
  "404.html"
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function localTargetExists(fromFile, href) {
  if (!href || href.startsWith("#") || /^[a-z]+:/i.test(href)) return true;

  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true;

  const baseDir = path.dirname(path.join(ROOT, fromFile));
  const target = path.resolve(baseDir, clean);

  if (href.endsWith("/")) return fs.existsSync(path.join(target, "index.html"));
  if (path.extname(target)) return fs.existsSync(target);
  return fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
}

const productContext = {};
vm.runInNewContext(`${read("assets/data/produtos.js")}\nglobalThis.__produtosLocais = produtosLocais;`, productContext);
const products = productContext.__produtosLocais;
const productsById = new Map(products.map((product) => [String(product.id), product]));
const sitemap = read("sitemap.xml");

for (const page of pages) {
  const content = read(page);
  assert(/<html[^>]+lang=["']pt-BR["']/i.test(content), `${page}: lang pt-BR ausente`);

  if (page !== "404.html") {
    const h1Count = (content.match(/<h1\b/gi) || []).length;
    assert(h1Count === 1, `${page}: esperado 1 H1, encontrado ${h1Count}`);
    assert(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/zadonipresentes\.com\.br\//i.test(content), `${page}: canonical absoluto ausente`);
    assert(/property=["']og:title["']/i.test(content), `${page}: og:title ausente`);
    assert(/name=["']twitter:card["']/i.test(content), `${page}: twitter card ausente`);

    const canonical = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
    assert(sitemap.includes(`<loc>${canonical}</loc>`), `${page}: canonical ausente do sitemap.xml`);
  }

  const jsonScripts = [...content.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (page !== "index.html" && page !== "404.html") {
    assert(jsonScripts.length > 0, `${page}: JSON-LD ausente`);
  }
  for (const [, json] of jsonScripts) {
    JSON.parse(json.trim());
  }

  const hrefs = [...content.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    assert(localTargetExists(page, href), `${page}: link interno quebrado ${href}`);
  }

  const productCards = [...content.matchAll(/<article\b[^>]*\bid=["']produto-(\d+)["'][\s\S]*?<\/article>/gi)];
  for (const [cardHtml, id] of productCards) {
    const product = productsById.get(id);
    assert(product, `${page}: card produto-${id} nao existe em assets/data/produtos.js`);
    assert(cardHtml.includes(`data-produto-id="${id}"`), `${page}: card produto-${id} sem data-produto-id consistente`);
    assert(cardHtml.includes(product.nome), `${page}: card produto-${id} nao contem o nome cadastrado ${product.nome}`);
  }
}

const catalog = read("presentes-canaa.html");
for (const product of products) {
  assert(catalog.includes(product.nome), `presentes-canaa.html: produto ausente no HTML ${product.nome}`);
}
assert(!catalog.includes("Nenhum produto encontrado"), "presentes-canaa.html: fallback vazio aparece no HTML inicial");
assert(!/achadinhos|Mercado Livre|afiliad/i.test(catalog), "presentes-canaa.html: referencia antiga de achadinhos encontrada");

console.log(`SEO validation ok: ${pages.length} pages, ${products.length} products`);
