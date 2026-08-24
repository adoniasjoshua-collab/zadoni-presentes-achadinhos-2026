import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SITE = "https://zadonipresentes.com.br";
const DATA_FILE = path.join(ROOT, "assets", "data", "achadinhos.js");

function loadData() {
  const context = {};
  vm.runInNewContext(fs.readFileSync(DATA_FILE, "utf8"), context);
  if (!context.ACHADINHOS_DATA) throw new Error("ACHADINHOS_DATA não foi carregado.");
  return context.ACHADINHOS_DATA;
}

const data = loadData();
const guidesBySlug = new Map(data.guides.map((guide) => [guide.slug, guide]));

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`;
}

function absoluteUrl(relativePath = "") {
  return `${SITE}/${String(relativePath).replace(/^\/+/, "")}`;
}

function commonSchemas(page) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Zadoni Presentes",
      alternateName: "Zadoni Achadinhos",
      url: `${SITE}/`
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Zadoni Presentes",
      url: `${SITE}/`,
      publisher: { "@id": `${SITE}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": page.isHub ? ["WebPage", "CollectionPage"] : "WebPage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.metaTitle,
      description: page.description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${SITE}/#website` },
      publisher: { "@id": `${SITE}/#organization` }
    }
  ];
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function itemListSchema(items, name) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url
    }))
  };
}

function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

function head(page, prefix) {
  const socialImage = absoluteUrl("assets/optimized/products/box-amor-perfeito.jpg");
  return `<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="author" content="Zadoni Presentes">
    <meta name="theme-color" content="#4b1745">
    <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="canonical" href="${page.canonical}">
    <meta property="og:title" content="${escapeHtml(page.metaTitle)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:site_name" content="Zadoni Achadinhos">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:url" content="${page.canonical}">
    <meta property="og:image" content="${socialImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.metaTitle)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${socialImage}">
    <title>${escapeHtml(page.metaTitle)}</title>
    <link rel="stylesheet" href="${prefix}assets/css/style.css?v=20260818-real-deliveries-1">
    <link rel="stylesheet" href="${prefix}assets/css/achadinhos.css?v=20260824-pilot-1">`;
}

function header(prefix, currentSlug = "") {
  const guideLinks = data.guides.map((guide) => {
    const href = currentSlug ? `../${guide.slug}/` : `${guide.slug}/`;
    const current = currentSlug === guide.slug ? ` aria-current="page"` : "";
    return `<a href="${href}"${current}>${escapeHtml(guide.label)}</a>`;
  }).join("\n                ");

  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header class="ach-header">
      <div class="container ach-header-inner">
        <a class="ach-brand" href="${currentSlug ? "../" : "./"}">🎁 Zadoni Achadinhos</a>
        <nav class="ach-nav" aria-label="Navegação dos guias nacionais">
          <a href="${currentSlug ? "../" : "./"}"${currentSlug ? "" : ` aria-current="page"`}>Início dos Achadinhos</a>
          ${guideLinks}
        </nav>
      </div>
    </header>`;
}

function breadcrumbs(items) {
  return `<nav class="ach-breadcrumbs" aria-label="Breadcrumb">
          ${items.map((item, index) => index === items.length - 1
            ? `<span aria-current="page">${escapeHtml(item.name)}</span>`
            : `<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>`).join("<span aria-hidden=\"true\">/</span>")}
        </nav>`;
}

function disclosure() {
  return `<aside class="ach-disclosure" aria-labelledby="disclosure-title">
          <h2 id="disclosure-title">Transparência sobre links de afiliados</h2>
          <p>${escapeHtml(data.disclosure)}</p>
        </aside>`;
}

function faqHtml(faq) {
  return `<section class="ach-section ach-section--soft" aria-labelledby="faq-title">
      <div class="container">
        <div class="ach-section-heading">
          <p class="ach-eyebrow">Dúvidas comuns</p>
          <h2 id="faq-title">Perguntas frequentes</h2>
        </div>
        <div class="ach-faq">
          ${faq.map((item) => `<details>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`).join("\n          ")}
        </div>
      </div>
    </section>`;
}

function footer(prefix) {
  return `<footer class="ach-footer">
      <div class="container ach-footer-inner">
        <div><strong>Zadoni Achadinhos</strong><p>Guias editoriais nacionais para escolher presentes com mais contexto.</p></div>
        <p><a href="${prefix}index.html">Conhecer a Zadoni Presentes</a> · <a href="${prefix}achadinhos/">Ver todos os Achadinhos</a></p>
      </div>
    </footer>`;
}

function shell({ page, prefix, currentSlug, body, schemas }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    ${head(page, prefix)}
</head>
<body class="achadinhos-site">
    ${header(prefix, currentSlug)}
    ${body}
    ${footer(prefix)}
    <script src="${prefix}assets/data/achadinhos.js?v=20260824-pilot-1" defer></script>
    <script src="${prefix}assets/js/achadinhos.js?v=20260824-pilot-1" defer></script>
    ${jsonLd(schemas)}
</body>
</html>
`;
}

function offerLinks(recommendation, guideSlug) {
  if (!recommendation.offers?.length) return "";
  return `<div class="ach-offers" aria-label="Lojas parceiras">
        ${recommendation.offers.map((offer) => `<a class="ach-affiliate-link" href="${escapeHtml(offer.url)}" target="_blank" rel="sponsored noopener noreferrer" data-affiliate-link data-affiliate-partner="${escapeHtml(offer.partner)}" data-item-id="${escapeHtml(recommendation.id)}" data-placement="guide_${escapeHtml(guideSlug)}">Ver na loja parceira</a>`).join("\n        ")}
      </div>`;
}

function hubPage() {
  const page = {
    ...data.hub,
    metaTitle: data.hub.metaTitle,
    canonical: `${SITE}/achadinhos/`,
    isHub: true
  };
  const crumbs = [
    { name: "Zadoni Presentes", href: "../index.html", url: `${SITE}/` },
    { name: "Achadinhos", href: "./", url: page.canonical }
  ];
  const listItems = data.guides.map((guide) => ({
    name: guide.label,
    url: `${SITE}/achadinhos/${guide.slug}/`
  }));
  const schemas = [
    ...commonSchemas(page),
    breadcrumbSchema(crumbs),
    itemListSchema(listItems, "Guias de presentes da Zadoni Achadinhos"),
    faqSchema(data.hub.faq)
  ];
  const body = `<main id="conteudo">
      <section class="ach-hero">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <p class="ach-eyebrow">Curadoria editorial nacional</p>
          <h1>${escapeHtml(data.hub.title)}</h1>
          <p class="ach-hero-copy">${escapeHtml(data.hub.intro)}</p>
        </div>
      </section>
      <section class="ach-section" aria-labelledby="guias-title">
        <div class="container">
          <div class="ach-section-heading">
            <p class="ach-eyebrow">Comece pelo contexto</p>
            <h2 id="guias-title">Guias para diferentes pessoas e ocasiões</h2>
            <p>Escolha um ponto de partida e use os critérios do guia para adaptar a recomendação à pessoa, em vez de seguir uma lista genérica.</p>
          </div>
          <div class="ach-grid">
            ${data.guides.map((guide) => `<a class="ach-card" href="${guide.slug}/">
              <h3>${escapeHtml(guide.label)}</h3>
              <p>${escapeHtml(guide.description)}</p>
              <span class="ach-card-link">Abrir guia →</span>
            </a>`).join("\n            ")}
          </div>
        </div>
      </section>
      <section class="ach-section ach-section--soft" aria-labelledby="metodo-title">
        <div class="container ach-prose">
          <p class="ach-eyebrow">Como usamos a curadoria</p>
          <h2 id="metodo-title">Uma ideia útil antes de ser uma oferta</h2>
          <p>Os guias partem do perfil de quem recebe, da ocasião e do uso esperado. Uma recomendação deve continuar útil mesmo quando não houver uma oferta associada.</p>
          <p>Quando links de lojas parceiras forem incluídos, compare o custo final, as especificações, as regras de troca e o prazo informado pelo vendedor antes de concluir a compra.</p>
          ${disclosure()}
        </div>
      </section>
      ${faqHtml(data.hub.faq)}
    </main>`;
  return shell({ page, prefix: "../", currentSlug: "", body, schemas });
}

function guidePage(guide) {
  const page = {
    ...guide,
    canonical: `${SITE}/achadinhos/${guide.slug}/`,
    isHub: false
  };
  const crumbs = [
    { name: "Zadoni Presentes", href: "../../index.html", url: `${SITE}/` },
    { name: "Achadinhos", href: "../", url: `${SITE}/achadinhos/` },
    { name: guide.label, href: `./`, url: page.canonical }
  ];
  const listItems = guide.recommendations.map((item) => ({
    name: item.title,
    url: `${page.canonical}#ideia-${item.id}`
  }));
  const schemas = [
    ...commonSchemas(page),
    breadcrumbSchema(crumbs),
    itemListSchema(listItems, guide.h1),
    faqSchema(guide.faq)
  ];
  const relatedGuides = guide.related.map((slug) => guidesBySlug.get(slug)).filter(Boolean);
  const body = `<main id="conteudo">
      <section class="ach-hero">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <p class="ach-eyebrow">Guia nacional de presentes</p>
          <h1>${escapeHtml(guide.h1)}</h1>
          <p class="ach-hero-copy">${escapeHtml(guide.intro)}</p>
        </div>
      </section>
      <section class="ach-section" aria-labelledby="como-escolher-title">
        <div class="container ach-prose">
          <p class="ach-eyebrow">Decisão consciente</p>
          <h2 id="como-escolher-title">Como escolher</h2>
          ${guide.howToChoose.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n          ")}
          <h2>Critérios de seleção</h2>
          <ul class="ach-criteria">
            ${guide.criteria.map((criterion) => `<li>${escapeHtml(criterion)}</li>`).join("\n            ")}
          </ul>
        </div>
      </section>
      <section class="ach-section ach-section--soft" aria-labelledby="recomendacoes-title">
        <div class="container">
          <div class="ach-section-heading">
            <p class="ach-eyebrow">Categorias e recomendações</p>
            <h2 id="recomendacoes-title">Ideias para adaptar ao perfil</h2>
            <p>As sugestões abaixo são pontos de partida editoriais. Confirme características e condições na loja escolhida.</p>
          </div>
          <div class="ach-recommendations">
            ${guide.recommendations.map((item) => `<article class="ach-recommendation" id="ideia-${escapeHtml(item.id)}">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              <span class="ach-note"><strong>Para quem faz sentido:</strong> ${escapeHtml(item.fit)}</span>
              <span class="ach-note"><strong>Orçamento:</strong> ${escapeHtml(item.budget)}</span>
${offerLinks(item, guide.slug)}
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>
      <section class="ach-section" aria-labelledby="orcamento-title">
        <div class="container">
          <div class="ach-budget ach-prose">
            <p class="ach-eyebrow">Planejamento</p>
            <h2 id="orcamento-title">${escapeHtml(guide.budgetTitle)}</h2>
            <p>${escapeHtml(guide.budgetCopy)}</p>
          </div>
          ${disclosure()}
        </div>
      </section>
      <section class="ach-section ach-section--soft" aria-labelledby="relacionados-title">
        <div class="container">
          <div class="ach-section-heading"><h2 id="relacionados-title">Guias relacionados</h2></div>
          <div class="ach-grid">
            ${relatedGuides.map((related) => `<a class="ach-card" href="../${related.slug}/"><h3>${escapeHtml(related.label)}</h3><p>${escapeHtml(related.description)}</p><span class="ach-card-link">Ler guia →</span></a>`).join("\n            ")}
          </div>
        </div>
      </section>
      ${faqHtml(guide.faq)}
    </main>`;
  return shell({ page, prefix: "../../", currentSlug: guide.slug, body, schemas });
}

function write(relativePath, content) {
  const destination = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content, "utf8");
}

write("achadinhos/index.html", hubPage());
for (const guide of data.guides) {
  write(`achadinhos/${guide.slug}/index.html`, guidePage(guide));
}

console.log(`Generated ${data.guides.length + 1} national Achadinhos pages.`);
