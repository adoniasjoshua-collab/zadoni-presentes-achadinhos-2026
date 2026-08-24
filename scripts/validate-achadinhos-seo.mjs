import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SITE = "https://zadonipresentes.com.br";

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const context = {};
vm.runInNewContext(read("assets/data/achadinhos.js"), context);
const data = context.ACHADINHOS_DATA;
assert(data, "Fonte ACHADINHOS_DATA ausente");

const pages = [
  {
    file: "achadinhos/index.html",
    canonical: `${SITE}/achadinhos/`,
    title: data.hub.metaTitle,
    description: data.hub.description,
    faqCount: data.hub.faq.length
  },
  ...data.guides.map((guide) => ({
    file: `achadinhos/${guide.slug}/index.html`,
    canonical: `${SITE}/achadinhos/${guide.slug}/`,
    title: guide.metaTitle,
    description: guide.description,
    faqCount: guide.faq.length
  }))
];

const sitemap = read("sitemap.xml");
const generatorSource = read("scripts/generate-achadinhos-pages.mjs");
const trackingSource = read("assets/js/achadinhos.js");
const nationalCss = read("assets/css/achadinhos.css");
const titles = new Set();
const descriptions = new Set();

assert(generatorSource.includes('rel="sponsored noopener noreferrer"'), "Gerador: rel de afiliados incompleto");
assert(generatorSource.includes("data-affiliate-partner"), "Gerador: identificação de parceiro ausente");
assert(trackingSource.includes('event: "affiliate_click"'), "Tracking: evento affiliate_click ausente");
assert(trackingSource.includes("destination_host"), "Tracking: destino do afiliado ausente");
assert(/@media\s*\(max-width:\s*860px\)/.test(nationalCss), "CSS nacional: breakpoint para tablet ausente");
assert(/@media\s*\(max-width:\s*620px\)/.test(nationalCss), "CSS nacional: breakpoint para celular ausente");

function schemaTypes(value, types = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypes(item, types));
    return types;
  }
  if (!value || typeof value !== "object") return types;
  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => types.add(item));
  else if (type) types.add(type);
  if (value["@graph"]) schemaTypes(value["@graph"], types);
  return types;
}

function targetExists(fromFile, href) {
  if (!href || href.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(href)) return true;
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true;
  const target = path.resolve(path.dirname(path.join(ROOT, fromFile)), clean);
  if (clean.endsWith("/")) return fs.existsSync(path.join(target, "index.html"));
  return fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
}

for (const page of pages) {
  assert(fs.existsSync(path.join(ROOT, page.file)), `${page.file}: arquivo ausente`);
  const content = read(page.file);
  const normalized = normalize(content);

  assert(/<html[^>]+lang="pt-BR"/i.test(content), `${page.file}: lang pt-BR ausente`);
  assert(/<meta\s+name="viewport"/i.test(content), `${page.file}: viewport responsivo ausente`);
  assert((content.match(/<h1\b/gi) || []).length === 1, `${page.file}: deve conter exatamente um H1`);
  assert(content.includes(`<title>${page.title}</title>`), `${page.file}: title inesperado`);
  assert(content.includes(`name="description" content="${page.description}"`), `${page.file}: description inesperada`);
  assert(!titles.has(page.title), `${page.file}: title duplicado`);
  assert(!descriptions.has(page.description), `${page.file}: description duplicada`);
  titles.add(page.title);
  descriptions.add(page.description);

  assert(content.includes(`rel="canonical" href="${page.canonical}"`), `${page.file}: canonical incorreto`);
  assert(content.includes(`property="og:title" content="${page.title}"`), `${page.file}: og:title incorreto`);
  assert(content.includes(`property="og:description" content="${page.description}"`), `${page.file}: og:description incorreta`);
  assert(content.includes(`property="og:url" content="${page.canonical}"`), `${page.file}: og:url incorreta`);
  assert(/property="og:image" content="https:\/\//i.test(content), `${page.file}: og:image absoluta ausente`);
  assert(/name="twitter:card" content="summary_large_image"/i.test(content), `${page.file}: Twitter Card ausente`);
  assert(sitemap.includes(`<loc>${page.canonical}</loc>`), `${page.file}: canonical ausente do sitemap`);

  assert(!normalized.includes("canaa dos carajas"), `${page.file}: referência local encontrada`);
  assert(!/name="geo\.(placename|region)"/i.test(content), `${page.file}: geo tag local encontrada`);
  assert(!content.includes('"@type":"LocalBusiness"'), `${page.file}: LocalBusiness encontrado`);
  assert(!content.includes('"@type": "LocalBusiness"'), `${page.file}: LocalBusiness encontrado`);
  assert(!content.includes("utm_campaign=seo_local"), `${page.file}: campanha local encontrada`);
  assert(!content.includes("produtosLocais"), `${page.file}: dependência de produtos locais encontrada`);
  assert(!content.includes("google-ads-whatsapp.js"), `${page.file}: tracking local encontrado`);
  assert(!/https:\/\/wa\.me\//i.test(content), `${page.file}: CTA local de WhatsApp encontrado`);
  assert(content.includes("assets/js/achadinhos.js"), `${page.file}: tracking nacional ausente`);
  assert(content.includes("Transparência sobre links de afiliados"), `${page.file}: disclosure visível ausente`);

  const jsonScripts = [...content.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  assert(jsonScripts.length > 0, `${page.file}: JSON-LD ausente`);
  const types = new Set();
  for (const [, json] of jsonScripts) schemaTypes(JSON.parse(json.trim()), types);
  for (const required of ["WebPage", "BreadcrumbList", "ItemList", "FAQPage"]) {
    assert(types.has(required), `${page.file}: schema ${required} ausente`);
  }
  assert(!types.has("LocalBusiness"), `${page.file}: schema LocalBusiness proibido`);

  const visibleFaqs = (content.match(/<details>/g) || []).length;
  assert(visibleFaqs === page.faqCount, `${page.file}: FAQ visível não corresponde aos dados`);

  const affiliateLinks = [...content.matchAll(/<a\b[^>]*data-affiliate-link[^>]*>/gi)];
  for (const [link] of affiliateLinks) {
    const rel = link.match(/\brel="([^"]+)"/i)?.[1]?.split(/\s+/) || [];
    for (const requiredRel of ["sponsored", "noopener", "noreferrer"]) {
      assert(rel.includes(requiredRel), `${page.file}: link afiliado sem rel=${requiredRel}`);
    }
    assert(/data-affiliate-partner="[^"]+"/i.test(link), `${page.file}: parceiro ausente no link afiliado`);
    assert(/data-item-id="[^"]+"/i.test(link), `${page.file}: item_id ausente no link afiliado`);
  }

  const resourceReferences = [
    ...content.matchAll(/\shref="([^"]+)"/gi),
    ...content.matchAll(/\ssrc="([^"]+)"/gi)
  ].map((match) => match[1]);
  for (const reference of resourceReferences) {
    assert(targetExists(page.file, reference), `${page.file}: recurso interno quebrado ${reference}`);
  }
}

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(new Set(sitemapLocs).size === sitemapLocs.length, "sitemap.xml: URLs duplicadas");

console.log(`Achadinhos SEO validation ok: ${pages.length} national pages.`);
