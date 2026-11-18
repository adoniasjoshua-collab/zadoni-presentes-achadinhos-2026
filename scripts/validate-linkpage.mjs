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
// 17/11/2026: ordem pedida pelo dono (café, aniversário, buquês naturais), foto em cada atalho e WhatsApp fixo no rodapé.
const order = ["cesta_cafe", "cestas_aniversario", "buques_naturais"].map((id) => html.indexOf(`data-bio-link="${id}"`));
assert.ok(order.every((i) => i > 0) && order[0] < order[1] && order[1] < order[2], "Ordem dos mais pedidos: café, aniversário, buquês naturais");
assert.ok(html.indexOf('data-bio-link="buques_naturais"') < html.indexOf('data-bio-link="presentes_natal"'), "Os 3 mais pedidos vêm antes da lista");
assert.match(html, /<div class="whatsapp-dock">\s*<a class="whatsapp-button" href="https:\/\/wa\.me\/5594992993138[^"]*"[^>]*data-bio-link="whatsapp_principal"/, "WhatsApp principal fixo no rodapé");
assert.ok(css.includes(".whatsapp-dock") && /\.whatsapp-dock \{[^}]*position: fixed/.test(css), "Barra do WhatsApp deve ser fixa");
for (const [, tag] of html.matchAll(/(<a [^>]*data-bio-group="(?:destaque|local)"[^>]*>[\s\S]*?<\/a>)/g)) {
  assert.match(tag, /<img [^>]*src="\.\.\/assets\/optimized\/links\/links-[a-z-]+-\d+\.webp"[^>]*width="\d+" height="\d+"/, `Atalho sem foto otimizada: ${tag.slice(0, 90)}`);
}
assert.equal((html.match(/fetchpriority="high"/g) || []).length, 2, "Só a foto do café (img e preload) carrega com prioridade");
assert.ok(!html.includes("R$"), "A página de links não mostra preços (decisão do dono em 17/11/2026)");
assert.ok(!html.includes("todo o Brasil"), "Texto nacional removido da página de links");
assert.ok(html.includes('../buques-canaa-dos-carajas/'), "Atalho direto para Buquês ausente");
assert.ok(html.includes('../cesta-cafe-da-manha-canaa/'), "Atalho direto para cesta de café ausente");
assert.ok(html.includes('../cesta-de-aniversario-canaa/'), "Atalho direto para cesta de aniversário ausente");
assert.ok(html.includes('../floricultura-canaa-dos-carajas/'), "Atalho direto para Floricultura ausente");
assert.ok(html.includes('../monte-sua-cesta/'), "Atalho direto para Monte sua cesta ausente");
assert.ok(html.includes('../presentes-canaa.html'), "Atalho para o catálogo completo ausente");
assert.ok(html.includes('class="pick-badge">Mais pedido</span>'), "Selo de mais pedido da cesta de café ausente");
// F3-C2: bio só com Zadoni — sem Achadinhos; Natal e namorada como atalhos locais; pastel mantido por decisão do dono.
assert.ok(!html.includes("achadinhos/"), "A linkpage não deve apontar para os Achadinhos");
assert.ok(html.includes('../presentes-de-natal-canaa-dos-carajas/'), "Atalho para presentes de Natal ausente");
assert.ok(html.includes('../presentes-romanticos-canaa/'), "Atalho para presentes para namorada ausente");
assert.ok(html.includes('../combos-pastel-canaa/'), "Atalho do pastel ausente");
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

console.log("Linkpage validation ok: noindex, top 3 (café, aniversário, buquês naturais) with photos, fixed WhatsApp, no prices, no Achadinhos, analytics preserved.");
