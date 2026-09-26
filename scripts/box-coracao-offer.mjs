import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function applyBoxCoracaoOffer(source, page) {
  if (page !== 'cestas-de-presente-canaa/index.html' || source.includes('id="box-coracao-100"')) return source;
  const message = 'Olá! Quero este presente:\n\nProduto: Box Coração com Rosas e Ferrero Rocher\nCategoria: Box presente\nValor anunciado: R$ 100,00\nResumo: Box com rosas e Ferrero Rocher, com entrega incluída em Canaã dos Carajás.\nImagem do produto: https://zadonipresentes.com.br/assets/img/box-coracao-rosas-ferrero-100.jpg\n\nHá disponibilidade para entregar hoje? Meu bairro é: ';
  const whatsapp = `https://wa.me/5594992993138?text=${encodeURIComponent(message)}&amp;utm_source=site&amp;utm_medium=whatsapp&amp;utm_campaign=seo_local&amp;utm_content=box_coracao_100`;
  const card = `
                    <article class="produto-card box-coracao-offer" id="box-coracao-100">
                        <a class="produto-imagem produto-imagem-link" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="box_coracao_100" aria-label="Pedir Box Coração com Rosas e Ferrero Rocher por R$ 100 com entrega incluída">
                            <img src="../assets/img/box-coracao-rosas-ferrero-100.jpg" alt="Box vermelho com visor de coração, rosas e caixa de chocolates Ferrero Rocher" width="1254" height="1254" loading="lazy" decoding="async">
                            <span class="produto-categoria">Entrega incluída</span>
                        </a>
                        <div class="produto-content">
                            <p class="box-coracao-label">Um carinho por R$ 100</p>
                            <h3 class="produto-nome">Box Coração com Rosas e Ferrero Rocher</h3>
                            <p class="produto-descricao">Uma opção delicada para surpreender sem complicação.</p>
                            <p class="produto-preco">R$ 100,00</p>
                            <p class="box-coracao-delivery">Entrega incluída em Canaã dos Carajás.</p>
                            <p class="box-coracao-availability">Consulte disponibilidade e horário de entrega.</p>
                            <div class="produto-acoes"><a class="btn-whatsapp-produto" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="box_coracao_100">Quero este presente por R$ 100</a></div>
                        </div>
                    </article>`;
  if (!source.includes('<div class="produtos-grid">')) throw new Error('Missing basket product grid');
  return source.replace('<div class="produtos-grid">', '<div class="produtos-grid">' + card)
    .replace('</head>', '<link rel="stylesheet" href="../assets/css/box-coracao-offer.css?v=20260926">\n</head>');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const page = 'cestas-de-presente-canaa/index.html';
  const file = fileURLToPath(new URL('../' + page, import.meta.url));
  fs.writeFileSync(file, applyBoxCoracaoOffer(fs.readFileSync(file, 'utf8'), page));
}
