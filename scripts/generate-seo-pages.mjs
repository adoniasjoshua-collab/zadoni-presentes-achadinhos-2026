import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SITE = "https://zadonipresentes.com.br";
const PHONE = "5594992993138";
const ROOT = process.cwd();

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

function relativeAssetPrefix(pagePath) {
  return pagePath.includes("/") ? "../" : "";
}

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE}/${url.replace(/^\/+/, "")}`;
}

function imageInfo(src) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  return {
    fallback: src,
    webp480: `${base}-480.webp`.replace("assets/optimized/products/", "assets/optimized/products/responsive/"),
    webp720: `${base}-720.webp`.replace("assets/optimized/products/", "assets/optimized/products/responsive/")
  };
}

function categoryKey(product) {
  const text = slugify(`${product.categoria} ${product.nome} ${product.descricao}`);
  if (text.includes("perfume")) return "perfumes";
  if (text.includes("cesta") || text.includes("cestinha")) return "cestas";
  if (text.includes("buque") || text.includes("flor") || text.includes("rosa")) return "buques";
  if (text.includes("kit") || text.includes("box") || text.includes("romant")) return "romanticos";
  return "mimos";
}

function whatsappUrl(product, source = "produto") {
  const msg = product
    ? [
        `Olá! Tenho interesse em ${product.nome}.`,
        `Vi no site da Zadoni Presentes.`,
        `Pode me passar disponibilidade, formas de pagamento e entrega em Canaã dos Carajás?`
      ].join(" ")
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

function galleryWhatsAppUrl(image, index, source = "galeria") {
  const modelLabel = image.modelLabel || `modelo ${index + 1}`;
  const msg = [
    `Ola! Tenho interesse em uma cesta de cafe da manha parecida com o ${modelLabel}.`,
    "Vi esse modelo real no site da Zadoni Presentes.",
    "Pode me passar disponibilidade, valor final e opcoes de personalizacao?"
  ].join(" ");

  const params = new URLSearchParams({
    text: msg,
    utm_source: "site",
    utm_medium: "whatsapp",
    utm_campaign: "seo_local",
    utm_content: `${source}_${slugify(modelLabel)}`
  });

  return `https://wa.me/${PHONE}?${params.toString()}`;
}
function picture(product, index, prefix) {
  const img = imageInfo(product.imagem);
  const eager = index === 0;
  return `<picture>
                    <source type="image/webp" srcset="${prefix}${html(img.webp480)} 480w, ${prefix}${html(img.webp720)} 720w" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px">
                    <img src="${prefix}${html(img.fallback)}" alt="${html(product.nome)}" width="720" height="900" loading="${eager ? "eager" : "lazy"}" decoding="async" fetchpriority="${eager ? "high" : "low"}">
                </picture>`;
}

function productCard(product, index, prefix = "", source = "produto", options = {}) {
  const key = categoryKey(product);
  const id = `produto-${product.id}`;
  const productLink = prefix ? `../presentes-canaa.html#${id}` : `#${id}`;
  const note = product.observacaoPreco || options.priceNote;
  const priceNote = note ? `\n                <p class="produto-preco-nota">${html(note)}</p>` : "";
  return `<article class="produto-card seo-product-card" id="${id}" data-produto-id="${product.id}" data-category="${key}">
            <a class="produto-imagem produto-imagem-link" href="${productLink}" aria-label="Ver detalhes de ${html(product.nome)}">
                ${picture(product, index, prefix)}
                <span class="produto-categoria">${html(product.categoria)}</span>
            </a>
            <div class="produto-content">
                <h3 class="produto-nome"><a href="${productLink}">${html(product.nome)}</a></h3>
                <p class="produto-descricao">${html(product.descricao)}</p>
                <p class="produto-preco">A partir de ${money(product.preco)}</p>${priceNote}
                <div class="produto-acoes">
                    <a class="btn-whatsapp-produto" href="${html(whatsappUrl(product, source))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-produto-id="${product.id}">Quero este presente</a>
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
      "url": SITE,
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
    const offer = {
      "@type": "Offer",
      "price": Number(product.preco).toFixed(2),
      "priceCurrency": "BRL"
    };

    if (options.includeAvailability !== false) {
      offer.availability = "https://schema.org/InStock";
    }

    offer.url = `${pageUrl}#produto-${product.id}`;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.nome,
      "description": product.descricao,
      "image": absoluteUrl(product.imagem),
      "category": product.categoria,
      "brand": { "@type": "Brand", "name": "Zadoni Presentes" },
      "url": `${pageUrl}#produto-${product.id}`,
      "offers": offer
    };
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
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${html(title)}">
    <meta property="og:description" content="${html(description)}">
    <meta property="og:type" content="${type}">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${absoluteUrl(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${html(title)}">
    <meta name="twitter:description" content="${html(description)}">
    <meta name="twitter:image" content="${absoluteUrl(image)}">
    <link rel="preload" as="image" href="${prefix}${html(imageInfo(image).webp720)}" imagesrcset="${prefix}${html(imageInfo(image).webp480)} 480w, ${prefix}${html(imageInfo(image).webp720)} 720w" imagesizes="(max-width: 640px) 92vw, 720px" type="image/webp" fetchpriority="high">
    <title>${html(title)}</title>
    <link rel="stylesheet" href="${prefix}assets/css/style.css?v=20260811-catalog-opt">`;
}

function header(prefix = "") {
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <a href="${html(whatsappUrl(null, "botao_fixo"))}" class="whatsapp-float" aria-label="Conversar com a Zadoni Presentes pelo WhatsApp" target="_blank" rel="noopener noreferrer" data-track="whatsapp">💬</a>
    <header>
        <div class="container">
            <div class="header-content">
                <a class="logo" href="${prefix}index.html">🎁 <span>Zadoni Presentes</span></a>
                <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false">☰</button>
                <nav aria-label="Navegação principal">
                    <ul class="nav-menu">
                        <li><a href="${prefix}index.html">Início</a></li>
                        <li><a href="${prefix}presentes-canaa.html">Presentes</a></li>
                        <li><a href="${prefix}buques-canaa-dos-carajas/">Buquês</a></li>
                        <li><a href="${prefix}cestas-de-presente-canaa/">Cestas</a></li>
                        <li><a href="${prefix}floricultura-canaa-dos-carajas/">Flores e buquês</a></li>
                        <li><a href="${prefix}cesta-cafe-da-manha-canaa/">Cesta de café</a></li>
                        <li><a href="${prefix}presentes-romanticos-canaa/">Românticos</a></li>
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
                    <p>Presentes, buquês, cestas e surpresas com atendimento local em Canaã dos Carajás - PA.</p>
                </div>
                <div class="footer-section">
                    <h3>Links</h3>
                    <ul>
                        <li><a href="${prefix}presentes-canaa.html">Presentes em Canaã</a></li>
                        <li><a href="${prefix}buques-canaa-dos-carajas/">Buquês</a></li>
                        <li><a href="${prefix}cestas-de-presente-canaa/">Cestas</a></li>
                        <li><a href="${prefix}floricultura-canaa-dos-carajas/">Flores e buquês</a></li>
                        <li><a href="${prefix}cesta-cafe-da-manha-canaa/">Cesta de café</a></li>
                        <li><a href="${prefix}rosas-perfumadas-canaa/">Rosas e perfumes</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contato</h3>
                    <p>Canaã dos Carajás - PA</p>
                    <p>WhatsApp: <a href="https://wa.me/${PHONE}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">94992993138</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/zadonipresentescanaa" target="_blank" rel="noopener noreferrer" data-track="instagram">@zadonipresentescanaa</a></p>
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

function faqHtml(faqs) {
  return `<section class="seo-faq" aria-labelledby="faq-title">
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

function galleryHtml(config) {
  if (!config.galleryImages || config.galleryImages.length === 0) return "";

  const source = slugify(config.h1 || config.galleryTitle || "galeria");
  const ctaLabel = config.galleryCtaLabel || "Escolher este modelo";

  return `<section class="seo-gallery" aria-labelledby="galeria-title">
        <div class="container">
            <div class="seo-gallery-header">
                <h2 id="galeria-title">${html(config.galleryTitle)}</h2>
                <p>${html(config.galleryIntro)}</p>
            </div>
            <div class="seo-gallery-grid">
                ${config.galleryImages.map((image, index) => `<figure class="seo-gallery-item">
                    <img src="${html(image.src)}" alt="${html(image.alt)}" width="${image.width}" height="${image.height}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
                    <figcaption>
                        <span>${html(image.caption)}</span>
                        ${config.galleryItemNote ? `<small class="seo-gallery-note">${html(config.galleryItemNote)}</small>` : ""}
                        <a class="btn-whatsapp-produto seo-gallery-cta" href="${html(galleryWhatsAppUrl(image, index, source))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">${html(ctaLabel)}</a>
                    </figcaption>
                </figure>`).join("\n                ")}
            </div>
        </div>
    </section>\n`;
}
function scripts(prefix, schemas) {
  return `<script src="${prefix}assets/data/produtos.js?v=20260815-sales-engine" defer></script>
    <script src="${prefix}assets/js/app.js?v=20260811-catalog-opt" defer></script>
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
    ${header(prefix)}
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
    { name: config.h1, href: `../${config.dir}/`, url: canonical }
  ];
  const faqs = config.faqs;
  const productsIntroHtml = config.productsIntro ? `\n                <p class="seo-section-intro">${html(config.productsIntro)}</p>` : "";
  const productsSectionHtml = showProductsSection ? `        <section class="seo-products" aria-labelledby="produtos-title">
            <div class="container">
                <h2 id="produtos-title">${html(config.productsTitle)}</h2>${productsIntroHtml}
                <div class="produtos-grid">
                    ${pageProducts.map((product, index) => productCard(product, index, prefix, slugify(config.h1), { priceNote: config.productPriceNote })).join("\n                    ")}
                </div>
            </div>
        </section>
` : "";
  const pageImage = config.image || pageProducts[0]?.imagem || (config.galleryImages?.[0] ? `${config.dir}/${config.galleryImages[0].src}` : "assets/optimized/products/buque-te-amo-romantico.jpg");
  const schemas = [
    ...baseSchemas(canonical, config.title, crumbItems.map(({ name, url }) => ({ name, url })), {
      includeLocalBusiness: config.includeLocalBusiness !== false,
      includeWebPage: config.includeWebPage === true
    }),
    ...(config.includeItemListSchema === true ? [itemListSchema(pageProducts, canonical)] : []),
    ...productSchemas(pageProducts, canonical, {
      includeAvailability: config.includeOfferAvailability !== false
    }),
    faqSchema(faqs)
  ];

  const body = `<main id="conteudo">
        <section class="seo-hero">
            <div class="container">
                ${breadcrumbs(crumbItems)}
                <p class="local-badge">Canaã dos Carajás - PA</p>
                <h1>${html(config.h1)}</h1>
                <p class="hero-hook">${html(config.intro)}</p>
                <div class="hero-buttons">
                    <a class="btn btn-secondary" href="${html(whatsappUrl(null, slugify(config.h1)))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp">Pedir pelo WhatsApp</a>
                    <a class="btn btn-outline" href="../presentes-canaa.html">Ver catálogo completo</a>
                </div>
            </div>
        </section>
        <section class="seo-copy" aria-labelledby="orientacao-title">
            <div class="container">
                <h2 id="orientacao-title">${html(config.h2)}</h2>
                <p>${html(config.copy1)}</p>
                <p>${html(config.copy2)}</p>
            </div>
        </section>
${galleryHtml(config)}${productsSectionHtml}
        ${faqHtml(faqs)}
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
    }
  ];
  const crumbItems = [
    { name: "Início", href: "index.html", url: `${SITE}/` },
    { name: "Presentes em Canaã", href: "presentes-canaa.html", url: canonical }
  ];
  const schemas = [
    ...baseSchemas(canonical, "Presentes em Canaã dos Carajás", crumbItems.map(({ name, url }) => ({ name, url }))),
    ...productSchemas(featured, canonical),
    faqSchema(faqs)
  ];

  const body = `<main id="conteudo">
        <section class="seo-hero">
            <div class="container">
                ${breadcrumbs(crumbItems)}
                <p class="local-badge">Atendimento local em Canaã dos Carajás - PA</p>
                <h1>Presentes em Canaã dos Carajás: Buquês, Cestas e Surpresas</h1>
                <p class="hero-hook">Escolha buquês, cestas, kits românticos, perfumes de bolso e mimos prontos para surpreender com atendimento rápido pelo WhatsApp.</p>
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
                <h2 id="como-escolher-title">Como escolher um presente local com mais segurança</h2>
                <p>Comprar de uma loja local em Canaã dos Carajás facilita a confirmação de disponibilidade, personalização e entrega. Antes de fechar o pedido, informe a ocasião, o horário desejado e se o presente precisa incluir cartão, foto, chocolates ou bebida.</p>
                <p>Os valores abaixo são iniciais e ajudam no planejamento. A composição final pode mudar conforme tamanho do buquê, flores disponíveis, itens extras e acabamento escolhido.</p>
            </div>
        </section>
        <section class="seo-category-nav" aria-labelledby="categorias-title">
            <div class="container">
                <h2 id="categorias-title">Categorias de presentes</h2>
                <div class="seo-category-links">
                    <a href="buques-canaa-dos-carajas/">Buquês em Canaã</a>
                    <a href="cestas-de-presente-canaa/">Cestas de presente</a>
                    <a href="floricultura-canaa-dos-carajas/">Flores e buquês em Canaã</a>
                    <a href="cesta-cafe-da-manha-canaa/">Cesta matinal personalizada</a>
                    <a href="presentes-romanticos-canaa/">Presentes românticos</a>
                    <a href="rosas-perfumadas-canaa/">Rosas e perfumes</a>
                    <a href="presentes-canaa-dos-carajas/">Catálogo local</a>
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
                        <button class="filtro-btn" onclick="filtrarProdutos('promoções', event)">Destaques</button>
                    </div>
                </div>
                <div class="preco-observacao">
                    <strong>Observação sobre valores:</strong> os preços dos buquês, cestas e kits podem variar para mais ou para menos conforme tamanho, flores, chocolates, bebidas e complementos adicionados ao presente.
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
        <section class="comentarios-clientes">
            <div class="container">
                <div class="comentarios-header">
                    <h2>Comentários de clientes</h2>
                    <p>Retornos reais de quem já escolheu a Zadoni para presentear em Canaã.</p>
                </div>
                <div class="comentarios-grid">
                    ${["comentario primeiro.jpeg", "comenta 01.jpeg", "comentario 02.jpeg", "comenta 03.jpeg", "comentario 03.jpeg"].map((img, index) => `<article class="comentario-card">
                        <div class="comentario-foto">
                            <img src="assets/img/comentarios instagram/${img}" alt="Comentário de cliente da Zadoni Presentes" width="720" height="1280" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
                        </div>
                        <h3>${["Atendimento com carinho", "Presente que emociona", "Entrega especial", "Pedido bem cuidado", "Cliente feliz"][index]}</h3>
                        <p>Prova social leve para quem quer confiar antes de chamar no WhatsApp.</p>
                    </article>`).join("\n                    ")}
                </div>
            </div>
        </section>
        ${faqHtml(faqs)}
    </main>`;

  return pageShell({
    path: "presentes-canaa.html",
    title: "Presentes em Canaã dos Carajás | Buquês e Cestas | Zadoni",
    description: "Compre presentes em Canaã dos Carajás com a Zadoni: buquês, cestas, kits românticos, perfumes e mimos com atendimento pelo WhatsApp.",
    canonical,
    image: "assets/optimized/products/buque-te-amo-romantico.jpg",
    body,
    schemas
  });
}

const pageConfigs = [
  {
    dir: "presentes-canaa-dos-carajas",
    title: "Presentes em Canaã dos Carajás | Zadoni Presentes",
    description: "Catálogo local da Zadoni Presentes em Canaã dos Carajás com buquês, cestas, kits, perfumes e mimos para pedir pelo WhatsApp.",
    h1: "Presentes em Canaã dos Carajás",
    h2: "Opções locais para presentear sem perder tempo",
    intro: "Veja sugestões de presentes com atendimento local, preços iniciais e conversa direta pelo WhatsApp para confirmar disponibilidade.",
    copy1: "Para quem precisa resolver uma surpresa em Canaã dos Carajás, a compra local reduz dúvidas sobre prazo, personalização e entrega.",
    copy2: "A Zadoni trabalha com opções prontas e personalizáveis, incluindo buquês, cestas, kits, perfumes de bolso e mimos de valor acessível.",
    productsTitle: "Produtos locais em destaque",
    filter: (items) => items.filter((item) => item.destaque),
    faqs: [
      { q: "Como peço um presente em Canaã?", a: "Escolha uma opção no catálogo e chame no WhatsApp para confirmar disponibilidade, valor final e entrega." },
      { q: "Os produtos são enviados para fora de Canaã?", a: "O foco do catálogo é o atendimento local em Canaã dos Carajás. Consulte pelo WhatsApp para casos específicos." }
    ]
  },
  {
    dir: "buques-canaa-dos-carajas",
    title: "Buquês em Canaã dos Carajás | Zadoni Presentes",
    description: "Buquês românticos, rosas e arranjos para presentear em Canaã dos Carajás com atendimento local pelo WhatsApp.",
    h1: "Buquês em Canaã dos Carajás",
    h2: "Buquês para surpreender com entrega local",
    intro: "Escolha buquês com flores, rosas e acabamento especial para aniversários, pedidos de desculpa, declarações e datas importantes.",
    copy1: "Ao pedir um buquê local, informe a ocasião, cor preferida e se deseja incluir cartão, foto impressa ou chocolate.",
    copy2: "Os valores são iniciais e podem mudar conforme flores disponíveis, tamanho do arranjo e complementos escolhidos.",
    productsTitle: "Buquês e flores disponíveis",
    filter: (items) => items.filter((item) => categoryKey(item) === "buques"),
    faqs: [
      { q: "Posso personalizar o buquê?", a: "Sim. A personalização depende das flores e complementos disponíveis no momento do pedido." },
      { q: "Buquês têm preço fixo?", a: "Os preços exibidos são iniciais. O valor final varia conforme tamanho, flores e adicionais." }
    ]
  },
  {
    dir: "cestas-de-presente-canaa",
    title: "Cestas de Presente em Canaã | Zadoni Presentes",
    description: "Cestas de presente em Canaã dos Carajás com chocolates, bebidas, cafés, itens masculinos e opções românticas.",
    h1: "Cestas de presente em Canaã",
    h2: "Cestas montadas para diferentes ocasiões",
    intro: "Veja cestas femininas, masculinas, românticas e de café da manhã para presentear em Canaã dos Carajás.",
    copy1: "As cestas podem combinar bebida, chocolates, caneca, petiscos, flores e itens de autocuidado conforme disponibilidade.",
    copy2: "Ao chamar no WhatsApp, informe se o presente é para aniversário, agradecimento, romance ou surpresa corporativa.",
    productsTitle: "Cestas locais para pedir pelo WhatsApp",
    priorityProductIds: [37],
    filter: (items) => items.filter((item) => categoryKey(item) === "cestas"),
    faqs: [
      { q: "A cesta pode ter itens diferentes?", a: "Pode. A montagem é confirmada pelo WhatsApp conforme estoque e orçamento." },
      { q: "Tem cesta para homens e mulheres?", a: "Sim. O catálogo inclui cestas masculinas, femininas, românticas e de café da manhã." }
    ]
  },
  {
    dir: "floricultura-canaa-dos-carajas",
    title: "Floricultura em Canaã dos Carajás | Buquês e Presentes | Zadoni",
    description: "Procura floricultura em Canaã dos Carajás? Conheça buquês, rosas, flores e presentes personalizados da Zadoni. Consulte modelos e disponibilidade pelo WhatsApp.",
    h1: "Flores, Buquês e Presentes em Canaã dos Carajás",
    h2: "Buquês e flores para momentos especiais",
    intro: "Quem procura uma floricultura em Canaã dos Carajás também pode encontrar na Zadoni opções de buquês, rosas, flores e presentes preparados para momentos especiais. Os modelos podem variar conforme a disponibilidade e a personalização desejada.",
    copy1: "A Zadoni é uma empresa de presentes em Canaã dos Carajás que oferece opções com buquês, rosas, flores, chocolates e detalhes personalizados conforme os modelos disponíveis.",
    copy2: "Para consultar modelos e disponibilidade, envie uma mensagem pelo WhatsApp informando a ocasião e o estilo de presente desejado. A composição deve ser confirmada durante o atendimento.",
    productsTitle: "Opções com rosas, flores e buquês",
    includeLocalBusiness: false,
    includeWebPage: true,
    includeItemListSchema: true,
    includeOfferAvailability: false,
    filter: (items) => items.filter((item) => {
      const text = slugify(item.nome + " " + item.descricao + " " + item.categoria);
      return !text.includes("perfume") && (text.includes("buque") || text.includes("rosa") || text.includes("flor") || text.includes("jarro"));
    }),
    faqs: [
      { q: "A Zadoni trabalha com flores e buquês em Canaã dos Carajás?", a: "A Zadoni oferece opções de buquês, rosas, flores e presentes conforme os modelos e a disponibilidade. A consulta pode ser feita diretamente pelo WhatsApp." },
      { q: "É possível personalizar o presente?", a: "Algumas opções podem receber complementos e detalhes personalizados. A disponibilidade deve ser confirmada durante o atendimento." },
      { q: "Como saber quais modelos estão disponíveis?", a: "Entre em contato pelo WhatsApp para consultar os modelos, valores e condições disponíveis para a data desejada." }
    ]
  },
  {
    dir: "cesta-cafe-da-manha-canaa",
    title: "Cesta de Café da Manhã em Canaã dos Carajás | Zadoni",
    description: "Cestas de café da manhã em Canaã dos Carajás para aniversários e momentos especiais. Consulte modelos, itens e personalização pelo WhatsApp.",
    image: "cesta-cafe-da-manha-canaa/cesta-cafe-da-manha-modelo-real-08.webp",
    h1: "Cesta de Café da Manhã em Canaã dos Carajás",
    h2: "Como funciona o pedido da cesta de café",
    intro: "Uma cesta de café da manhã é uma forma especial de começar uma comemoração. A Zadoni prepara opções em Canaã dos Carajás com itens selecionados e possibilidades de personalização conforme o modelo e a disponibilidade.",
    copy1: "Primeiro escolha uma referência visual na galeria. Depois a Zadoni confirma pelo WhatsApp quais itens estão disponíveis, quais ajustes cabem no orçamento e qual será o valor final.",
    copy2: "As fotos abaixo não são pacotes fechados: elas ajudam a comunicar estilo, tamanho e acabamento desejado para aniversários, surpresas românticas e momentos especiais.",
    productsTitle: "Base de orçamento para cesta de café",
    productsIntro: "Use esta opção como ponto de partida para o atendimento. O valor exibido é inicial; a composição final é montada a partir do modelo escolhido na galeria, dos itens disponíveis e da personalização desejada.",
    galleryTitle: "Escolha um modelo de inspiração",
    galleryIntro: "As imagens mostram composições reais já preparadas pela Zadoni. Escolha a referência mais próxima do que você deseja e consulte disponibilidade, itens e valor final pelo WhatsApp.",
    galleryItemNote: "Modelo para inspiração. O valor final varia conforme itens escolhidos e disponíveis.",
    galleryCtaLabel: "Consultar este modelo",
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
      { src: "cesta-cafe-da-manha-modelo-real-11.webp", alt: "Cesta de café da manhã romântica com frutas, chocolates e balão", caption: "Versão romântica para café da manhã", width: 720, height: 720 }
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
      { q: "É possível personalizar a cesta?", a: "A possibilidade de personalização depende do modelo e dos itens disponíveis. Os detalhes podem ser definidos durante o atendimento." },
      { q: "Como consultar preço e disponibilidade?", a: "Entre em contato pelo WhatsApp informando a data, a ocasião e o tipo de cesta desejada." }
    ]
  },
  {
    dir: "presentes-romanticos-canaa",
    title: "Presentes Românticos em Canaã | Zadoni Presentes",
    description: "Presentes românticos em Canaã dos Carajás: buquês, boxes, kits, cestas e mimos para declarar carinho.",
    h1: "Presentes românticos em Canaã",
    h2: "Surpresas para declarar carinho",
    intro: "Opções românticas para namoro, aniversário de relacionamento, pedido de desculpas ou uma surpresa fora de data.",
    copy1: "Presentes românticos funcionam melhor quando combinam mensagem, visual e um item que tenha a ver com a pessoa presenteada.",
    copy2: "A Zadoni ajuda a escolher entre buquês, boxes, cestas e mimos conforme prazo, orçamento e estilo da surpresa.",
    productsTitle: "Sugestões românticas da Zadoni",
    priorityProductIds: [37],
    filter: (items) => items.filter((item) => /romantic|romant|amor|te amo|rosa|vinho|box|kit/i.test(slugify(`${item.nome} ${item.descricao}`))),
    faqs: [
      { q: "Dá para montar presente romântico no mesmo dia?", a: "A disponibilidade depende do horário e dos itens escolhidos. O WhatsApp confirma as opções viáveis." },
      { q: "Posso incluir mensagem no presente?", a: "Sim. Consulte opções de cartão, foto ou detalhes personalizados no atendimento." }
    ]
  },
  {
    dir: "rosas-perfumadas-canaa",
    title: "Rosas e Perfumes em Canaã | Zadoni Presentes",
    description: "Rosas, buquês e perfumes de bolso em Canaã dos Carajás para presentes elegantes e fáceis de pedir pelo WhatsApp.",
    h1: "Rosas e perfumes em Canaã",
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
  fs.writeFileSync(fullPath, content, "utf8");
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
  { loc: `${SITE}/floricultura-canaa-dos-carajas/`, priority: "0.88" },
  { loc: `${SITE}/cesta-cafe-da-manha-canaa/`, priority: "0.88" },
  { loc: `${SITE}/monte-sua-cesta/`, priority: "0.9" },
  { loc: `${SITE}/presentes-romanticos-canaa/`, priority: "0.85" },
  { loc: `${SITE}/rosas-perfumadas-canaa/`, priority: "0.8" }
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
