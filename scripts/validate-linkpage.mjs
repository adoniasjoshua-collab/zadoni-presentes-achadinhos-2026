import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync("links/index.html", "utf8");
const css = fs.readFileSync("assets/css/links.css", "utf8");
const js = fs.readFileSync("assets/js/links.js", "utf8");
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
const home = fs.readFileSync("index.html", "utf8");
const seoGenerator = fs.readFileSync("scripts/generate-seo-pages.mjs", "utf8");
const achadinhosGenerator = fs.readFileSync("scripts/generate-achadinhos-pages.mjs", "utf8");

assert.match(html, /<meta name="robots" content="noindex, follow">/);
assert.match(html, /<link rel="canonical" href="https:\/\/zadonipresentes\.com\.br\/links\/">/);
assert.ok(!sitemap.includes("/links/"), "A linkpage não deve entrar no sitemap indexável");
assert.ok(home.includes('<a href="links/">Links oficiais</a>'), "Acesso pelo rodapé da Home ausente");
assert.ok(seoGenerator.includes('${prefix}links/'), "Acesso nos rodapés das páginas locais ausente");
assert.ok(achadinhosGenerator.includes('${prefix}links/'), "Acesso nos rodapés dos Achadinhos ausente");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "A linkpage deve ter um único H1");
assert.equal((html.match(/data-choice=/g) || []).length, 3, "Devem existir três caminhos guiados");
assert.equal((html.match(/data-panel=/g) || []).length, 3, "Cada caminho deve ter um painel correspondente");
assert.ok(html.includes("../achadinhos/"), "Destaque dos Achadinhos ausente");
assert.ok(html.includes("../achadinhos/presentes-para-namorada/"), "Guia para namorada ausente");
assert.ok(html.includes("../achadinhos/presentes-criativos/"), "Guia de presentes criativos ausente");
assert.ok(html.includes("../achadinhos/presentes-de-aniversario/"), "Guia de aniversário ausente");
assert.ok(html.includes("https://wa.me/5594992993138"), "WhatsApp principal ausente");
assert.ok(html.includes("data-bio-link="), "Links sem instrumentação própria");
assert.ok(js.includes('"bio_select_path"') && js.includes('"bio_click_link"'), "Eventos da linkpage ausentes");
assert.ok(css.includes("min-height: 44px") && css.includes("prefers-reduced-motion"), "Requisitos básicos de acessibilidade ausentes");
assert.ok(!html.match(/https:\/\/(?:cdn|fonts)\./), "A linkpage não deve depender de CDN ou fonte externa");

for (const [, href] of html.matchAll(/href="(\.\.\/[^"?#]+)"/g)) {
  const target = path.resolve("links", href.endsWith("/") ? `${href}index.html` : href);
  assert.ok(fs.existsSync(target), `Destino interno ausente: ${href}`);
}

console.log("Linkpage validation ok: noindex, three guided paths, local links, Achadinhos and analytics preserved.");
