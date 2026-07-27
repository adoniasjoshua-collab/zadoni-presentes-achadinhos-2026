import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TAG_ID = "AW-16938428518";
const CONVERSION_DESTINATION = "AW-16938428518/zsa-CO2Px9ccEObQ74w_";
const pages = [
  "index.html",
  "presentes-canaa.html",
  "presentes-canaa-dos-carajas/index.html",
  "buques-canaa-dos-carajas/index.html",
  "cestas-de-presente-canaa/index.html",
  "presentes-romanticos-canaa/index.html",
  "rosas-perfumadas-canaa/index.html",
  "404.html"
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function readMain(file) {
  return execFileSync("git", ["show", `main:${file}`], { cwd: ROOT, encoding: "utf8" });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function matches(content, pattern) {
  return [...content.matchAll(pattern)].map((match) => match[1] || match[0]);
}

function title(content) {
  return matches(content, /<title[^>]*>([\s\S]*?)<\/title>/gi);
}

function metaDescriptions(content) {
  return matches(content, /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
}

function canonicals(content) {
  return matches(content, /<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/gi);
}

function headings(content) {
  return matches(content, /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)
    .map((heading) => heading.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

function hrefs(content) {
  return matches(content, /\shref=["']([^"']+)["']/gi);
}

function imageIdentity(content) {
  return matches(content, /<img\b[^>]*>/gi).map((img) => ({
    src: (img.match(/\ssrc=["']([^"']*)["']/i) || [])[1] || "",
    alt: (img.match(/\salt=["']([^"']*)["']/i) || [])[1] || ""
  }));
}

function jsonLd(content) {
  return matches(content, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .map((json) => JSON.stringify(JSON.parse(json.trim())));
}

function metaByPrefix(content, prefix) {
  return matches(content, new RegExp(`<meta\\s+${prefix}=["'][^"']+["'][^>]*>`, "gi"));
}

function same(name, current, baseline, page) {
  assert(JSON.stringify(current) === JSON.stringify(baseline), `${page}: ${name} alterado`);
}

let whatsappLinks = 0;

for (const page of pages) {
  const current = read(page);
  const baseline = readMain(page);

  same("title", title(current), title(baseline), page);
  same("meta description", metaDescriptions(current), metaDescriptions(baseline), page);
  same("canonical", canonicals(current), canonicals(baseline), page);
  same("H1-H3", headings(current), headings(baseline), page);
  same("JSON-LD", jsonLd(current), jsonLd(baseline), page);
  same("Open Graph", metaByPrefix(current, "property"), metaByPrefix(baseline, "property"), page);
  same("Twitter Cards", metaByPrefix(current, "name"), metaByPrefix(baseline, "name"), page);
  same("hrefs", hrefs(current), hrefs(baseline), page);
  same("imagens src/alt", imageIdentity(current), imageIdentity(baseline), page);

  const gtagJsCount = (current.match(new RegExp(`googletagmanager\\.com/gtag/js\\?id=${TAG_ID}`, "g")) || []).length;
  const configCount = (current.match(new RegExp(`gtag\\('config', '${TAG_ID}'\\)`, "g")) || []).length;
  const trackingScriptCount = (current.match(/google-ads-whatsapp\.js/g) || []).length;

  assert(gtagJsCount === 1, `${page}: esperado 1 carregamento gtag.js, encontrado ${gtagJsCount}`);
  assert(configCount === 1, `${page}: esperado 1 config Google Ads, encontrado ${configCount}`);
  assert(trackingScriptCount === 1, `${page}: esperado 1 script de tracking, encontrado ${trackingScriptCount}`);

  whatsappLinks += hrefs(current).filter((href) =>
    href.includes("wa.me/") ||
    href.includes("api.whatsapp.com/") ||
    href.includes("web.whatsapp.com/")
  ).length;
}

const tracker = read("assets/js/google-ads-whatsapp.js");
const otherAwIds = [...new Set(matches(
  pages.map(read).join("\n") + "\n" + tracker,
  /\bAW-\d+(?:\/[A-Za-z0-9_-]+)?/g
).filter((id) => id !== TAG_ID && id !== CONVERSION_DESTINATION))];

assert(otherAwIds.length === 0, `IDs AW inesperados encontrados: ${otherAwIds.join(", ")}`);
assert(tracker.includes(CONVERSION_DESTINATION), "Destino de conversao ausente no script");
assert(!tracker.includes("href:") && !tracker.includes("url:"), "Script nao deve enviar URL do WhatsApp ao Google Ads");

console.log(`Google Ads tracking validation ok: ${pages.length} pages, ${whatsappLinks} WhatsApp links preserved`);
