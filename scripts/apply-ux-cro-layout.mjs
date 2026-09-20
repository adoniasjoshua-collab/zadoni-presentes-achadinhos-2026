// Idempotent presentation transform, shared by local HTML and the SEO generator.
// Moves original strings intact: no serialization of metadata, links or copy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function addNaturalBouquetHighlight(source, page) {
  if (!['buques-canaa-dos-carajas/index.html', 'floricultura-canaa-dos-carajas/index.html'].includes(page)) return source;
  const models = [
    { file: 'Buquê de Rosas Naturais em Canaã dos Carajás.jpeg', label: 'Embalagem rosa', alt: 'Buquê de rosas naturais vermelhas com flores lilás, folhagens e embalagem rosa', size: 1440, note: ' A entrega rápida mencionada na foto depende de confirmação.' },
    { file: 'WhatsApp Image 2026-09-14 at 10.46.58 (1).jpeg', label: 'Embalagem preta', alt: 'Buquê de rosas naturais vermelhas com folhagens, embalagem preta e laço, ao lado de um cartão romântico', size: 1080, note: '' },
    { file: 'buque natural.jpeg', label: 'Embalagem vermelha', alt: 'Buquê de rosas naturais vermelhas com flores brancas, folhagens, embalagem vermelha e laço preto e dourado', size: 1254, note: ' A entrega rápida mencionada na foto depende de confirmação.' }
  ];
  const cards = models.map((model, index) => {
    const image = '../assets/img/Buque%20natural/' + encodeURIComponent(model.file);
    const message = `Olá! Quero encomendar este buquê:\n\nProduto: Buquê de Rosas Naturais — ${model.label}\nCategoria: Flores naturais por encomenda\nValor anunciado: sob consulta\nResumo: ${model.alt}.\nImagem do produto: https://zadonipresentes.com.br/${image.slice(3)}\n\nPode confirmar o valor, a disponibilidade e a antecedência necessária para entrega em Canaã dos Carajás?`;
    const whatsapp = `https://wa.me/5594992993138?text=${encodeURIComponent(message)}&amp;utm_source=site&amp;utm_medium=whatsapp&amp;utm_campaign=seo_local&amp;utm_content=destaque_rosas_naturais_${index + 1}`;
    return `<article class="produto-card">
        <a class="produto-imagem produto-imagem-link" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" aria-label="Encomendar Buquê de Rosas Naturais — ${model.label}">
          <img src="${image}" alt="${model.alt}" width="${model.size}" height="${model.size}" loading="eager" fetchpriority="${index === 0 ? 'high' : 'auto'}" decoding="async">
          <span class="produto-categoria">Por encomenda</span>
        </a>
        <div class="produto-content">
          <h3 class="produto-nome">Buquê de Rosas Naturais — ${model.label}</h3>
          <p class="produto-descricao">Rosas naturais para surpreender em uma ocasião especial. Encomende com antecedência.</p>
          <p class="produto-preco">Valor sob consulta</p>
          <p>Disponibilidade das flores e data de entrega a confirmar pelo WhatsApp.${model.note}</p>
          <div class="produto-acoes"><a class="btn-whatsapp-produto" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="destaque-rosas-naturais">Encomendar pelo WhatsApp</a></div>
        </div>
      </article>`;
  }).join('\n');
  if (page === 'floricultura-canaa-dos-carajas/index.html') {
    const highlights = '<!-- natural-bouquet-options:start -->\n<div class="natural-bouquet-highlights">' + cards
      .replaceAll('loading="eager"', 'loading="lazy"')
      .replaceAll('fetchpriority="high"', 'fetchpriority="auto"') + '</div>\n<!-- natural-bouquet-options:end -->\n';
    source = source.replace(/<!-- natural-bouquet-options:start -->[\s\S]*?<!-- natural-bouquet-options:end -->\s*/, '');
    return source.replace(/(<section\b[^>]*id="rosas-naturais"[\s\S]*?)(<div class="produtos-grid">)/, (_, intro, grid) => intro + highlights + grid)
      .replace(/ux-cro\.css\?v=[^"\s]+/g, 'ux-cro.css?v=20260920-natural-options-first');
  }
  const highlight = `<section class="seo-products" id="destaque-rosas-naturais" aria-labelledby="destaque-rosas-title">
    <div class="container">
      <h2 id="destaque-rosas-title">Destaques: Buquês de Rosas Naturais por encomenda</h2>
      <div class="natural-bouquet-highlights">${cards}</div>
    </div>
  </section>`;
  if (source.includes('id="destaque-rosas-naturais"')) {
    return source.replace(/<section\b[^>]*id="destaque-rosas-naturais"[\s\S]*?<\/section>/, () => highlight);
  }
  return source.replace(/(<section class="seo-hero">[\s\S]*?<\/section>)/, (_, hero) => `${hero}\n${highlight}`);
}

export function refineLayout(source, page) {
  if (page === 'buques-canaa-dos-carajas/index.html') {
    source = source.replace(/<article\b[^>]*id="produto-61"[\s\S]*?<\/article>/, card => card
      .replace(/<source type="image\/webp"[^>]*>/, '<source type="image/webp" srcset="../assets/optimized/products/responsive/buque-marsala-completo-v2-480.webp 480w, ../assets/optimized/products/responsive/buque-marsala-completo-v2-720.webp 720w, ../assets/optimized/products/responsive/buque-marsala-completo-v2-900.webp 900w" sizes="(max-width: 767px) 92vw, (max-width: 1023px) 45vw, 760px">')
      .replace(/<img[^>]*>/, '<img src="../assets/optimized/products/responsive/buque-marsala-completo-v2-720.webp" alt="Buquê artificial completo de rosas vermelhas e peônias amarelas, com embalagem marsala e laço vermelho" width="720" height="1280" loading="lazy" decoding="async" fetchpriority="low">'));
    source = source.replace(/ux-cro\.css\?v=[^"\s]+/g, 'ux-cro.css?v=20260920-bouquet-full-photo');
  }
  source = addNaturalBouquetHighlight(source, page);
  if (source.includes('data-ux-cro="20260919"')) return source;
  if (page === 'index.html') {
    const primary = ['buques-canaa-dos-carajas/', 'cestas-de-presente-canaa/', 'presentes-romanticos-canaa/', 'cesta-cafe-da-manha-canaa/'];
    source = source.replace(/(<section class="home-categories">[\s\S]*?<div class="grid grid-3">)([\s\S]*?)(<\/div>)/, (_, start, body, end) => {
      const cards = body.match(/<a class="category-card"[\s\S]*?<\/a>/g) || [];
      if (cards.length !== 12) throw new Error('Unexpected Home categories');
      const main = primary.map(href => cards.find(card => card.includes(`href="${href}"`)));
      return start + main.join('\n') + end + '<details class="ux-more-categories"><summary>Ver mais opções</summary><div class="grid grid-3">' + cards.filter(card => !main.includes(card)).join('\n') + '</div></details>';
    });
    const national = source.match(/<a href="achadinhos\/" class="home-path home-path--national"[\s\S]*?<\/a>/)?.[0];
    if (national) {
      source = source.replace(national, '');
      source = source.replace(/(<section class="entregas-reais"[\s\S]*?<\/section>)/, '$1\n<div class="container ux-national">' + national + '</div>');
    }
  } else {
    const sections = [...source.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)];
    const hero = sections.find(s => s[0].includes('class="seo-hero"'));
    const products = sections.find(s => /class="seo-products/.test(s[0]));
    const gallery = sections.find(s => /class="seo-gallery"/.test(s[0]));
    if (hero) {
      const first = page.includes('cesta-de-aniversario') || page.includes('cesta-cafe-da-manha') ? gallery : products;
      if (first) {
        source = source.replace(first[0], '');
        source = source.replace(hero[0], hero[0] + '\n' + first[0]);
      }
    }
    if (page.includes('cesta-cafe-da-manha')) {
      source = source.replace(/<div class="seo-gallery-budget">([\s\S]*?<small class="seo-gallery-budget-help">[\s\S]*?<\/small>)\s*<\/div>/g,
        '<details class="seo-gallery-budget ux-model-choice"><summary>Escolher este modelo</summary>$1</details>');
    }
    if (page === 'presentes-canaa.html') {
      source = source.replace(/(<div class="produtos-grid" id="produtos-container"[^>]*>)([\s\S]*?)(\s*<\/div>\s*<div[^>]*id="sem-produtos")/, (whole, start, body, end) => {
        const cards = body.match(/<article\b[\s\S]*?<\/article>/g) || [];
        if (cards.length !== 53) throw new Error('Unexpected catalog card count');
        const extra = card => card.includes('data-category="adicionais"');
        return start + '<h3 class="ux-group-title" data-ux-group="gifts">Presentes completos</h3>' + cards.filter(c => !extra(c)).join('\n') + '<h3 class="ux-group-title" data-ux-group="extras">Adicionais e itens avulsos</h3>' + cards.filter(extra).join('\n') + end;
      });
    }
  }
  const prefix = page.includes('/') ? '../' : '';
  return source.replace('<body>', '<body data-ux-cro="20260919">')
    .replace(/assets\/js\/app\.js\?v=[^"\s]+/g, 'assets/js/app.js?v=20260920-buques-entrega-rapida-1')
    .replace('</head>', `<link rel="stylesheet" href="${prefix}assets/css/ux-cro.css?v=20260920-natural-bouquet-trio">\n</head>`)
    .replace('</body>', `<script src="${prefix}assets/js/ux-cro.js?v=20260920-whatsapp-flow" defer></script>\n</body>`)
    .replace(/[ \t]+\r?\n/g, '\n');
}

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = ['index.html', 'presentes-canaa.html', ...['floricultura-canaa-dos-carajas', 'cestas-de-presente-canaa', 'cesta-de-aniversario-canaa', 'cesta-cafe-da-manha-canaa', 'buques-canaa-dos-carajas', 'presentes-canaa-dos-carajas', 'presentes-romanticos-canaa', 'rosas-perfumadas-canaa'].map(p => p + '/index.html')];
  for (const page of pages) {
    const file = path.join(root, page);
    fs.writeFileSync(file, refineLayout(fs.readFileSync(file, 'utf8'), page));
  }
}
