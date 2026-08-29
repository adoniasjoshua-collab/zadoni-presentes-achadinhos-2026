import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SITE = "https://zadonipresentes.com.br";
const PHONE = "5594992993138";
const ROOT = process.cwd();
const BIRTHDAY_BASKET_GALLERY_IMAGES = Object.freeze(
  JSON.parse(fs.readFileSync(path.join(ROOT, "assets/data/cestas-aniversario.json"), "utf8"))
);
const BASKET_BUDGET_TIERS = Object.freeze([
  {
    id: "basica",
    name: "Básica",
    priceLabel: "A partir de R$ 189",
    priceDisplay: "R$ 189",
    badge: "Essencial",
    proposal: "Composição mais enxuta, delicada e bem apresentada.",
    composition: "Base decorada, seleção essencial de itens para café da manhã, bebida e cartão."
  },
  {
    id: "intermediaria",
    name: "Intermediária",
    priceLabel: "A partir de R$ 270",
    priceDisplay: "R$ 270",
    badge: "Mais escolhida",
    featured: true,
    proposal: "Mais variedade de itens e acabamento especial.",
    composition: "Base decorada, seleção ampliada de café da manhã, chocolates, frutas ou frios e acabamento especial."
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "A partir de R$ 300",
    priceDisplay: "R$ 300+",
    badge: "Mais completa",
    proposal: "Montagem ampla, sofisticada e com mais impacto visual.",
    composition: "Seleção mais completa de itens, complementos especiais, personalização e acabamento elaborado."
  }
]);

const SOCIAL_PROOF_IMAGES = Object.freeze([
  {
    src: "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-01.webp",
    src480: "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-01-480.webp",
    alt: "Entrega real de buquê preparada pela Zadoni em Canaã dos Carajás",
    title: "Buquê entregue para celebrar",
    caption: "Registro de uma surpresa preparada e entregue em Canaã."
  },
  {
    src: "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-02.webp",
    src480: "assets/img/prova-social/entregas-canaa/entrega-buque-cliente-02-480.webp",
    alt: "Cliente com buquê recebido em entrega local da Zadoni",
    title: "Flores para um momento especial",
    caption: "Buquê entregue com atendimento local da Zadoni."
  },
  {
    src: "assets/img/prova-social/entregas-canaa/entrega-buque-casal-01.webp",
    src480: "assets/img/prova-social/entregas-canaa/entrega-buque-casal-01-480.webp",
    alt: "Casal com presente floral entregue pela Zadoni em Canaã",
    title: "Presente recebido com carinho",
    caption: "Um dos momentos registrados depois da entrega."
  },
  {
    src: "assets/img/prova-social/entregas-canaa/entrega-buques-clientes-03.webp",
    src480: "assets/img/prova-social/entregas-canaa/entrega-buques-clientes-03-480.webp",
    alt: "Clientes com diferentes buquês preparados pela Zadoni",
    title: "Buquês para diferentes ocasiões",
    caption: "Modelos reais preparados conforme cada pedido."
  },
  {
    src: "assets/img/prova-social/entregas-canaa/entrega-presente-casal-02.webp",
    src480: "assets/img/prova-social/entregas-canaa/entrega-presente-casal-02-480.webp",
    alt: "Entrega de presente para casal em Canaã dos Carajás",
    title: "Surpresa entregue em Canaã",
    caption: "Atendimento próximo para transformar o pedido em presente."
  }
]);

const BOUQUET_GALLERY_IMAGES = Object.freeze([
  {
    src: "assets/img/galerias/buques/buque-rosa-vermelha-delicado.webp",
    src480: "assets/img/galerias/buques/buque-rosa-vermelha-delicado-480.webp",
    modelLabel: "buquê delicado com rosa vermelha",
    alt: "Buquê delicado com rosa vermelha e acabamento branco",
    caption: "Buquê delicado com rosa vermelha",
    width: 720,
    height: 900
  },
  {
    src: "assets/img/galerias/buques/buque-rosas-vermelhas-classico.webp",
    src480: "assets/img/galerias/buques/buque-rosas-vermelhas-classico-480.webp",
    modelLabel: "buquê clássico de rosas vermelhas",
    alt: "Buquê clássico com rosas vermelhas e folhagens",
    caption: "Rosas vermelhas com acabamento clássico",
    width: 720,
    height: 900
  },
  {
    src: "assets/img/galerias/buques/buque-rosas-com-chocolates.webp",
    src480: "assets/img/galerias/buques/buque-rosas-com-chocolates-480.webp",
    modelLabel: "buquê de rosas com chocolates",
    alt: "Buquê de rosas vermelhas com chocolates e acabamento dourado",
    caption: "Rosas e chocolates em uma composição especial",
    width: 720,
    height: 900
  },
  {
    src: "assets/img/galerias/buques/buque-rosas-vermelhas-amarelas.webp",
    src480: "assets/img/galerias/buques/buque-rosas-vermelhas-amarelas-480.webp",
    modelLabel: "buquê de rosas vermelhas com flores amarelas",
    alt: "Buquê de rosas vermelhas com flores amarelas e folhagens",
    caption: "Rosas vermelhas com contraste amarelo",
    width: 720,
    height: 900
  }
]);

const BASKET_GALLERY_IMAGES = Object.freeze([
  {
    src: "assets/img/galerias/cestas/cesta-cafe-artesanal.webp",
    src480: "assets/img/galerias/cestas/cesta-cafe-artesanal-480.webp",
    modelLabel: "cesta artesanal com pães",
    alt: "Cesta artesanal com pães e acabamento para presente",
    caption: "Cesta artesanal com itens de café",
    width: 720,
    height: 900
  },
  {
    src: "assets/img/galerias/cestas/cesta-masculina-azul.webp",
    src480: "assets/img/galerias/cestas/cesta-masculina-azul-480.webp",
    modelLabel: "cesta masculina azul",
    alt: "Cesta masculina azul com bebida, chocolates e complementos",
    caption: "Composição masculina em tons de azul",
    width: 720,
    height: 900
  },
  {
    src: "assets/img/galerias/cestas/cesta-chocolates-petiscos.webp",
    src480: "assets/img/galerias/cestas/cesta-chocolates-petiscos-480.webp",
    modelLabel: "cesta com chocolates e petiscos",
    alt: "Cesta de presente com chocolates, petiscos e frutas",
    caption: "Cesta com chocolates, petiscos e frutas",
    width: 720,
    height: 900
  }
]);

const ROMANTIC_GALLERY_IMAGES = Object.freeze([
  {
    src: "assets/img/galerias/romanticos/arranjo-romantico-balao-rosas.webp",
    src480: "assets/img/galerias/romanticos/arranjo-romantico-balao-rosas-480.webp",
    modelLabel: "arranjo romântico com balão e rosas",
    alt: "Arranjo romântico com balão Te Amo e rosas cor-de-rosa",
    caption: "Arranjo romântico com balão e rosas",
    width: 720,
    height: 900
  },
  BOUQUET_GALLERY_IMAGES[2],
  BOUQUET_GALLERY_IMAGES[3]
]);

const FLORAL_GALLERY_IMAGES = Object.freeze([
  ROMANTIC_GALLERY_IMAGES[0],
  BOUQUET_GALLERY_IMAGES[0],
  BOUQUET_GALLERY_IMAGES[3]
]);

function loadProducts() {
  const code = fs.readFileSync(path.join(ROOT, "assets/data/produtos.js"), "utf8");
  const context = {};
  vm.runInNewContext(`${code}\nglobalThis.__produtosLocais = produtosLocais;`, context);
  return context.__produtosLocais;
}

const products = loadProducts();

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function html(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function hasProductPrice(product) {
  return Boolean(
    product &&
    product.precoSobConsulta !== true &&
    Number.isFinite(product.preco) &&
    product.preco > 0
  );
}

function relativeAssetPrefix(pagePath) {
  return pagePath.includes("/") ? "../" : "";
}

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE}/${url.replace(/^\/+/, "")}`;
}

function galleryPublicPath(image, directory) {
  if (image.src.startsWith("assets/")) return image.src;
  return `${directory}/${image.src}`;
}

function galleryPagePath(src) {
  if (!src) return "";
  return src.startsWith("assets/") ? `../${src}` : src;
}

function imageInfo(src) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  const hasResponsiveVariants = src.includes("assets/optimized/products/");
  return {
    fallback: src,
    webp480: hasResponsiveVariants
      ? `${base}-480.webp`.replace("assets/optimized/products/", "assets/optimized/products/responsive/")
      : "",
    webp720: hasResponsiveVariants
      ? `${base}-720.webp`.replace("assets/optimized/products/", "assets/optimized/products/responsive/")
      : ""
  };
}

function categoryKey(product) {
  const text = slugify(`${product.categoria} ${product.nome} ${product.descricao}`);
  if (text.includes("adicion") || text.includes("avulso") || text.includes("extra")) return "adicionais";
  if (text.includes("perfume")) return "perfumes";
  if (text.includes("cesta") || text.includes("cestinha")) return "cestas";
  if (text.includes("buque") || text.includes("flor") || text.includes("rosa")) return "buques";
  if (text.includes("kit") || text.includes("box") || text.includes("romant")) return "romanticos";
  return "mimos";
}

function whatsappUrl(product, source = "produto") {
  const msg = product
    ? [
        "Olá! Quero este presente:",
        "",
        `Produto: ${product.nome}`,
        `Categoria: ${product.categoria}`,
        `Valor anunciado: ${hasProductPrice(product) ? money(product.preco) : "sob consulta"}`,
        `Resumo: ${product.descricao}`,
        ...(product.observacaoPreco ? [`Observação: ${product.observacaoPreco}`] : []),
        `Imagem do produto: ${absoluteUrl(product.imagem)}`,
        "",
        "Pode me informar disponibilidade, formas de pagamento e entrega em Canaã dos Carajás?"
      ].join("\n")
    : "Olá! Vi o site da Zadoni Presentes e quero ajuda para escolher um presente em Canaã dos Carajás.";

  const params = new URLSearchParams({
    text: msg,
    utm_source: "site",
    utm_medium: "whatsapp",
    utm_campaign: "seo_local",
    utm_content: product ? `${source}_${slugify(product.nome)}` : source
  });

  return `https://wa.me/${PHONE}?${params.toString()}`;
}

function galleryWhatsAppUrl(image, index, source = "galeria", directory = "", budgetTier = null) {
  const modelLabel = image.modelLabel || `modelo ${index + 1}`;
  const requestOpening = ["cesta-cafe-da-manha-canaa", "cesta-de-aniversario-canaa"].includes(directory)
    ? "Olá! Quero uma cesta parecida com esta referência:"
    : "Olá! Quero um presente parecido com esta referência:";
  const budgetDetails = budgetTier
    ? [
        `Faixa escolhida: ${budgetTier.name}`,
        `Orçamento de referência: ${budgetTier.priceLabel}`,
        `Proposta: ${budgetTier.proposal}`,
        `Composição sugerida: ${budgetTier.composition}`
      ]
    : [];
  const msg = [
    requestOpening,
    "",
    `Modelo: ${modelLabel}`,
    `Resumo: ${image.caption}`,
    ...budgetDetails,
    `Imagem do modelo: ${absoluteUrl(galleryPublicPath(image, directory))}`,
    "",
    ...(budgetTier
      ? [
          "Gostaria que a Zadoni adaptasse este modelo para a faixa escolhida.",
          "Pode confirmar os itens disponíveis, o valor final, as formas de pagamento e a entrega?",
          "Entendo que a foto é uma referência e que itens, marcas e acabamento podem variar conforme disponibilidade."
        ]
      : ["Pode me informar disponibilidade, valor final e opções de personalização?"])
  ].join("\n");

  const params = new URLSearchParams({
    text: msg,
    utm_source: "site",
    utm_medium: "whatsapp",
    utm_campaign: "seo_local",
    utm_content: `${source}_${slugify(modelLabel)}${budgetTier ? `_${budgetTier.id}` : ""}`
  });

  return `https://wa.me/${PHONE}?${params.toString()}`;
}
function picture(product, index, prefix) {
  const img = imageInfo(product.imagem);
  const responsiveSource = img.webp480
    ? `\n                    <source type="image/webp" srcset="${prefix}${html(img.webp480)} 480w, ${prefix}${html(img.webp720)} 720w" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px">`
    : "";
  return `<picture>${responsiveSource}
                    <img src="${prefix}${html(img.fallback)}" alt="${html(product.nome)}" width="720" height="900" loading="lazy" decoding="async" fetchpriority="low">
                </picture>`;
}

function productCard(product, index, prefix = "", source = "produto", options = {}) {
  const key = categoryKey(product);
  const id = `produto-${product.id}`;
  const productLink = prefix ? `../presentes-canaa.html#${id}` : `#${id}`;
  const note = product.observacaoPreco || options.priceNote;
  const priceNote = note ? `\n                <p class="produto-preco-nota">${html(note)}</p>` : "";
  const priceLabel = hasProductPrice(product) ? `A partir de ${money(product.preco)}` : "Valor sob consulta";
  const categoryLabel = options.categoryLabel || product.categoria;
  const addonsLink = prefix && product.exibirAdicionaisNaCategoria === true && Array.isArray(product.adicionaisOpcionais) && product.adicionaisOpcionais.length
    ? `<a class="btn btn-secondary" href="${productLink}">Escolher adicionais</a>\n                    `
    : "";
  const imageOpening = options.keepContext
    ? `<div class="produto-imagem">`
    : `<a class="produto-imagem produto-imagem-link" href="${productLink}" aria-label="Ver detalhes de ${html(product.nome)}">`;
  const imageClosing = options.keepContext ? `</div>` : `</a>`;
  const productName = options.keepContext
    ? html(product.nome)
    : `<a href="${productLink}">${html(product.nome)}</a>`;
  const ctaLabel = options.ctaLabel || "Quero este presente";
  return `<article class="produto-card seo-product-card" id="${id}" data-produto-id="${product.id}" data-category="${key}">
            ${imageOpening}
                ${picture(product, index, prefix)}
                <span class="produto-categoria">${html(categoryLabel)}</span>
            ${imageClosing}
            <div class="produto-content">
                <h3 class="produto-nome">${productName}</h3>
                <p class="produto-descricao">${html(product.descricao)}</p>
                <p class="produto-preco">${priceLabel}</p>${priceNote}
                <div class="produto-acoes">
                    ${addonsLink}<a class="btn-whatsapp-produto" href="${html(whatsappUrl(product, source))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="${html(source)}" data-produto-id="${product.id}">${html(ctaLabel)}</a>
                </div>
            </div>
        </article>`;
}

function jsonLd(items) {
  return `<script type="application/ld+json">
${JSON.stringify(items, null, 2).replace(/</g, "\\u003c")}
    </script>`;
}

function baseSchemas(pageUrl, title, breadcrumbs, options = {}) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      "name": "Zadoni Presentes",
      "alternateName": "Zadoni",
      "description": "Loja de presentes em Canaã dos Carajás com buquês, flores, cestas e mimos personalizados.",
      "url": SITE,
      "logo": `${SITE}/assets/img/brand/logo-zadoni-320.webp`,
      "sameAs": ["https://www.instagram.com/zadonipresentescanaa"]
    }
  ];

  if (options.includeLocalBusiness !== false) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE}/#localbusiness`,
      "name": "Zadoni Presentes",
      "url": SITE,
      "telephone": `+${PHONE}`,
      "image": `${SITE}/assets/optimized/products/buque-te-amo-romantico.jpg`,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Canaã dos Carajás",
        "addressRegion": "PA",
        "addressCountry": "BR"
      },
      "areaServed": "Canaã dos Carajás, Pará"
    });
  }

  schemas.push(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      "name": "Zadoni Presentes",
      "alternateName": "Zadoni",
      "url": SITE,
      "publisher": { "@id": `${SITE}/#organization` }
    }
  );

  if (options.includeWebPage === true) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      "url": pageUrl,
      "name": title,
      "isPartOf": { "@id": `${SITE}/#website` },
      "about": { "@id": `${SITE}/#organization` }
    });
  }

  schemas.push(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  );

  return schemas;
}

function productSchemas(pageProducts, pageUrl, options = {}) {
  return pageProducts.map((product) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.nome,
      "description": product.descricao,
      "image": absoluteUrl(product.imagem),
      "category": product.categoria,
      "brand": { "@type": "Brand", "name": "Zadoni Presentes" },
      "url": `${pageUrl}#produto-${product.id}`
    };

    if (hasProductPrice(product)) {
      const offer = {
        "@type": "Offer",
        "price": Number(product.preco).toFixed(2),
        "priceCurrency": "BRL"
      };

      if (options.includeAvailability !== false) {
        offer.availability = "https://schema.org/InStock";
      }

      offer.url = `${pageUrl}#produto-${product.id}`;

      schema.offers = offer;
    }

    return schema;
  });
}

function itemListSchema(pageProducts, pageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": pageProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${pageUrl}#produto-${product.id}`,
      "name": product.nome
    }))
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };
}

function head({ title, description, canonical, image, type = "website", prefix = "" }) {
  return `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'AW-16938428518');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${html(description)}">
    <meta name="author" content="Zadoni Presentes">
    <meta name="geo.placename" content="Canaã dos Carajás, Pará">
    <meta name="geo.region" content="BR-PA">
    <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${prefix}assets/img/brand/logo-zadoni-180.png">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${html(title)}">
    <meta property="og:description" content="${html(description)}">
    <meta property="og:site_name" content="Zadoni Presentes">
    <meta property="og:type" content="${type}">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${absoluteUrl(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${html(title)}">
    <meta name="twitter:description" content="${html(description)}">
    <meta name="twitter:image" content="${absoluteUrl(image)}">
    <title>${html(title)}</title>
    <link rel="stylesheet" href="${prefix}assets/css/style.css?v=20260829-mobile-carousel-ux-3">`;
}

function navCurrentSection(pagePath) {
  if (pagePath === "index.html") return "inicio";
  if (["presentes-canaa.html", "presentes-canaa-dos-carajas/index.html", "presentes-romanticos-canaa/index.html"].includes(pagePath)) return "presentes";
  if (["buques-canaa-dos-carajas/index.html", "floricultura-canaa-dos-carajas/index.html", "rosas-perfumadas-canaa/index.html"].includes(pagePath)) return "flores";
  if (["cestas-de-presente-canaa/index.html", "cesta-cafe-da-manha-canaa/index.html"].includes(pagePath)) return "cestas";
  if (pagePath === "cesta-de-aniversario-canaa/index.html") return "aniversario";
  if (pagePath === "monte-sua-cesta/index.html") return "monte";
  return "";
}

function header(prefix = "", pagePath = "") {
  const currentSection = navCurrentSection(pagePath);
  const navLink = (section, href, label) => `<li><a href="${prefix}${href}"${currentSection === section ? ` aria-current="page"` : ""}>${label}</a></li>`;
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <a href="${html(whatsappUrl(null, "botao_fixo"))}" class="whatsapp-float" aria-label="Conversar com a Zadoni Presentes pelo WhatsApp" target="_blank" rel="noopener noreferrer" data-track="whatsapp">💬</a>
    <header>
        <div class="container">
            <div class="header-content">
                <a class="logo" href="${prefix}index.html" aria-label="Zadoni Presentes - início"><img class="brand-logo-image" src="${prefix}assets/img/brand/logo-zadoni-96.webp" alt="" width="40" height="40" loading="eager" decoding="async" fetchpriority="high"> <span>Zadoni Presentes</span></a>
                <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-menu">☰</button>
                <nav aria-label="Navegação principal">
                    <ul class="nav-menu" id="nav-menu">
                        ${navLink("inicio", "index.html", "Início")}
                        ${navLink("presentes", "presentes-canaa.html", "Presentes")}
                        ${navLink("flores", "floricultura-canaa-dos-carajas/", "Flores e buquês")}
                        ${navLink("cestas", "cestas-de-presente-canaa/", "Cestas")}
                        ${navLink("aniversario", "cesta-de-aniversario-canaa/", "Aniversário")}
                        ${navLink("monte", "monte-sua-cesta/", "Monte sua cesta")}
                    </ul>
                </nav>
            </div>
        </div>
    </header>`;
}

function footer(prefix = "") {
  return `<footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Zadoni Presentes</h3>
                    <p>Loja de presentes em Canaã dos Carajás com buquês, flores, cestas e surpresas personalizadas.</p>
                </div>
                <div class="footer-section">
                    <h3>Links</h3>
                    <ul>
                        <li><a href="${prefix}presentes-canaa.html">Presentes em Canaã</a></li>
                        <li><a href="${prefix}buques-canaa-dos-carajas/">Buquês</a></li>
                        <li><a href="${prefix}cestas-de-presente-canaa/">Cestas</a></li>
                        <li><a href="${prefix}floricultura-canaa-dos-carajas/">Flores e buquês</a></li>
                        <li><a href="${prefix}cesta-cafe-da-manha-canaa/">Cesta de café</a></li>
                        <li><a href="${prefix}cesta-de-aniversario-canaa/">Cesta de aniversário</a></li>
                        <li><a href="${prefix}rosas-perfumadas-canaa/">Rosas e perfumes</a></li>
                        <li><a href="${prefix}presentes-canaa-dos-carajas/">Entrega de presentes</a></li>
                        <li><a href="${prefix}presentes-romanticos-canaa/">Presentes românticos</a></li>
                        <li><a href="${prefix}monte-sua-cesta/">Monte sua cesta</a></li>
                        <li><a href="${prefix}revenda-chocolates-canaa/">Chocolates</a></li>
                        <li><a href="${prefix}links/">Links oficiais</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contato</h3>
                    <p>Canaã dos Carajás - PA</p>
                    <p>WhatsApp: <a href="https://wa.me/${PHONE}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">94992993138</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/zadonipresentescanaa" target="_blank" rel="noopener noreferrer" data-track="instagram">@zadonipresentescanaa</a></p>
                    <p>Google: <a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">ver avaliações da Zadoni</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Zadoni Presentes - Canaã dos Carajás, PA</p>
            </div>
        </div>
    </footer>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
            ${items.map((item, index) => index === items.length - 1
              ? `<span aria-current="page">${html(item.name)}</span>`
              : `<a href="${html(item.href)}">${html(item.name)}</a>`).join("<span>/</span>")}
        </nav>`;
}

function faqHtml(faqs, sectionId = "") {
  return `<section class="seo-faq"${sectionId ? ` id="${html(sectionId)}"` : ""} aria-labelledby="faq-title">
        <div class="container">
            <h2 id="faq-title">Perguntas frequentes</h2>
            <div class="faq-grid">
                ${faqs.map((faq) => `<details>
                    <summary>${html(faq.q)}</summary>
                    <p>${html(faq.a)}</p>
                </details>`).join("\n                ")}
            </div>
        </div>
    </section>`;
}

function galleryItemListSchema(galleryImages, pageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Modelos de cesta de aniversário",
    "itemListElement": galleryImages.map((image, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${pageUrl}#${image.id}`,
      "name": image.modelLabel,
      "image": absoluteUrl(image.src)
    }))
  };
}

function galleryChoiceHtml(config, image, index, source, ctaLabel) {
  const tiers = config.galleryBudgetTiers || [];

  if (!tiers.length) {
    return `<a class="btn-whatsapp-produto seo-gallery-cta" href="${html(galleryWhatsAppUrl(image, index, source, config.dir))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">${html(ctaLabel)}</a>`;
  }

  const modelLabel = image.modelLabel || `modelo ${index + 1}`;
  return `<div class="seo-gallery-budget">
                            <p class="seo-gallery-budget-title">Escolha a faixa para abrir no WhatsApp</p>
                            <div class="seo-gallery-budget-options">
                                ${tiers.map((tier) => `<a class="seo-gallery-budget-option${tier.featured ? " is-featured" : ""}" href="${html(galleryWhatsAppUrl(image, index, source, config.dir, tier))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-budget-tier="${html(tier.id)}" aria-label="Escolher ${html(modelLabel)} na versão ${html(tier.name)} por ${html(tier.priceLabel)} pelo WhatsApp">
                                    <span>${html(tier.name)}</span>
                                    <strong>${html(tier.priceDisplay)}</strong>
                                    <small>${html(tier.badge)}</small>
                                </a>`).join("\n                                ")}
                            </div>
                            <small class="seo-gallery-budget-help">O WhatsApp receberá o modelo, a faixa, a composição sugerida e o link da imagem.</small>
                        </div>`;
}

function galleryHtml(config) {
  if (!config.galleryImages || config.galleryImages.length === 0) return "";

  const source = slugify(config.h1 || config.galleryTitle || "galeria");
  const ctaLabel = config.galleryCtaLabel || "Escolher este modelo";
  const hasBudgetTiers = Boolean(config.galleryBudgetTiers?.length);

  return `<section class="seo-gallery"${config.gallerySectionId ? ` id="${html(config.gallerySectionId)}"` : ""} aria-labelledby="galeria-title">
        <div class="container">
            <div class="seo-gallery-header">
                <h2 id="galeria-title">${html(config.galleryTitle)}</h2>
                <p>${html(config.galleryIntro)}</p>
            </div>
            ${config.galleryExtras === "cafe" ? `<aside class="seo-gallery-addons" id="cafe-gallery-addons" aria-labelledby="cafe-gallery-addons-title">
                <h3 id="cafe-gallery-addons-title">Adicionais opcionais para sua cesta de café</h3>
                <p>Selecione os complementos desejados antes de escolher o modelo e a faixa de orçamento. O resumo seguirá completo para o WhatsApp.</p>
                <div id="cafe-gallery-addons-options"></div>
                <strong class="seo-gallery-addons-total" id="cafe-gallery-addons-total" aria-live="polite">Nenhum adicional selecionado.</strong>
            </aside>` : ""}
            <div class="seo-gallery-grid${hasBudgetTiers ? " seo-gallery-grid--budget" : ""}">
                ${config.galleryImages.map((image, index) => `<figure class="seo-gallery-item"${image.id ? ` id="${html(image.id)}"` : ""}>
                    ${image.src480 ? `<picture>
                        <source type="image/webp" srcset="${html(galleryPagePath(image.src480))} 480w, ${html(galleryPagePath(image.src))} 720w" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px">
                        <img src="${html(galleryPagePath(image.src))}" alt="${html(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">
                    </picture>` : `<img src="${html(galleryPagePath(image.src))}" alt="${html(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">`}
                    <figcaption>${image.featuredLabel ? `
                        <strong class="local-badge">${html(image.featuredLabel)}</strong>` : ""}
                        <span>${html(image.caption)}</span>${image.description ? `
                        <small class="seo-gallery-note">${html(image.description)}</small>` : ""}
                        ${config.galleryItemNote ? `<small class="seo-gallery-note">${html(config.galleryItemNote)}</small>` : ""}
                        ${galleryChoiceHtml(config, image, index, source, ctaLabel)}
                    </figcaption>
                </figure>`).join("\n                ")}
            </div>
        </div>
    </section>\n`;
}

function socialProofHtml(prefix = "") {
  return `<section class="entregas-reais" aria-labelledby="entregas-reais-title">
        <div class="container">
            <div class="entregas-reais-header">
                <p class="local-badge">Prova social local</p>
                <h2 id="entregas-reais-title">Entregas reais em Canaã dos Carajás</h2>
                <p>Registros de presentes preparados e entregues pela Zadoni. Cada montagem é personalizada conforme a ocasião, o orçamento e os itens disponíveis.</p>
            </div>
            <div class="entregas-reais-grid">
                ${SOCIAL_PROOF_IMAGES.map((image) => `<figure class="entrega-real-card">
                    <picture class="entrega-real-foto">
                        <source type="image/webp" srcset="${prefix}${html(image.src480)} 480w, ${prefix}${html(image.src)} 720w" sizes="(max-width: 639px) 88vw, (max-width: 1023px) 44vw, 220px">
                        <img src="${prefix}${html(image.src)}" alt="${html(image.alt)}" width="720" height="900" loading="lazy" decoding="async">
                    </picture>
                    <figcaption>
                        <strong>${html(image.title)}</strong>
                        <span>${html(image.caption)}</span>
                    </figcaption>
                </figure>`).join("\n                ")}
            </div>
            <div class="entregas-reais-actions">
                <a class="btn btn-outline" href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">Ver avaliações no Google</a>
                <a class="btn btn-secondary" href="${html(whatsappUrl(null, "prova_social_entregas_canaa"))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">Pedir ajuda no WhatsApp</a>
            </div>
        </div>
    </section>\n`;
}
function scripts(prefix, schemas) {
  return `<script src="${prefix}assets/data/produtos.js?v=20260825-artificial-bouquets-1" defer></script>
    <script src="${prefix}assets/js/app.js?v=20260829-mobile-carousel-ux-3" defer></script>
    <script src="${prefix}assets/js/google-ads-whatsapp.js?v=20260727-google-ads" defer></script>
    ${jsonLd(schemas)}`;
}

function pageShell({ path: pagePath, title, description, canonical, image, body, schemas }) {
  const prefix = relativeAssetPrefix(pagePath);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    ${head({ title, description, canonical, image, prefix })}
</head>
<body>
    ${header(prefix, pagePath)}
    ${body}
    ${footer(prefix)}
    ${scripts(prefix, schemas)}
</body>
</html>
`;
}

function categoryPage(config) {
  const prefix = "../";
  const canonical = `${SITE}/${config.dir}/`;
  const priorityIds = new Set((config.priorityProductIds || []).map(String));
  const showProductsSection = config.showProductsSection !== false;
  const pageProducts = showProductsSection
    ? config.filter(products)
      .sort((a, b) => Number(priorityIds.has(String(b.id))) - Number(priorityIds.has(String(a.id))))
      .slice(0, config.limit || 9)
    : [];
  const crumbItems = [
    { name: "Início", href: "../index.html", url: `${SITE}/` },
    ...(config.parentBreadcrumb ? [config.parentBreadcrumb] : []),
    { name: config.h1, href: `../${config.dir}/`, url: canonical }
  ];
  const faqs = config.faqs;
  const productsIntroHtml = config.productsIntro ? `\n                <p class="seo-section-intro">${html(config.productsIntro)}</p>` : "";
  const relatedLinkHtml = config.relatedLink
    ? `\n                <p>${html(config.relatedLink.intro)} <a href="${html(config.relatedLink.href)}">${html(config.relatedLink.label)}</a>${html(config.relatedLink.suffix || ".")}</p>`
    : "";
  const productsSectionHtml = showProductsSection ? `        <section class="seo-products"${config.productsSectionId ? ` id="${html(config.productsSectionId)}"` : ""} aria-labelledby="produtos-title">
            <div class="container">
                <h2 id="produtos-title">${html(config.productsTitle)}</h2>${productsIntroHtml}
                <div class="produtos-grid">
                    ${pageProducts.map((product, index) => productCard(product, index, prefix, slugify(config.h1), {
                      priceNote: config.productPriceNote,
                      categoryLabel: config.productCategoryLabel,
                      keepContext: config.keepProductContext === true,
                      ctaLabel: config.productCtaLabel
                    })).join("\n                    ")}
                </div>
            </div>
        </section>
` : "";
  const showcaseSectionsHtml = config.productsBeforeGallery
    ? `${productsSectionHtml}${galleryHtml(config)}`
    : `${galleryHtml(config)}${productsSectionHtml}`;
  const pageImage = config.image || pageProducts[0]?.imagem || (config.galleryImages?.[0] ? `${config.dir}/${config.galleryImages[0].src}` : "assets/optimized/products/buque-te-amo-romantico.jpg");
  const schemas = [
    ...baseSchemas(canonical, config.title, crumbItems.map(({ name, url }) => ({ name, url })), {
      includeLocalBusiness: config.includeLocalBusiness !== false,
      includeWebPage: config.includeWebPage === true
    }),
    ...(config.includeItemListSchema === true ? [itemListSchema(pageProducts, canonical)] : []),
    ...(config.includeGalleryItemListSchema === true ? [galleryItemListSchema(config.galleryImages, canonical)] : []),
    ...productSchemas(pageProducts, canonical, {
      includeAvailability: config.includeOfferAvailability !== false
    }),
    faqSchema(faqs)
  ];
  const sectionNavHtml = config.sectionNavItems?.length ? `
        <nav class="section-jump-nav" aria-label="Atalhos desta página">
            <div class="container">
                <ul>
                    ${config.sectionNavItems.map((item) => `<li><a href="${html(item.href)}">${html(item.label)}</a></li>`).join("\n                    ")}
                </ul>
            </div>
        </nav>` : "";
  const secondaryCtaHref = config.secondaryCtaHref || "../presentes-canaa.html";
  const secondaryCtaLabel = config.secondaryCtaLabel || "Ver catálogo completo";

  const body = `<main id="conteudo">
        <section class="seo-hero">
            <div class="container">
                ${breadcrumbs(crumbItems)}
                <p class="local-badge">Canaã dos Carajás - PA</p>
                <h1>${html(config.h1)}</h1>
                <p class="hero-hook">${html(config.intro)}</p>
                <div class="hero-buttons">
                    <a class="btn btn-secondary" href="${html(whatsappUrl(null, slugify(config.h1)))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">Pedir pelo WhatsApp</a>
                    <a class="btn btn-outline" href="${html(secondaryCtaHref)}">${html(secondaryCtaLabel)}</a>
                </div>
            </div>
        </section>${sectionNavHtml}
        <section class="seo-copy" aria-labelledby="orientacao-title">
            <div class="container">
                <h2 id="orientacao-title">${html(config.h2)}</h2>
                <p>${html(config.copy1)}</p>
                <p>${html(config.copy2)}</p>${relatedLinkHtml}
            </div>
        </section>
${showcaseSectionsHtml}${config.showSocialProof ? socialProofHtml(prefix) : ""}
        ${faqHtml(faqs, config.faqSectionId)}
        <section class="seo-cta">
            <div class="container">
                <h2>Atendimento local para montar sua surpresa</h2>
                <p>Conte a ocasião, o prazo e o bairro de entrega. A Zadoni orienta as opções disponíveis e monta o presente conforme orçamento e estilo desejado.</p>
                <a class="btn btn-primary" href="${html(whatsappUrl(null, `cta_${slugify(config.h1)}`))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">Chamar a Zadoni</a>
            </div>
        </section>
    </main>`;

  return pageShell({
    path: `${config.dir}/index.html`,
    title: config.title,
    description: config.description,
    canonical,
    image: pageImage,
    body,
    schemas
  });
}

function mainPage() {
  const canonical = `${SITE}/presentes-canaa.html`;
  const featured = products;
  const faqs = [
    {
      q: "A Zadoni entrega presentes em Canaã dos Carajás?",
      a: "Sim. O atendimento é local em Canaã dos Carajás e a disponibilidade de entrega é confirmada pelo WhatsApp conforme horário, bairro e produto escolhido."
    },
    {
      q: "Os valores dos buquês e cestas podem mudar?",
      a: "Sim. Os preços são valores iniciais e podem variar conforme flores, chocolates, bebidas, fotos, cartões e outros complementos adicionados ao presente."
    },
    {
      q: "Posso pedir ajuda para escolher um presente?",
      a: "Pode. Pelo WhatsApp, a Zadoni ajuda a escolher opções de buquês, cestas, kits, perfumes e mimos para a ocasião."
    },
    {
      q: "Onde encontro uma loja de presentes perto de mim em Canaã?",
      a: "A Zadoni atende clientes em Canaã dos Carajás pelo WhatsApp, com catálogo de presentes, confirmação de disponibilidade e orientação para entrega local."
    }
  ];
  const crumbItems = [
    { name: "Início", href: "index.html", url: `${SITE}/` },
    { name: "Presentes em Canaã", href: "presentes-canaa.html", url: canonical }
  ];
  const schemas = [
    ...baseSchemas(canonical, "Loja de Presentes em Canaã dos Carajás", crumbItems.map(({ name, url }) => ({ name, url }))),
    ...productSchemas(featured, canonical),
    faqSchema(faqs)
  ];

  const body = `<main id="conteudo">
        <section class="seo-hero">
            <div class="container">
                ${breadcrumbs(crumbItems)}
                <p class="local-badge">Atendimento local em Canaã dos Carajás - PA</p>
                <h1>Loja de Presentes em Canaã dos Carajás</h1>
                <p class="hero-hook">A Zadoni reúne buquês, flores, cestas de café da manhã, kits românticos, perfumes e mimos com atendimento local pelo WhatsApp.</p>
                <div class="hero-buttons">
                    <a class="btn btn-secondary" href="${html(whatsappUrl(null, "hero_presentes_canaa"))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">Pedir ajuda no WhatsApp</a>
                    <a class="btn btn-outline" href="#produtos-container">Ver produtos</a>
                </div>
            </div>
        </section>
        <section class="perfume-spotlight" aria-labelledby="perfumes-bolso-title">
            <div class="container perfume-spotlight-content">
                <div>
                    <h2 id="perfumes-bolso-title">Perfumes de bolso para presente em Canaã</h2>
                    <p>Fragrâncias Amakha Paris de 15ml com boa fixação e apresentação prática para incluir em kits, buquês e cestas. Uma opção leve para presentear sem depender de datas comemorativas.</p>
                    <div class="perfume-benefits" aria-label="Benefícios dos perfumes de bolso">
                        <span>Alta fixação</span>
                        <span>Frasco 15ml</span>
                        <span>Presente pronto</span>
                        <span>Atendimento em Canaã</span>
                    </div>
                </div>
                <a class="perfume-spotlight-cta" href="rosas-perfumadas-canaa/">Ver rosas e perfumes</a>
            </div>
        </section>
        <section class="seo-copy" aria-labelledby="como-escolher-title">
            <div class="container">
                <h2 id="como-escolher-title">Loja de presentes perto de você em Canaã</h2>
                <p>Quem procura uma loja de presentes perto de casa em Canaã dos Carajás pode consultar a Zadoni pelo WhatsApp. O atendimento local facilita a confirmação de disponibilidade, personalização e entrega. Antes de fechar o pedido, informe a ocasião, o horário desejado e se o presente precisa incluir cartão, foto, chocolates ou bebida.</p>
                <p>Os valores abaixo são iniciais e ajudam no planejamento. A composição final pode mudar conforme tamanho do buquê, flores disponíveis, itens extras e acabamento escolhido.</p>
            </div>
        </section>
        <section class="seo-category-nav" aria-labelledby="categorias-title">
            <div class="container">
                <h2 id="categorias-title">Categorias de presentes</h2>
                <div class="seo-category-groups">
                    <div class="seo-category-group seo-category-group--primary" aria-label="Categorias mais procuradas">
                        <p class="seo-category-group-label">Mais procurados</p>
                        <div class="seo-category-links">
                            <a href="floricultura-canaa-dos-carajas/">Floricultura em Canaã dos Carajás</a>
                            <a href="cesta-cafe-da-manha-canaa/">Cesta de café da manhã em Canaã</a>
                            <a href="buques-canaa-dos-carajas/">Buquês em Canaã</a>
                            <a href="cestas-de-presente-canaa/">Cestas de presente</a>
                            <a href="cesta-de-aniversario-canaa/">Cesta de aniversário em Canaã</a>
                        </div>
                    </div>
                    <div class="seo-category-group seo-category-group--secondary" aria-label="Outras formas de explorar presentes">
                        <p class="seo-category-group-label">Explorar também</p>
                        <div class="seo-category-links">
                            <a href="presentes-romanticos-canaa/">Presentes românticos</a>
                            <a href="presentes-canaa.html#categoria-adicionais">Itens avulsos para cestas</a>
                            <a href="rosas-perfumadas-canaa/">Rosas e perfumes</a>
                            <a href="presentes-canaa-dos-carajas/">Catálogo local</a>
                        </div>
                    </div>
                    <p class="catalog-results-count" id="catalog-results-count" aria-live="polite"></p>
                </div>
            </div>
        </section>
        <section class="seo-products catalog-products" aria-labelledby="produtos-title">
            <div class="container">
                <div class="catalog-products-header">
                    <h2 class="catalog-products-title" id="produtos-title">Escolha por categoria</h2>
                    <div class="filtros-container" aria-label="Filtros de produtos">
                        <button class="filtro-btn ativo" onclick="filtrarProdutos('todos', event)">Todos</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('buquês', event)">Buquês</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('kits', event)">Kits</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('mimos', event)">Mimos</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('cestas', event)">Cestas</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('perfumes', event)">Perfumes de bolso</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('adicionais', event)">Itens avulsos</button>
                        <button class="filtro-btn" onclick="filtrarProdutos('promoções', event)">Destaques</button>
                    </div>
                </div>
                <div class="preco-observacao">
                    <strong>Observação sobre valores:</strong> os preços dos buquês, cestas e kits podem variar para mais ou para menos conforme tamanho, flores, chocolates, bebidas e complementos adicionados ao presente.
                    <a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">Ver avaliações da Zadoni no Google</a>.
                </div>
                <div class="produtos-grid" id="produtos-container">
                    ${featured.map((product, index) => productCard(product, index, "", "catalogo")).join("\n                    ")}
                </div>
                <div class="sem-produtos" id="sem-produtos" aria-live="polite" hidden></div>
            </div>
        </section>
        <section class="seo-copy bg-light" aria-labelledby="entrega-title">
            <div class="container">
                <h2 id="entrega-title">Entrega e atendimento em Canaã dos Carajás</h2>
                <div class="local-info-grid">
                    <article>
                        <h3>Disponibilidade confirmada no WhatsApp</h3>
                        <p>Como flores, bebidas e complementos mudam conforme estoque, a confirmação é feita antes da montagem.</p>
                    </article>
                    <article>
                        <h3>Personalização do presente</h3>
                        <p>É possível consultar opções com cartão, foto impressa, chocolates, perfumes e detalhes escolhidos para a ocasião.</p>
                    </article>
                    <article>
                        <h3>Compra local com orientação</h3>
                        <p>O atendimento ajuda a escolher uma opção proporcional ao orçamento e ao prazo de entrega em Canaã.</p>
                    </article>
                </div>
            </div>
        </section>
        ${socialProofHtml("")}
        ${faqHtml(faqs)}
    </main>`;

  return pageShell({
    path: "presentes-canaa.html",
    title: "Loja de Presentes em Canaã dos Carajás | Zadoni",
    description: "Zadoni é uma loja de presentes em Canaã dos Carajás com buquês, flores, cestas de café da manhã, kits e mimos. Consulte pelo WhatsApp.",
    canonical,
    image: "assets/optimized/products/buque-te-amo-romantico.jpg",
    body,
    schemas
  });
}

const pageConfigs = [
  {
    dir: "presentes-canaa-dos-carajas",
    title: "Entrega de Presentes em Canaã dos Carajás | Zadoni",
    description: "Entrega de presentes em Canaã dos Carajás com buquês, cestas, kits, perfumes e mimos da Zadoni. Consulte disponibilidade pelo WhatsApp.",
    h1: "Entrega de Presentes em Canaã dos Carajás",
    h2: "Opções locais para escolher e enviar um presente",
    intro: "Veja sugestões da Zadoni para presentear em Canaã dos Carajás, com preços iniciais e atendimento pelo WhatsApp para confirmar disponibilidade e entrega.",
    copy1: "Para quem precisa resolver uma surpresa em Canaã dos Carajás, a compra local reduz dúvidas sobre prazo, personalização e entrega.",
    copy2: "A Zadoni trabalha com opções prontas e personalizáveis, incluindo buquês, cestas, kits, perfumes de bolso e mimos de valor acessível.",
    productsTitle: "Produtos locais em destaque",
    showSocialProof: true,
    filter: (items) => items.filter((item) => item.destaque),
    faqs: [
      { q: "Como peço um presente em Canaã?", a: "Escolha uma opção no catálogo e chame no WhatsApp para confirmar disponibilidade, valor final e entrega." },
      { q: "Os produtos são enviados para fora de Canaã?", a: "O foco do catálogo é o atendimento local em Canaã dos Carajás. Consulte pelo WhatsApp para casos específicos." }
    ]
  },
  {
    dir: "buques-canaa-dos-carajas",
    title: "Buquês em Canaã dos Carajás | Floricultura Zadoni",
    description: "Buquês em Canaã dos Carajás com rosas naturais, opções românticas e chocolate. Consulte modelos, personalização e entrega pelo WhatsApp.",
    h1: "Buquês em Canaã dos Carajás",
    h2: "Buquês de rosas naturais, artificiais e com chocolate",
    intro: "Escolha buquês com flores, rosas e acabamento especial para aniversários, pedidos de desculpa, declarações e datas importantes.",
    copy1: "É possível consultar modelos com rosas naturais ou rosas artificiais e opções de buquê com chocolate. Informe a ocasião, a cor preferida e se deseja incluir cartão, foto impressa ou outros complementos.",
    copy2: "Os valores são iniciais e podem mudar conforme as flores disponíveis, a quantidade de rosas, o tamanho do buquê e os complementos escolhidos. A entrega de buquê em Canaã dos Carajás deve ser confirmada pelo WhatsApp conforme endereço, data e horário.",
    relatedLink: {
      intro: "Para conhecer jarros, flores naturais e outros trabalhos florais, visite também a página de",
      href: "../floricultura-canaa-dos-carajas/",
      label: "floricultura em Canaã dos Carajás"
    },
    productsTitle: "Buquês e flores disponíveis",
    galleryTitle: "Modelos reais de buquês preparados pela Zadoni",
    galleryIntro: "Use as fotos como referência de estilo. Flores, cores, tamanho e acabamento são confirmados no WhatsApp conforme disponibilidade.",
    galleryItemNote: "Referência visual: a composição final pode variar conforme flores e complementos disponíveis.",
    galleryCtaLabel: "Consultar este buquê",
    galleryImages: BOUQUET_GALLERY_IMAGES,
    filter: (items) => items.filter((item) => slugify(item.categoria) === "flores"),
    priorityProductIds: [52, 53, 54, 55, 56, 57],
    limit: 12,
    faqs: [
      { q: "Posso personalizar o buquê?", a: "Sim. A personalização depende das flores e complementos disponíveis no momento do pedido." },
      { q: "Buquês têm preço fixo?", a: "Os preços exibidos são iniciais. O valor final varia conforme tamanho, flores e adicionais." },
      { q: "Tem buquê de rosas naturais ou artificiais?", a: "A disponibilidade de modelos com rosas naturais ou artificiais deve ser consultada pelo WhatsApp para a data desejada." },
      { q: "É possível pedir um buquê com chocolate?", a: "Sim. Existem referências com rosas e chocolates, mas marcas, quantidade e composição final dependem da disponibilidade." },
      { q: "A Zadoni faz entrega de buquê em Canaã dos Carajás?", a: "A possibilidade de entrega é confirmada pelo WhatsApp conforme endereço, data, horário e modelo escolhido." }
    ]
  },
  {
    dir: "cestas-de-presente-canaa",
    title: "Cestas de Presente em Canaã dos Carajás | Zadoni",
    description: "Cestas de presente em Canaã dos Carajás com chocolates, bebidas, café e opções românticas. Personalize e consulte a Zadoni pelo WhatsApp.",
    h1: "Cestas de Presente em Canaã dos Carajás",
    h2: "Cestas montadas para diferentes ocasiões",
    intro: "Veja cestas femininas, masculinas, românticas e de café da manhã para presentear em Canaã dos Carajás.",
    copy1: "As cestas podem combinar bebida, chocolates, caneca, petiscos, flores e itens de autocuidado conforme disponibilidade.",
    copy2: "Ao chamar no WhatsApp, informe se o presente é para aniversário, agradecimento, romance ou surpresa corporativa.",
    relatedLink: {
      intro: "Para uma comemoração com bolo, chocolates e personalização, conheça também a página de",
      href: "../cesta-de-aniversario-canaa/",
      label: "cesta de aniversário em Canaã dos Carajás"
    },
    productsTitle: "Cestas locais para pedir pelo WhatsApp",
    galleryTitle: "Cestas reais para escolher como referência",
    galleryIntro: "Veja composições já preparadas pela Zadoni e envie o modelo preferido no WhatsApp para adaptar itens, cores e orçamento.",
    galleryItemNote: "Referência visual: marcas, itens e acabamento dependem da disponibilidade e do orçamento.",
    galleryCtaLabel: "Consultar esta cesta",
    galleryImages: BASKET_GALLERY_IMAGES,
    priorityProductIds: [37],
    filter: (items) => items.filter((item) => categoryKey(item) === "cestas"),
    faqs: [
      { q: "A cesta pode ter itens diferentes?", a: "Pode. A montagem é confirmada pelo WhatsApp conforme estoque e orçamento." },
      { q: "Tem cesta para homens e mulheres?", a: "Sim. O catálogo inclui cestas masculinas, femininas, românticas e de café da manhã." }
    ]
  },
  {
    dir: "cesta-de-aniversario-canaa",
    title: "Cesta de Aniversário em Canaã dos Carajás | Zadoni",
    description: "Cesta de aniversário em Canaã dos Carajás com chocolates, bolo e personalização. Escolha um modelo e consulte entrega local pelo WhatsApp.",
    image: "assets/img/galerias/cestas-aniversario/cesta-aniversario-doce-surpresa.webp",
    h1: "Cesta de Aniversário em Canaã dos Carajás",
    h2: "Como escolher uma cesta para celebrar o aniversário",
    intro: "Escolha uma cesta de aniversário com chocolates, bolo, snacks ou detalhes personalizados e consulte a Zadoni para adaptar a composição, o acabamento e a entrega em Canaã dos Carajás.",
    copy1: "Para escolher bem, considere o gosto de quem vai receber, a quantidade de pessoas, o orçamento e se a surpresa deve incluir bolo, chocolates, bebidas, cartão, foto, balão ou pelúcia.",
    copy2: "As fotos são referências de montagem. Itens, marcas, sabores, cores e acabamento podem variar conforme disponibilidade; a composição e o valor final são confirmados antes do pedido.",
    relatedLink: {
      intro: "Para conhecer cestas para outras ocasiões, visite também a página de",
      href: "../cestas-de-presente-canaa/",
      label: "cestas de presente em Canaã dos Carajás"
    },
    parentBreadcrumb: {
      name: "Cestas de Presente",
      href: "../cestas-de-presente-canaa/",
      url: `${SITE}/cestas-de-presente-canaa/`
    },
    productsTitle: "Bolos confeitados para aniversário",
    productsIntro: "Escolha entre mini bolos e bolos confeitados de 2 kg. Sabor, tema, cores, acabamento e disponibilidade são confirmados no WhatsApp antes do pedido.",
    productCategoryLabel: "Bolos de aniversário",
    productCtaLabel: "Consultar este bolo",
    keepProductContext: true,
    productsSectionId: "bolos-aniversario",
    productsBeforeGallery: true,
    gallerySectionId: "cestas-aniversario",
    faqSectionId: "duvidas-aniversario",
    secondaryCtaHref: "#bolos-aniversario",
    secondaryCtaLabel: "Ver bolos e cestas",
    sectionNavItems: [
      { href: "#orientacao-title", label: "Como escolher" },
      { href: "#bolos-aniversario", label: "Bolos" },
      { href: "#cestas-aniversario", label: "Cestas" },
      { href: "#duvidas-aniversario", label: "Dúvidas" }
    ],
    galleryTitle: "Modelos de cesta de aniversário para escolher",
    galleryIntro: "Compare as referências e envie o modelo preferido pelo WhatsApp. A Zadoni confirma os itens disponíveis, as possibilidades de personalização, o valor e a entrega local.",
    galleryCtaLabel: "Escolher e confirmar com a Zadoni",
    galleryImages: BIRTHDAY_BASKET_GALLERY_IMAGES,
    priorityProductIds: [38, 58, 59, 42],
    includeLocalBusiness: false,
    includeWebPage: true,
    includeGalleryItemListSchema: true,
    filter: (items) => items.filter((item) => [38, 42, 58, 59].includes(Number(item.id))),
    faqs: [
      { q: "O que pode vir em uma cesta de aniversário?", a: "A composição pode incluir chocolates, bolo, brigadeiros, snacks, bebidas, cartão e outros complementos conforme o modelo, o orçamento e a disponibilidade." },
      { q: "É possível personalizar a cesta com foto ou mensagem?", a: "Sim. Consulte pelo WhatsApp as opções disponíveis de cartão, mensagem, foto, balão, pelúcia e acabamento para a data desejada." },
      { q: "As marcas e os itens das fotos são garantidos?", a: "Não. As fotos servem como referência; marcas, sabores, quantidades e acabamento podem variar conforme disponibilidade e orçamento." },
      { q: "Qual é o valor de uma cesta de aniversário?", a: "O valor depende do modelo, da quantidade de itens e dos adicionais escolhidos. A Zadoni confirma a composição e o preço final antes do pedido." },
      { q: "A Zadoni entrega cesta de aniversário em Canaã dos Carajás?", a: "A possibilidade de entrega é confirmada pelo WhatsApp conforme endereço, data, horário e disponibilidade do modelo." }
    ]
  },
  {
    dir: "floricultura-canaa-dos-carajas",
    title: "Floricultura em Canaã dos Carajás | Zadoni",
    description: "Floricultura em Canaã dos Carajás com flores naturais, arranjos florais e opções para presente. Consulte disponibilidade e entrega pelo WhatsApp.",
    h1: "Floricultura em Canaã dos Carajás",
    h2: "Flores naturais e arranjos florais para presente",
    intro: "Quem procura uma floricultura em Canaã dos Carajás também pode encontrar na Zadoni opções de buquês, rosas, flores e presentes preparados para momentos especiais. Os modelos podem variar conforme a disponibilidade e a personalização desejada.",
    copy1: "A Zadoni oferece flores naturais, arranjos florais e opções com flores para presente em Canaã dos Carajás. Os modelos podem incluir jarros, rosas, composições decoradas e detalhes personalizados.",
    copy2: "A disponibilidade das flores, a composição e a possibilidade de entrega são confirmadas pelo WhatsApp conforme o modelo, o endereço, a data e o horário desejados.",
    relatedLink: {
      intro: "Se a procura for por modelos montados com rosas e complementos, veja também os",
      href: "../buques-canaa-dos-carajas/",
      label: "buquês em Canaã dos Carajás"
    },
    productsTitle: "Flores naturais, jarros e arranjos disponíveis",
    galleryTitle: "Trabalhos florais e arranjos reais da Zadoni",
    galleryIntro: "Conheça referências de flores, rosas e arranjos já preparados para clientes em Canaã dos Carajás.",
    galleryItemNote: "As flores e o acabamento podem variar conforme disponibilidade e personalização.",
    galleryCtaLabel: "Consultar este trabalho floral",
    galleryImages: FLORAL_GALLERY_IMAGES,
    includeLocalBusiness: false,
    includeWebPage: true,
    includeItemListSchema: true,
    includeOfferAvailability: false,
    filter: (items) => items.filter((item) => [2, 25, 26, 27].includes(Number(item.id))),
    faqs: [
      { q: "A Zadoni trabalha com flores e buquês em Canaã dos Carajás?", a: "A Zadoni oferece opções de buquês, rosas, flores e presentes conforme os modelos e a disponibilidade. A consulta pode ser feita diretamente pelo WhatsApp." },
      { q: "Como encontrar uma floricultura perto de mim em Canaã?", a: "Se você está em Canaã dos Carajás, consulte a Zadoni pelo WhatsApp para conhecer os buquês e flores disponíveis e confirmar as condições de entrega local." },
      { q: "A Zadoni faz entrega de flores em Canaã dos Carajás?", a: "A possibilidade de entrega é confirmada pelo WhatsApp conforme o modelo, endereço, data e horário desejados." },
      { q: "Quais arranjos florais estão disponíveis?", a: "A Zadoni trabalha com referências de jarros, rosas, flores naturais e composições decoradas. Os modelos disponíveis devem ser confirmados no atendimento." },
      { q: "É possível personalizar o presente?", a: "Algumas opções podem receber complementos e detalhes personalizados. A disponibilidade deve ser confirmada durante o atendimento." },
      { q: "Como saber quais modelos estão disponíveis?", a: "Entre em contato pelo WhatsApp para consultar os modelos, valores e condições disponíveis para a data desejada." }
    ]
  },
  {
    dir: "cesta-cafe-da-manha-canaa",
    title: "Cesta de Café da Manhã em Canaã dos Carajás | Zadoni",
    description: "Cesta de café da manhã em Canaã dos Carajás nas versões Básica, Intermediária e Premium. Escolha o modelo e consulte a Zadoni pelo WhatsApp.",
    image: "cesta-cafe-da-manha-canaa/cesta-cafe-da-manha-modelo-real-08.webp",
    h1: "Cesta de Café da Manhã em Canaã dos Carajás",
    h2: "Como funciona o pedido da cesta de café",
    intro: "Quem procura cesta de café da manhã em Canaã dos Carajás encontra na Zadoni modelos reais com itens selecionados e possibilidades de personalização conforme orçamento e disponibilidade.",
    copy1: "Primeiro escolha uma referência visual na galeria e depois selecione a faixa Básica, Intermediária ou Premium. O WhatsApp receberá um resumo com o modelo, orçamento, composição sugerida e link da imagem.",
    copy2: "As fotos abaixo são referências de estilo e acabamento. A Zadoni adapta cada modelo à faixa escolhida e confirma os itens disponíveis, a personalização e o valor final durante o atendimento.",
    productsTitle: "Base de orçamento para cesta de café",
    productsIntro: "Use esta opção como ponto de partida para o atendimento. O valor exibido é inicial; a composição final é montada a partir do modelo escolhido na galeria, dos itens disponíveis e da personalização desejada.",
    galleryTitle: "Escolha um modelo de inspiração",
    galleryIntro: "As imagens mostram composições reais já preparadas pela Zadoni. Em cada modelo, escolha uma montagem Básica a partir de R$ 189, Intermediária a partir de R$ 270 ou Premium a partir de R$ 300.",
    galleryItemNote: "A foto é uma referência visual. Itens, marcas e acabamento são adaptados à faixa e à disponibilidade.",
    galleryCtaLabel: "Consultar este modelo",
    galleryBudgetTiers: BASKET_BUDGET_TIERS,
    galleryExtras: "cafe",
    showProductsSection: false,
    productPriceNote: "Valor inicial. O preço final pode variar conforme itens escolhidos, disponibilidade, tamanho da montagem e personalização; pode ficar em torno de R$ 200, R$ 300 ou mais.",
    galleryImages: [
      { src: "cesta-cafe-da-manha-modelo-real-01.jpeg", alt: "Modelo real de cesta personalizada da Zadoni em Canaã dos Carajás", caption: "Modelo real preparado pela Zadoni", width: 610, height: 1356 },
      { src: "cesta-cafe-da-manha-modelo-real-02.jpeg", alt: "Cesta personalizada com itens selecionados para presente", caption: "Composição com itens selecionados", width: 736, height: 920 },
      { src: "cesta-cafe-da-manha-modelo-real-03.jpeg", alt: "Cesta personalizada para momento especial em Canaã dos Carajás", caption: "Opção para momento especial", width: 736, height: 981 },
      { src: "cesta-cafe-da-manha-modelo-real-04.jpeg", alt: "Modelo de cesta personalizada com acabamento para presente", caption: "Acabamento personalizado", width: 736, height: 977 },
      { src: "cesta-cafe-da-manha-modelo-real-05.jpeg", alt: "Cesta personalizada da Zadoni com itens e detalhes decorativos", caption: "Detalhes variam conforme disponibilidade", width: 736, height: 981 },
      { src: "cesta-cafe-da-manha-modelo-real-06.jpeg", alt: "Cesta de presente personalizada com composição consultada pelo WhatsApp", caption: "Composição confirmada no atendimento", width: 736, height: 977 },
      { src: "cesta-cafe-da-manha-modelo-real-07.jpeg", alt: "Cesta personalizada real para presente em Canaã dos Carajás", caption: "Modelo real da Zadoni", width: 697, height: 1089 },
      { src: "cesta-cafe-da-manha-modelo-real-08.webp", alt: "Cesta de café da manhã com laço rosa e itens selecionados em Canaã dos Carajás", caption: "Cesta matinal com laço rosa", width: 720, height: 960 },
      { src: "cesta-cafe-da-manha-modelo-real-09.webp", alt: "Cesta de café da manhã com frutas, pães, chocolates e bebida", caption: "Modelo com frutas e itens de café", width: 720, height: 960 },
      { src: "cesta-cafe-da-manha-modelo-real-10.webp", alt: "Cesta de café da manhã personalizada com frutas, caneca e itens matinais", caption: "Cesta personalizada com caneca", width: 720, height: 960 },
      { src: "cesta-cafe-da-manha-modelo-real-11.webp", alt: "Cesta de café da manhã romântica com frutas, chocolates e balão", caption: "Versão romântica para café da manhã", width: 720, height: 720 },
      BASKET_GALLERY_IMAGES[0]
    ],
    includeLocalBusiness: false,
    includeWebPage: true,
    includeItemListSchema: true,
    includeOfferAvailability: false,
    filter: (items) => items.filter((item) => {
      const text = slugify(item.nome + " " + item.descricao + " " + item.categoria);
      return text.includes("cafe") && text.includes("manha");
    }),
    faqs: [
      { q: "O que pode acompanhar a cesta de café da manhã?", a: "A composição varia conforme o modelo escolhido e a disponibilidade dos itens. Consulte pelo WhatsApp para conhecer as opções atuais." },
      { q: "Quais são as faixas de montagem?", a: "Cada modelo pode ser solicitado nas versões Básica a partir de R$ 189, Intermediária a partir de R$ 270 ou Premium a partir de R$ 300. A composição e o valor final são confirmados pelo WhatsApp." },
      { q: "É possível personalizar a cesta?", a: "A possibilidade de personalização depende do modelo e dos itens disponíveis. Os detalhes podem ser definidos durante o atendimento." },
      { q: "Como consultar preço e disponibilidade?", a: "Entre em contato pelo WhatsApp informando a data, a ocasião e o tipo de cesta desejada." }
    ]
  },
  {
    dir: "presentes-romanticos-canaa",
    title: "Presentes Românticos em Canaã dos Carajás | Zadoni",
    description: "Presentes românticos em Canaã dos Carajás: buquês, boxes, kits, cestas e mimos para declarar carinho.",
    h1: "Presentes Românticos em Canaã dos Carajás",
    h2: "Surpresas para declarar carinho",
    intro: "Opções românticas para namoro, aniversário de relacionamento, pedido de desculpas ou uma surpresa fora de data.",
    copy1: "Presentes românticos funcionam melhor quando combinam mensagem, visual e um item que tenha a ver com a pessoa presenteada.",
    copy2: "A Zadoni ajuda a escolher entre buquês, boxes, cestas e mimos conforme prazo, orçamento e estilo da surpresa.",
    productsTitle: "Sugestões românticas da Zadoni",
    galleryTitle: "Referências reais para uma surpresa romântica",
    galleryIntro: "Arranjos e buquês preparados pela Zadoni para inspirar uma composição personalizada.",
    galleryItemNote: "A foto serve como inspiração; itens, flores e acabamento são confirmados no atendimento.",
    galleryCtaLabel: "Consultar esta inspiração",
    galleryImages: ROMANTIC_GALLERY_IMAGES,
    priorityProductIds: [37],
    filter: (items) => items.filter((item) => /romantic|romant|amor|te amo|rosa|vinho|box|kit/i.test(slugify(`${item.nome} ${item.descricao}`))),
    faqs: [
      { q: "Dá para montar presente romântico no mesmo dia?", a: "A disponibilidade depende do horário e dos itens escolhidos. O WhatsApp confirma as opções viáveis." },
      { q: "Posso incluir mensagem no presente?", a: "Sim. Consulte opções de cartão, foto ou detalhes personalizados no atendimento." }
    ]
  },
  {
    dir: "rosas-perfumadas-canaa",
    title: "Rosas e Perfumes em Canaã dos Carajás | Zadoni",
    description: "Rosas, buquês e perfumes de bolso em Canaã dos Carajás para presentes elegantes e fáceis de pedir pelo WhatsApp.",
    h1: "Rosas e Perfumes em Canaã dos Carajás",
    h2: "Combinações delicadas para presentes marcantes",
    intro: "Rosas, flores naturais e perfumes de bolso são opções práticas para montar uma surpresa elegante em Canaã dos Carajás.",
    copy1: "A combinação de flor e fragrância funciona para presentes românticos, aniversários e lembranças de agradecimento.",
    copy2: "Os perfumes de bolso ajudam a complementar buquês, cestas e boxes, criando um presente compacto e bem apresentado.",
    productsTitle: "Rosas, flores e perfumes de bolso",
    filter: (items) => items.filter((item) => {
      const text = slugify(`${item.nome} ${item.descricao} ${item.categoria}`);
      return text.includes("rosa") || text.includes("flor") || text.includes("buque") || text.includes("perfume");
    }),
    faqs: [
      { q: "Posso combinar rosas com perfume?", a: "Sim. Consulte pelo WhatsApp as fragrâncias e flores disponíveis para montar a combinação." },
      { q: "Os perfumes de bolso têm preço inicial?", a: "Sim. Os perfumes de bolso cadastrados aparecem com preço inicial real no catálogo." }
    ]
  }
];

function writeFile(filePath, content) {
  const fullPath = path.join(ROOT, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.replace(/[ \t]+\r?\n/g, "\n"), "utf8");
}

writeFile("presentes-canaa.html", mainPage());

for (const config of pageConfigs) {
  writeFile(`${config.dir}/index.html`, categoryPage(config));
}

const urls = [
  { loc: `${SITE}/`, priority: "1.0" },
  { loc: `${SITE}/presentes-canaa.html`, priority: "0.95" },
  { loc: `${SITE}/presentes-canaa-dos-carajas/`, priority: "0.9" },
  { loc: `${SITE}/buques-canaa-dos-carajas/`, priority: "0.85" },
  { loc: `${SITE}/cestas-de-presente-canaa/`, priority: "0.85" },
  { loc: `${SITE}/cesta-de-aniversario-canaa/`, priority: "0.86" },
  { loc: `${SITE}/floricultura-canaa-dos-carajas/`, priority: "0.88" },
  { loc: `${SITE}/cesta-cafe-da-manha-canaa/`, priority: "0.88" },
  { loc: `${SITE}/monte-sua-cesta/`, priority: "0.9" },
  { loc: `${SITE}/presentes-romanticos-canaa/`, priority: "0.85" },
  { loc: `${SITE}/rosas-perfumadas-canaa/`, priority: "0.8" },
  { loc: `${SITE}/revenda-chocolates-canaa/`, priority: "0.88" },
  { loc: `${SITE}/achadinhos/`, priority: "0.8" },
  { loc: `${SITE}/achadinhos/presentes-para-namorada/`, priority: "0.7" },
  { loc: `${SITE}/achadinhos/presentes-criativos/`, priority: "0.7" },
  { loc: `${SITE}/achadinhos/presentes-de-aniversario/`, priority: "0.7" }
];

writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>
`);

writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Generated ${pageConfigs.length + 1} SEO pages and sitemap.xml`);
