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
  const achadinhosCssVersion = "20260825-birthday-aggregator-1";
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
    <link rel="stylesheet" href="${prefix}assets/css/achadinhos.css?v=${achadinhosCssVersion}">`;
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
      <div class="container">
        <div class="ach-footer-inner">
          <div><strong>Zadoni Achadinhos</strong><p>Guias editoriais nacionais para escolher presentes com mais contexto.</p></div>
          <p><a href="${prefix}index.html">Conhecer a Zadoni Presentes</a> · <a href="${prefix}achadinhos/">Ver todos os Achadinhos</a> · <a href="${prefix}links/">Links oficiais</a></p>
        </div>
        <p id="transparencia-afiliados" class="ach-footer-disclosure"><strong>Transparência sobre links de afiliados:</strong> ${escapeHtml(data.disclosure)}</p>
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
    <script src="${prefix}assets/data/achadinhos.js?v=20260824-affiliate-images-10" defer></script>
    <script src="${prefix}assets/js/achadinhos.js?v=20260824-pilot-1" defer></script>
    ${jsonLd(schemas)}
</body>
</html>
`;
}

function offerLinks(recommendation, guideSlug, prefix) {
  if (!recommendation.offers?.length) return "";
  return `<div class="ach-offers" aria-label="Lojas parceiras">
        ${recommendation.offers.map((offer) => `<a class="ach-affiliate-offer" href="${escapeHtml(offer.url)}" target="_blank" rel="sponsored noopener noreferrer" data-affiliate-link data-affiliate-partner="${escapeHtml(offer.partner)}" data-item-id="${escapeHtml(offer.id || recommendation.id)}" data-placement="guide_${escapeHtml(guideSlug)}">
          ${offer.image ? `<img class="ach-affiliate-image" src="${prefix}${escapeHtml(offer.image)}" alt="${escapeHtml(offer.imageAlt || "")}" width="${Number(offer.imageWidth)}" height="${Number(offer.imageHeight)}" loading="lazy" decoding="async">` : ""}
          <span class="ach-affiliate-link">${escapeHtml(offer.label || "Ver na loja parceira")}</span>
        </a>`).join("\n        ")}
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
      <section class="ach-hero ach-hero--hub">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <p class="ach-eyebrow">Curadoria editorial nacional</p>
          <h1>${escapeHtml(data.hub.title)}</h1>
          <p class="ach-hero-copy">${escapeHtml(data.hub.intro)}</p>
        </div>
      </section>
      <section class="ach-section ach-guides-section" aria-labelledby="guias-title">
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
      <section class="ach-authority" aria-labelledby="autoridade-title">
        <div class="container">
          <div class="ach-authority-card">
            <div class="ach-authority-copy">
              <p class="ach-eyebrow">${escapeHtml(data.hub.authority.eyebrow)}</p>
              <h2 id="autoridade-title">${escapeHtml(data.hub.authority.title)}</h2>
              <p>${escapeHtml(data.hub.authority.text)}</p>
            </div>
            <a class="ach-authority-cta" href="${escapeHtml(data.hub.authority.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.hub.authority.cta)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <section class="ach-section ach-section--soft" aria-labelledby="metodo-title">
        <div class="container ach-prose">
          <p class="ach-eyebrow">Como usamos a curadoria</p>
          <h2 id="metodo-title">Uma ideia útil antes de ser uma oferta</h2>
          <p>Os guias partem do perfil de quem recebe, da ocasião e do uso esperado. Uma recomendação deve continuar útil mesmo quando não houver uma oferta associada.</p>
          <p>Quando links de lojas parceiras forem incluídos, compare o custo final, as especificações, as regras de troca e o prazo informado pelo vendedor antes de concluir a compra.</p>
        </div>
      </section>
      ${faqHtml(data.hub.faq)}
    </main>`;
  return shell({ page, prefix: "../", currentSlug: "", body, schemas });
}

function guidePage(guide) {
  const prefix = "../../";
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
  const isBirthdayAggregator = guide.slug === "presentes-de-aniversario";
  const recommendationSources = isBirthdayAggregator
    ? [guide, ...data.guides.filter((candidate) => candidate.slug !== guide.slug)]
    : [guide];
  const productRecommendations = [...new Map(
    recommendationSources
      .flatMap((source) => source.recommendations)
      .filter((item) => Array.isArray(item.offers) && item.offers.length > 0)
      .map((item) => [item.id, item])
  ).values()];
  const productEyebrow = isBirthdayAggregator ? "Todas as categorias" : "Seleção prática";
  const productTitle = isBirthdayAggregator
    ? "Presentes de aniversário por categoria"
    : "Opções para comparar agora";
  const productCopy = isBirthdayAggregator
    ? "Explore todas as opções ativas da curadoria e escolha pelo perfil de quem vai receber."
    : "Escolha pelo perfil de quem recebe e confirme características, prazo e condições diretamente na loja.";
  const categoryJumps = isBirthdayAggregator
    ? `<nav class="ach-category-jumps" aria-label="Categorias de presentes de aniversário">
              ${productRecommendations.map((item) => `<a href="#ideia-${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>`).join("\n              ")}
            </nav>`
    : "";
  const listItems = productRecommendations.map((item) => ({
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
      <section class="ach-hero ach-hero--guide">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <p class="ach-eyebrow">Guia nacional de presentes</p>
          <h1>${escapeHtml(guide.h1)}</h1>
          <p class="ach-hero-copy">${escapeHtml(guide.intro)}</p>
          <div class="ach-hero-actions">
            <a class="ach-primary-cta" href="#produtos-title">Ver opções selecionadas <span aria-hidden="true">↓</span></a>
            <a class="ach-secondary-cta" href="#como-escolher-title">Como escolher</a>
          </div>
        </div>
      </section>
      <section class="ach-section ach-products-section" aria-labelledby="produtos-title">
        <div class="container">
          <div class="ach-section-heading">
            <p class="ach-eyebrow">${productEyebrow}</p>
            <h2 id="produtos-title">${productTitle}</h2>
            <p>${productCopy}</p>
          </div>${categoryJumps ? `
          ${categoryJumps}` : ""}
          <p class="ach-affiliate-label"><a href="#transparencia-afiliados">Links de afiliados</a></p>
          <div class="ach-recommendations">
            ${productRecommendations.map((item) => `<article class="ach-recommendation" id="ideia-${escapeHtml(item.id)}">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
${offerLinks(item, guide.slug, prefix)}
              <details class="ach-recommendation-details">
                <summary>Como avaliar esta opção</summary>
                <span class="ach-note"><strong>Para quem faz sentido:</strong> ${escapeHtml(item.fit)}</span>
                <span class="ach-note"><strong>Antes de comprar:</strong> ${escapeHtml(item.budget)}</span>
              </details>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>
      <section class="ach-section ach-section--soft ach-section--compact" aria-labelledby="como-escolher-title">
        <div class="container">
          <div class="ach-section-heading ach-section-heading--compact">
            <p class="ach-eyebrow">Guia de compra</p>
            <h2 id="como-escolher-title">Como escolher e comparar</h2>
          </div>
          <details class="ach-guide-details">
            <summary>Ver critérios, cuidados e orçamento</summary>
            <div class="ach-guide-details-content ach-prose">
              ${guide.howToChoose.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n              ")}
              <h3>Critérios de seleção</h3>
              <ul class="ach-criteria">
                ${guide.criteria.map((criterion) => `<li>${escapeHtml(criterion)}</li>`).join("\n                ")}
              </ul>
              <h3>${escapeHtml(guide.budgetTitle)}</h3>
              <p>${escapeHtml(guide.budgetCopy)}</p>
            </div>
          </details>
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
  return shell({ page, prefix, currentSlug: guide.slug, body, schemas });
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
