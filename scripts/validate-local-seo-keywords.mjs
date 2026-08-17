import assert from "node:assert/strict";
import fs from "node:fs";

const pages = new Map([
  ["index.html", "loja de presentes"],
  ["presentes-canaa.html", "loja de presentes em canaã dos carajás"],
  ["presentes-canaa-dos-carajas/index.html", "entrega de presentes em canaã dos carajás"],
  ["buques-canaa-dos-carajas/index.html", "buquês em canaã dos carajás"],
  ["cestas-de-presente-canaa/index.html", "cestas de presente em canaã dos carajás"],
  ["floricultura-canaa-dos-carajas/index.html", "floricultura em canaã dos carajás"],
  ["cesta-cafe-da-manha-canaa/index.html", "cesta de café da manhã em canaã dos carajás"],
  ["presentes-romanticos-canaa/index.html", "presentes românticos em canaã dos carajás"],
  ["rosas-perfumadas-canaa/index.html", "rosas e perfumes em canaã dos carajás"],
  ["monte-sua-cesta/index.html", "monte sua cesta"]
]);

const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();

function extract(source, pattern, label, page) {
  const match = source.match(pattern);
  assert.ok(match, `${label} ausente em ${page}`);
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

for (const [page, keyword] of pages) {
  const source = fs.readFileSync(page, "utf8");
  const lowerSource = source.toLocaleLowerCase("pt-BR");
  const title = extract(source, /<title>([\s\S]*?)<\/title>/i, "Title", page);
  const description = extract(source, /<meta name="description" content="([^"]+)">/i, "Meta description", page);
  const canonical = extract(source, /<link rel="canonical" href="([^"]+)">/i, "Canonical", page);
  const h1 = extract(source, /<h1[^>]*>([\s\S]*?)<\/h1>/i, "H1", page);
  const structuredData = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  assert.ok(lowerSource.includes(keyword), `Palavra-chave principal ausente em ${page}: ${keyword}`);
  assert.ok(title.length >= 30 && title.length <= 60, `Title fora da faixa de 30-60 caracteres em ${page}: ${title.length}`);
  assert.ok(description.length >= 90 && description.length <= 155, `Description fora da faixa de 90-155 caracteres em ${page}: ${description.length}`);
  assert.ok(h1.length >= 15, `H1 pouco descritivo em ${page}`);
  assert.ok(source.includes('<meta property="og:site_name" content="Zadoni Presentes">'), `og:site_name ausente em ${page}`);
  assert.ok(source.includes('"alternateName": "Zadoni"') || source.includes('"alternateName":"Zadoni"'), `Marca alternativa Zadoni ausente nos dados estruturados de ${page}`);
  assert.ok(!/<meta name="keywords"/i.test(source), `Meta keywords obsoleta encontrada em ${page}`);
  assert.ok(structuredData.length > 0, `Dados estruturados ausentes em ${page}`);
  structuredData.forEach((match, index) => {
    assert.doesNotThrow(() => JSON.parse(match[1]), `JSON-LD inválido no bloco ${index + 1} de ${page}`);
  });

  assert.ok(!titles.has(title), `Title duplicado: ${title}`);
  assert.ok(!descriptions.has(description), `Meta description duplicada: ${description}`);
  assert.ok(!canonicals.has(canonical), `Canonical duplicada: ${canonical}`);
  titles.add(title);
  descriptions.add(description);
  canonicals.add(canonical);
}

const catalog = fs.readFileSync("presentes-canaa.html", "utf8").toLocaleLowerCase("pt-BR");
assert.ok(catalog.includes("loja de presentes perto de mim"), "A consulta perto de mim deve aparecer em contexto natural no catálogo.");

const florist = fs.readFileSync("floricultura-canaa-dos-carajas/index.html", "utf8").toLocaleLowerCase("pt-BR");
assert.ok(florist.includes("floricultura perto de mim"), "A intenção local perto de mim deve aparecer na FAQ de floricultura.");

console.log(`SEO local validado: ${pages.size} páginas com intenção própria, metadados únicos e termos locais contextualizados.`);
