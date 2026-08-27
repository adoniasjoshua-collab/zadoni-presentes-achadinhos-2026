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
assert.ok(html.indexOf('data-bio-link="whatsapp_principal"') < html.indexOf('data-bio-link="buques_canaa"'), "WhatsApp deve permanecer antes dos atalhos locais");
assert.ok(html.includes('../buques-canaa-dos-carajas/'), "Atalho direto para Buquês ausente");
assert.ok(html.includes('../cesta-cafe-da-manha-canaa/'), "Atalho direto para cesta de café ausente");
assert.ok(html.includes('../cesta-de-aniversario-canaa/'), "Atalho direto para cesta de aniversário ausente");
assert.ok(html.includes('../floricultura-canaa-dos-carajas/'), "Atalho direto para Floricultura ausente");
assert.ok(html.includes('../monte-sua-cesta/'), "Atalho direto para Monte sua cesta ausente");
assert.ok(html.includes('../presentes-canaa.html'), "Atalho para o catálogo completo ausente");
assert.ok(html.includes('class="direct-link-badge">Mais procurado</span>'), "Destaque de Buquês ausente");
assert.ok(html.includes("../achadinhos/"), "Destaque dos Achadinhos ausente");
assert.ok(html.includes("../achadinhos/presentes-para-namorada/"), "Guia para namorada ausente");
assert.ok(html.includes("../achadinhos/presentes-criativos/"), "Guia de presentes criativos ausente");
assert.ok(html.includes("../achadinhos/presentes-de-aniversario/"), "Guia de aniversário ausente");
assert.ok(html.includes("https://wa.me/5594992993138"), "WhatsApp principal ausente");
assert.ok(html.includes("data-bio-link="), "Links sem instrumentação própria");
assert.ok(js.includes('"bio_click_link"'), "Evento de clique da linkpage ausente");
assert.ok(css.includes("min-height: 44px") && css.includes("prefers-reduced-motion"), "Requisitos básicos de acessibilidade ausentes");
assert.ok(css.includes(".direct-link--featured") && css.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "Interface responsiva dos atalhos ausente");
assert.ok(!html.match(/https:\/\/(?:cdn|fonts)\./), "A linkpage não deve depender de CDN ou fonte externa");

for (const [, href] of html.matchAll(/href="(\.\.\/[^"?#]+)"/g)) {
  const target = path.resolve("links", href.endsWith("/") ? `${href}index.html` : href);
  assert.ok(fs.existsSync(target), `Destino interno ausente: ${href}`);
}

console.log("Linkpage validation ok: noindex, direct local links, Achadinhos and analytics preserved.");
