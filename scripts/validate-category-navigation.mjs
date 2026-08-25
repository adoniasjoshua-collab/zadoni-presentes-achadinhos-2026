import fs from "node:fs";

const html = fs.readFileSync("presentes-canaa.html", "utf8");
const home = fs.readFileSync("index.html", "utf8");
const section = html.match(/<section class="seo-category-nav"[\s\S]*?<\/section>/)?.[0] || "";
const links = [...section.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map((match) => ({
  href: match[1],
  text: match[2]
}));

const expected = [
  { href: "buques-canaa-dos-carajas/", text: "Buquês em Canaã" },
  { href: "cestas-de-presente-canaa/", text: "Cestas de presente" },
  { href: "cesta-de-aniversario-canaa/", text: "Cesta de aniversário em Canaã" },
  { href: "floricultura-canaa-dos-carajas/", text: "Floricultura em Canaã dos Carajás" },
  { href: "cesta-cafe-da-manha-canaa/", text: "Cesta de café da manhã em Canaã" },
  { href: "presentes-romanticos-canaa/", text: "Presentes românticos" },
  { href: "rosas-perfumadas-canaa/", text: "Rosas e perfumes" },
  { href: "presentes-canaa.html#categoria-adicionais", text: "Itens avulsos para cestas" },
  { href: "presentes-canaa-dos-carajas/", text: "Catálogo local" }
];

const errors = [];

if (!section) errors.push("A seção Categorias de presentes não foi encontrada.");
if (!section.includes('id="categorias-title">Categorias de presentes</h2>')) {
  errors.push("O título e a hierarquia SEO da seção foram alterados.");
}
if (!section.includes('seo-category-group--primary') || !section.includes('seo-category-group--secondary')) {
  errors.push("A hierarquia visual principal/complementar não foi gerada.");
}
if (!home.includes('<li><a href="cesta-de-aniversario-canaa/">Cesta de aniversário</a></li>')) {
  errors.push("O acesso à cesta de aniversário está ausente do menu ou dos links rápidos da Home.");
}
if (!home.includes('<a class="category-card" href="cesta-de-aniversario-canaa/"')) {
  errors.push("O cartão da cesta de aniversário está ausente das opções locais da Home.");
}
if (links.length !== expected.length) {
  errors.push(`Esperados ${expected.length} links, encontrados ${links.length}.`);
}

for (const item of expected) {
  const occurrences = links.filter((link) => link.href === item.href && link.text === item.text).length;
  if (occurrences !== 1) {
    errors.push(`Link SEO ausente, duplicado ou alterado: ${item.text} -> ${item.href}`);
  }
}

if (errors.length) {
  console.error("Falhas na navegação de categorias:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Category navigation validation ok: 9 links preserved, 5 primary and 4 complementary.");
