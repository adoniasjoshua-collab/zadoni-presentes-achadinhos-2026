import assert from "node:assert/strict";
import fs from "node:fs";

const pagePath = "cesta-cafe-da-manha-canaa/index.html";
const source = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync("assets/css/style.css", "utf8");
const generator = fs.readFileSync("scripts/generate-seo-pages.mjs", "utf8");
const app = fs.readFileSync("assets/js/app.js", "utf8");

assert.ok(
  source.includes('<link rel="canonical" href="https://zadonipresentes.com.br/cesta-cafe-da-manha-canaa/">'),
  "A URL canônica da página foi alterada"
);
assert.ok(
  source.includes("<h1>Cesta de Café da Manhã em Canaã dos Carajás</h1>"),
  "O H1 local da página foi alterado"
);

assert.ok(source.includes('id="cafe-gallery-addons"'), "A galeria deve exibir a selecao de adicionais para cafe");
assert.ok(source.includes('id="cafe-gallery-addons-options"'), "O destino da lista de adicionais para cafe esta ausente");

const figures = [...source.matchAll(/<figure class="seo-gallery-item"[^>]*>([\s\S]*?)<\/figure>/g)];
assert.equal(figures.length, 12, "A galeria deve exibir os 11 modelos anteriores e a nova cesta artesanal");

let optionCount = 0;
figures.forEach(([ , figure], index) => {
  const links = [...figure.matchAll(/<a class="btn-whatsapp-produto seo-gallery-cta" href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
  assert.equal(links.length, 1, `Modelo ${index + 1}: um link direto`);
  const [, href, label] = links[0];
  assert.equal(label, "Quero esta cesta");
  const url = new URL(href.replaceAll("&amp;", "&"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5594992993138");
  const message = url.searchParams.get("text") || "";
  assert.match(message, /Modelo: .+/);
  assert.match(message, /Resumo: .+/);
  const image = new URL(figure.match(/<img[^>]+src="([^"]+)"/)[1], "https://zadonipresentes.com.br/cesta-cafe-da-manha-canaa/");
  assert.ok(message.includes(`Imagem do modelo: ${image.href}`));
  assert.ok(fs.existsSync(decodeURI(image.pathname.slice(1))));
  optionCount++;
});

for (const selector of [
  ".seo-gallery-grid--budget",
  ".seo-gallery-budget-options",
  ".seo-gallery-budget-option",
  ".seo-gallery-budget-help",
  ".seo-gallery-addons",
  ".seo-gallery-addons-total"
]) {
  assert.ok(css.includes(selector), `CSS ausente para ${selector}`);
}

assert.ok(generator.includes("galleryBudgetTiers: BASKET_BUDGET_TIERS"));
assert.ok(generator.includes('galleryExtras: "cafe"'));
assert.ok(app.includes("inicializarAdicionaisGaleriaCafe()"));
assert.ok(app.includes("adicionarExtrasAoLinkWhatsApp"));
assert.ok(
  app.includes("img.src = criarUrlAbsoluta(adicional.imagem)"),
  "As imagens dos adicionais devem ser resolvidas a partir da raiz do site"
);
assert.ok(
  app.includes("new URL(caminhoDesdeRaiz, window.location.origin).href"),
  "O resolvedor de imagens deve funcionar tambem nas paginas internas"
);
assert.ok(
  source.includes("assets/js/app.js?v=20260920-cafe-whatsapp-direto-1"),
  "A pagina de cafe deve usar a versao atual do JavaScript"
);
assert.equal(optionCount, 12);

console.log("Cafe: 12 links diretos com resumo e imagem correspondente validados.");
