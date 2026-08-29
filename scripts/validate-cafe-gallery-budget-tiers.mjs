import assert from "node:assert/strict";
import fs from "node:fs";

const pagePath = "cesta-cafe-da-manha-canaa/index.html";
const source = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync("assets/css/style.css", "utf8");
const generator = fs.readFileSync("scripts/generate-seo-pages.mjs", "utf8");
const app = fs.readFileSync("assets/js/app.js", "utf8");

const expectedTiers = new Map([
  ["basica", { name: "Básica", price: "A partir de R$ 189" }],
  ["intermediaria", { name: "Intermediária", price: "A partir de R$ 270" }],
  ["premium", { name: "Premium", price: "A partir de R$ 300" }]
]);

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

const figures = [...source.matchAll(/<figure class="seo-gallery-item">([\s\S]*?)<\/figure>/g)];
assert.equal(figures.length, 12, "A galeria deve exibir os 11 modelos anteriores e a nova cesta artesanal");

let optionCount = 0;
figures.forEach((figureMatch, index) => {
  const figure = figureMatch[1];
  const expectedModelLabel = index === 11 ? "cesta artesanal com pães" : `modelo ${index + 1}`;
  const links = [...figure.matchAll(/<a class="seo-gallery-budget-option[^"]*" href="([^"]+)"[^>]*data-budget-tier="([^"]+)"/g)];
  assert.equal(links.length, 3, `O modelo ${index + 1} deve oferecer exatamente 3 faixas`);

  const seen = new Set();
  links.forEach(([, encodedHref, tierId]) => {
    const tier = expectedTiers.get(tierId);
    assert.ok(tier, `Faixa desconhecida no modelo ${index + 1}: ${tierId}`);
    assert.ok(!seen.has(tierId), `Faixa repetida no modelo ${index + 1}: ${tierId}`);
    seen.add(tierId);

    const url = new URL(encodedHref.replaceAll("&amp;", "&"));
    const message = url.searchParams.get("text") || "";
    assert.ok(message.includes(`Modelo: ${expectedModelLabel}`));
    assert.ok(message.includes(`Faixa escolhida: ${tier.name}`));
    assert.ok(message.includes(`Orçamento de referência: ${tier.price}`));
    assert.ok(message.includes("Composição sugerida:"));
    assert.ok(message.includes("Imagem do modelo: https://zadonipresentes.com.br/"));
    assert.ok(message.includes("itens, marcas e acabamento podem variar"));
    assert.ok((url.searchParams.get("utm_content") || "").endsWith(`_${tierId}`));
    optionCount += 1;
  });

  assert.equal(seen.size, expectedTiers.size);
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
  source.includes("assets/js/app.js?v=20260829-mobile-catalog-ux-1"),
  "A pagina de cafe deve usar a versao atual do JavaScript"
);
assert.equal(optionCount, 36);

console.log("Café gallery budget validation ok: 12 models x 3 tiers = 36 WhatsApp summaries.");
