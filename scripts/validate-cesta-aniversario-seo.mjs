import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGE = "cesta-de-aniversario-canaa/index.html";
const CANONICAL = "https://zadonipresentes.com.br/cesta-de-aniversario-canaa/";
const PHONE = "5594992993138";

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const html = read(PAGE);

assert.match(html, /<title>Cesta de Aniversário em Canaã dos Carajás \| Zadoni<\/title>/);
assert.match(html, /<meta name="description" content="[^"]+">/);
assert.match(html, new RegExp(`<link rel="canonical" href="${CANONICAL}">`));
assert.equal((html.match(/<h1\b/g) || []).length, 1, "A página deve ter exatamente um H1");
assert.ok(!/<meta[^>]+noindex/i.test(html), "A página não pode ter noindex");
assert.equal((html.match(/class="seo-gallery-item"/g) || []).length, 11, "A página deve ter onze modelos");
assert.equal((html.match(/Modelo em destaque/g) || []).length, 1, "A página deve ter um único modelo em destaque");
assert.equal((html.match(/Escolher e confirmar com a Zadoni/g) || []).length, 11, "Cada modelo deve ter CTA de confirmação");
assert.equal((html.match(/Modelo ilustrativo/g) || []).length, 11, "Cada cesta deve informar que o modelo é ilustrativo");
assert.match(html, /<h2 id="produtos-title">Bolos confeitados para aniversário<\/h2>/);
assert.equal((html.match(/class="produto-card seo-product-card"/g) || []).length, 4, "A página deve exibir quatro bolos de aniversário");
assert.match(html, /<section class="seo-products" id="bolos-aniversario"/);
assert.match(html, /<section class="seo-gallery" id="cestas-aniversario"/);
assert.match(html, /<section class="seo-faq" id="duvidas-aniversario"/);
assert.equal((html.match(/class="section-jump-nav"/g) || []).length, 1, "A página deve ter uma navegação interna");
assert.equal((html.match(/>Consultar este bolo<\/a>/g) || []).length, 4, "Cada bolo deve ter CTA contextual");
assert.equal((html.match(/produto-imagem-link/g) || []).length, 0, "Os bolos não devem desviar para o catálogo geral");
assert.match(html, /href="#bolos-aniversario">Ver bolos e cestas<\/a>/);
for (const cake of [
  "Mini bolo decorado - 1 unidade",
  "Mini bolo de chocolate com morangos",
  "Bolo confeitado feminino - 2 kg",
  "Bolo confeitado especial"
]) {
  assert.ok(html.includes(cake), `Bolo ausente da seção de aniversário: ${cake}`);
}
assert.ok(html.includes("../cestas-de-presente-canaa/"), "Link para a categoria geral ausente");
assert.ok(html.includes("../presentes-canaa.html"), "Link para o catálogo local ausente");
assert.ok(html.includes(PHONE), "WhatsApp local ausente");
assert.ok(html.includes("utm_campaign=seo_local"), "Campanha SEO local ausente");
assert.ok(!html.includes("Categoria Cesta de aniversario"), "Originais não tratados foram referenciados");

const jsonScripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
assert.ok(jsonScripts.length > 0, "JSON-LD ausente");
const schemas = jsonScripts.flatMap(([, json]) => JSON.parse(json.trim()));
const types = new Set(schemas.map((schema) => schema["@type"]));
for (const type of ["WebPage", "BreadcrumbList", "ItemList", "FAQPage"]) {
assert.ok(types.has(type), `Schema ${type} ausente`);
}
assert.equal(schemas.filter((schema) => schema["@type"] === "Product").length, 4, "Schema Product deve listar os quatro bolos");
assert.equal((html.match(/"@type": "Offer"/g) || []).length, 4, "Cada bolo deve ter uma oferta com valor inicial");

const itemList = schemas.find((schema) => schema["@type"] === "ItemList");
assert.equal(itemList.itemListElement.length, 11, "ItemList deve listar os onze modelos");
const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
assert.equal(faq.mainEntity.length, (html.match(/<details>/g) || []).length, "FAQ visível e schema divergentes");

for (const image of JSON.parse(read("assets/data/cestas-aniversario.json"))) {
  assert.ok(html.includes(image.src), `Imagem ausente da página: ${image.src}`);
  assert.ok(fs.existsSync(path.join(ROOT, image.src)), `Arquivo ausente: ${image.src}`);
  assert.ok(fs.existsSync(path.join(ROOT, image.src480)), `Versão mobile ausente: ${image.src480}`);
}

const sitemap = read("sitemap.xml");
assert.equal((sitemap.match(new RegExp(`<loc>${CANONICAL}<\\/loc>`, "g")) || []).length, 1, "URL nova deve aparecer uma vez no sitemap");
assert.ok(read("cestas-de-presente-canaa/index.html").includes("../cesta-de-aniversario-canaa/"), "Link interno da página geral de cestas ausente");

console.log("Cesta de aniversário SEO validation ok: 11 cestas, 4 bolos confeitados e schemas coerentes.");
