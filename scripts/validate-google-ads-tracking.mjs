import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TAG_ID = "AW-16938428518";
const CONVERSION_DESTINATION = "AW-16938428518/zsa-CO2Px9ccEObQ74w_";
const PHONE = "5594992993138";
const pages = [
  "index.html",
  "presentes-canaa.html",
  "presentes-canaa-dos-carajas/index.html",
  "buques-canaa-dos-carajas/index.html",
  "cestas-de-presente-canaa/index.html",
  "floricultura-canaa-dos-carajas/index.html",
  "cesta-cafe-da-manha-canaa/index.html",
  "monte-sua-cesta/index.html",
  "presentes-romanticos-canaa/index.html",
  "rosas-perfumadas-canaa/index.html",
  "404.html"
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function matches(content, pattern) {
  return [...content.matchAll(pattern)].map((match) => match[1] || match[0]);
}

function hrefs(content) {
  return matches(content, /\shref=["']([^"']+)["']/gi);
}

let whatsappLinks = 0;

for (const page of pages) {
  const current = read(page);
  const pageHrefs = hrefs(current);

  const gtagJsCount = (current.match(new RegExp(
    `googletagmanager\\.com/gtag/js\\?id=${TAG_ID}`,
    "g"
  )) || []).length;
  const configCount = (current.match(new RegExp(
    `gtag\\('config', '${TAG_ID}'\\)`,
    "g"
  )) || []).length;
  const trackingScriptCount = (current.match(/google-ads-whatsapp\.js/g) || []).length;

  assert(gtagJsCount === 1, `${page}: esperado 1 carregamento gtag.js, encontrado ${gtagJsCount}`);
  assert(configCount === 1, `${page}: esperado 1 config Google Ads, encontrado ${configCount}`);
  assert(trackingScriptCount === 1, `${page}: esperado 1 script de tracking, encontrado ${trackingScriptCount}`);

  const pageWhatsappLinks = pageHrefs.filter((href) =>
    href.includes("wa.me/") ||
    href.includes("api.whatsapp.com/") ||
    href.includes("web.whatsapp.com/")
  );

  for (const href of pageWhatsappLinks) {
    assert(href.includes(PHONE), `${page}: link de WhatsApp sem telefone preservado ${PHONE}: ${href}`);
  }

  whatsappLinks += pageWhatsappLinks.length;
}

const tracker = read("assets/js/google-ads-whatsapp.js");
const otherAwIds = [...new Set(matches(
  pages.map(read).join("\n") + "\n" + tracker,
  /\bAW-\d+(?:\/[A-Za-z0-9_-]+)?/g
).filter((id) => id !== TAG_ID && id !== CONVERSION_DESTINATION))];

assert(otherAwIds.length === 0, `IDs AW inesperados encontrados: ${otherAwIds.join(", ")}`);
assert(tracker.includes(CONVERSION_DESTINATION), "Destino de conversao ausente no script");
assert(!tracker.includes("href:") && !tracker.includes("url:"), "Script nao deve enviar URL do WhatsApp ao Google Ads");
assert(whatsappLinks > 0, "Nenhum link de WhatsApp encontrado nas paginas publicas");

console.log(`Google Ads tracking validation ok: ${pages.length} pages, ${whatsappLinks} WhatsApp links preserved`);
