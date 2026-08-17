import fs from "node:fs";

const pages = [
  "presentes-canaa.html",
  "presentes-canaa-dos-carajas/index.html",
  "buques-canaa-dos-carajas/index.html",
  "cestas-de-presente-canaa/index.html",
  "floricultura-canaa-dos-carajas/index.html",
  "presentes-romanticos-canaa/index.html",
  "rosas-perfumadas-canaa/index.html",
  "cesta-cafe-da-manha-canaa/index.html"
];

let productButtons = 0;
let galleryButtons = 0;
let galleryBudgetButtons = 0;
const errors = [];
const linkPattern = /<a class="([^"]+)" href="([^"]+)"/g;

for (const page of pages) {
  const source = fs.readFileSync(page, "utf8");

  for (const match of source.matchAll(linkPattern)) {
    const classes = match[1];
    const isProductButton = classes.includes("btn-whatsapp-produto");
    const isGalleryBudgetButton = classes.includes("seo-gallery-budget-option");
    if (!isProductButton && !isGalleryBudgetButton) continue;

    const href = match[2].replaceAll("&amp;", "&");
    const message = new URL(href).searchParams.get("text") || "";

    if (classes.includes("seo-gallery-cta") || isGalleryBudgetButton) {
      galleryButtons += 1;
      const validGalleryMessage =
        message.includes("Modelo:") &&
        message.includes("Resumo:") &&
        message.includes("Imagem do modelo: https://zadonipresentes.com.br/");

      if (!validGalleryMessage) {
        errors.push(`${page}: botão de galeria sem resumo ou imagem pública`);
      }
      if (isGalleryBudgetButton) {
        galleryBudgetButtons += 1;
        const validBudgetMessage =
          message.includes("Faixa escolhida:") &&
          message.includes("Orçamento de referência:") &&
          message.includes("Composição sugerida:");

        if (!validBudgetMessage) {
          errors.push(`${page}: opção de orçamento sem faixa, valor ou composição sugerida`);
        }
      }
      continue;
    }

    productButtons += 1;
    const validProductMessage =
      message.includes("Produto:") &&
      message.includes("Categoria:") &&
      message.includes("Valor anunciado:") &&
      message.includes("Resumo:") &&
      message.includes("Imagem do produto: https://zadonipresentes.com.br/");

    if (!validProductMessage) {
      errors.push(`${page}: botão de produto sem resumo ou imagem pública`);
    }
  }
}

if (productButtons === 0) errors.push("Nenhum botão de produto encontrado");
if (galleryButtons === 0) errors.push("Nenhum botão de galeria encontrado");
if (galleryBudgetButtons === 0) errors.push("Nenhuma faixa de orçamento da galeria encontrada");

if (errors.length) {
  throw new Error(errors.join("\n"));
}

console.log(
  `WhatsApp product summary validation ok: ${productButtons} product buttons, ${galleryButtons} gallery buttons and ${galleryBudgetButtons} budget options`
);
