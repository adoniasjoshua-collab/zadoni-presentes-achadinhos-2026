import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const product = (name, alt) => ({
  src: `assets/optimized/products/responsive/${name}-720.webp`,
  small: `assets/optimized/products/responsive/${name}-480.webp`,
  width: 720, height: 900, alt
});
const gallery = (name, alt) => ({
  src: `assets/img/${name}.webp`, small: `assets/img/${name}-480.webp`,
  width: 720, height: 900, alt
});
export const categoryHeroes = {
  'floricultura-canaa-dos-carajas/index.html': {
    src: 'assets/img/flores-buques-destaque-zadoni.jpg', width: 1080, height: 1080,
    alt: 'Buquê de rosas com embalagem vermelha, cartão personalizado e fachada da Zadoni Presentes'
  },
  'buques-canaa-dos-carajas/index.html': product('buque-rosas-rubi-perfumadas', 'Buquê de rosas artificiais vermelhas com embalagem rosa e dourada e laço vermelho'),
  'cestas-de-presente-canaa/index.html': { ...product('cesta-carinho-pelucia-chocolates', 'Cesta de presente com ursinho, chocolates e laço decorado'), height: 720 },
  'cesta-cafe-da-manha-canaa/index.html': {
    src: 'cesta-cafe-da-manha-canaa/cesta-cafe-da-manha-modelo-real-10.webp', width: 720, height: 960,
    alt: 'Cesta de café da manhã da Zadoni com frutas, caneca, pães e suco'
  },
  'cesta-de-aniversario-canaa/index.html': gallery('galerias/cestas-aniversario/box-aniversario-bolo-balao-azul', 'Presente de aniversário com mini bolo, chocolates e balão de parabéns'),
  'presentes-romanticos-canaa/index.html': gallery('galerias/romanticos/arranjo-romantico-balao-rosas', 'Arranjo de rosas cor-de-rosa com laço e balão Te Amo'),
  'rosas-perfumadas-canaa/index.html': product('buque-rosas-cherry-perfumado', 'Buquê de rosas Cherry perfumadas com acabamento para presente'),
  'perfumaria-cosmeticos-canaa/index.html': product('perfume-fortune-amakha-15ml', 'Perfume de bolso Fortune da Amakha Paris com frasco e embalagem'),
  'revenda-chocolates-canaa/index.html': {
    src: 'assets/img/revenda-chocolates-canaa/chocolates-cacau-show-variados-720.webp',
    small: 'assets/img/revenda-chocolates-canaa/chocolates-cacau-show-variados-480.webp',
    width: 720, height: 960, alt: 'Seleção de chocolates Cacau Show de diferentes sabores'
  },
  'presentes-canaa-dos-carajas/index.html': gallery('prova-social/entregas-canaa/entrega-buque-cliente-01', 'Registro de entrega da Zadoni com clientes e buquê recebido')
};
const esc = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

// Add presentation only; keep original headings, copy, links and metadata intact.
export function applyCategoryHero(source, page) {
  const image = categoryHeroes[page];
  if (!image || source.includes('class="category-hero-layout"')) return source;
  const figure = `<figure class="category-hero-image"><img src="../${image.src}"${image.small ? ` srcset="../${image.small} 480w, ../${image.src} 720w" sizes="(max-width: 767px) 320px, (max-width: 1023px) 45vw, 480px"` : ''} alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="eager" fetchpriority="high" decoding="async"></figure>`;
  let found = false;
  source = source.replace(/(<section class="(?:seo-hero|pf-hero)">\s*<div class="(?:container|pf-wrap)">)([\s\S]*?)(<\/div>\s*<\/section>)/, (_, start, body, end) => {
    found = true;
    body = body.replace(/\s*<figure class="flores-buques-destaque"[\s\S]*?<\/figure>/, '');
    return `${start}<div class="category-hero-layout"><div class="category-hero-copy">${body}</div>${figure}</div>${end}`;
  });
  if (!found) throw new Error(`Missing hero: ${page}`);
  return source.replace('</head>', '<link rel="stylesheet" href="../assets/css/category-heroes.css?v=20260926-mobile">\n</head>');
}

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const page of Object.keys(categoryHeroes)) {
    const file = path.join(root, page);
    const before = fs.readFileSync(file, 'utf8');
    const backup = path.join(root, '.tmp/heroes-before', page);
    if (!fs.existsSync(backup)) {
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.writeFileSync(backup, before);
    }
    const after = applyCategoryHero(before, page);
    if (after !== before) fs.writeFileSync(file, after);
  }
}
