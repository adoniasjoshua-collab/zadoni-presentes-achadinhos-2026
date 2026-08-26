import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const assets = [
  "assets/img/brand/logo-zadoni-master.png",
  "assets/img/brand/logo-zadoni-96.webp",
  "assets/img/brand/logo-zadoni-160.webp",
  "assets/img/brand/logo-zadoni-320.webp",
  "assets/img/brand/logo-zadoni-180.png"
];

for (const asset of assets) {
  const fullPath = path.join(root, asset);
  assert(fs.existsSync(fullPath), `Ativo de marca ausente: ${asset}`);
  assert(fs.statSync(fullPath).size > 1_000, `Ativo de marca parece vazio: ${asset}`);
}

const home = read("index.html");
const links = read("links/index.html");
const localPage = read("presentes-canaa.html");
const achadinhos = read("achadinhos/index.html");

assert(home.includes('class="brand-logo-image"'), "Logo oficial ausente da home.");
assert(localPage.includes('class="brand-logo-image"'), "Logo oficial ausente das páginas locais.");
assert(achadinhos.includes('class="brand-logo-image"'), "Logo oficial ausente dos Achadinhos.");
assert(links.includes("logo-zadoni-160.webp"), "Logo oficial ausente da página de links.");

for (const [name, html] of [["home", home], ["página local", localPage], ["Achadinhos", achadinhos]]) {
  assert(html.includes("logo-zadoni-180.png"), `Apple touch icon ausente em ${name}.`);
  assert(html.includes("logo-zadoni-320.webp"), `Logo estruturado ausente em ${name}.`);
}

assert(home.includes('alt=""'), "Logo decorativo deve ter alt vazio para evitar redundância.");
assert(home.includes("Zadoni Presentes</span>"), "Nome textual da marca deve acompanhar o logo.");

console.log("OK: identidade oficial aplicada com ativos responsivos, texto acessível e schema de organização.");
