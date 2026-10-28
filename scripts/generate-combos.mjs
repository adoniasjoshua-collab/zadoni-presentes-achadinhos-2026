// Generates only the new landing page. Never regenerates existing categories.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { metaPixelHead, metaPixelBody } from './meta-pixel-snippet.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const folder = 'combos-pastel-canaa';
const data = JSON.parse(fs.readFileSync(path.join(root, folder, 'catalogo.json'), 'utf8'));
const site = 'https://zadonipresentes.com.br';
const url = `${site}/${folder}/`;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const money = n => (n / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const live = data.status === 'ready';
if (!['draft', 'ready'].includes(data.status)) throw new Error('Invalid release state');
if (live) {
  if (!data.delivery.areas.length || !data.socialImage || data.flavors.some(f => !f.image)) throw new Error('Before release: confirm delivery areas and real product/social images.');
  for (const asset of [data.socialImage, ...data.flavors.map(f => f.image)]) {
    if (!/^assets\/optimized\/combos\/[a-z0-9-]+\.(webp|jpg|png)$/.test(asset) || !fs.existsSync(path.join(root, asset))) throw new Error('Missing local combo image: ' + asset);
  }
}
const price = money(data.price);
const duploPrice = money(data.duplo.price);
const secondPrice = money(data.duplo.price - data.price);
const coca = data.extras.find(e => e.id === 'refrigerante-extra');
const lower = f => f.name.toLowerCase();
const title = 'Combos de Pastel em Canaã dos Carajás | Zadoni';
const description = `Pastelão por ${price} ou 2 por ${duploPrice} na Zadoni, em Canaã dos Carajás: carne com queijo, frango com queijo ou presunto com queijo. Coca lata gelada por ${money(coca.price)}. Retire sem taxa ou receba com entrega de ${money(data.delivery.price)}.`;
const social = `${site}/${data.socialImage || 'assets/img/brand/logo-zadoni-320.webp'}`;
const whatsapp = text => `https://wa.me/${data.phone}?text=${encodeURIComponent(text)}&utm_source=site&utm_medium=whatsapp&utm_campaign=seo_local&utm_content=combos_pastel`;
const contact = whatsapp('Olá, Zadoni! Tenho uma dúvida sobre os combos de pastel.');
const schemas = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'pt-BR', breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#combos` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Zadoni Presentes', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Combos de Pastel', item: url }
    ] },
    { '@type': 'ItemList', '@id': `${url}#combos`, itemListElement: data.flavors.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: `Combo pastelão de ${lower(f)}`, url: `${url}#${f.id}` })) }
  ]
};
function fulfillment() {
  return `<fieldset class="fulfillment"><legend>Como você quer receber?</legend><label><input type="radio" name="fulfillment" value="entrega" checked> Entrega <small>+ ${money(data.delivery.price)} por pedido</small></label><label><input type="radio" name="fulfillment" value="retirada"> Retirada <small>sem taxa</small></label></fieldset>`;
}
function stepper(id, name, value, min = 0, max = 99) {
  return `<div class="quantity"><button type="button" data-step="-1" aria-label="Diminuir quantidade de ${esc(name)}">−</button><input id="${id}" aria-label="Quantidade de ${esc(name)}" type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${value}"><button type="button" data-step="1" aria-label="Aumentar quantidade de ${esc(name)}">+</button></div>`;
}
const offers = [{ id: 'combo-individual', name: '1 Pastelão', price: data.price, pastels: 1 }, data.duplo];
const offerPhotos = {
  'combo-individual': { file: 'combo-individual-pastel-lata-20261009', alt: 'Pastelão frito em cesta com papel xadrez vermelho ao lado de uma lata de Coca-Cola vendida à parte' },
  'combo-duplo': { file: 'combo-duplo-pastel-lata-20261009', alt: 'Dois pastelões fritos em cesta com papel xadrez vermelho ao lado de uma lata de Coca-Cola vendida à parte' }
};
const offerPhoto = o => { const p = offerPhotos[o.id]; return p ? `<img class="combo-photo" src="../assets/optimized/combos/${p.file}.webp" srcset="../assets/optimized/combos/${p.file}-480.webp 480w, ../assets/optimized/combos/${p.file}.webp 960w" sizes="(max-width: 760px) calc(100vw - 32px), 500px" width="960" height="960" alt="${p.alt}" loading="lazy" decoding="async">
` : ''; };
const extraRow = e => `<div class="extra-row" data-extra="${e.id}"><div><label for="pedido-${e.id}">${esc(e.name)}</label><small>+ ${money(e.price)} / ${esc(e.unit)}</small><small class="extra-subtotal" data-extra-subtotal></small></div>${stepper(`pedido-${e.id}`, e.name, 0)}</div>`;
const flavorRow = f => `<div class="extra-row flavor-row" data-flavor-qty="${esc(f.id)}"><div><label for="qtd-${esc(f.id)}">${esc(f.name)}</label></div>${stepper(`qtd-${f.id}`, f.name, 0, 0, 40)}</div>`;
const cards = offers.map(o => `<article class="combo-card" id="${o.id}">
${offerPhoto(o)}<div class="card-content"><p class="eyebrow">${o.pastels === 2 ? `O 2º sai por só ${secondPrice}!` : 'Com muito queijo derretido'}</p><h2>${o.name}</h2><p class="price">${money(o.price)}</p><p class="includes">${o.pastels === 2 ? '2 pastelões, com os recheios que você quiser' : '1 pastelão, com o recheio que você quiser'}</p><p class="small">Coca lata gelada: + ${money(coca.price)}. Foto ilustrativa; a lata é vendida à parte.</p><p class="delivered">Com entrega: <strong>${money(o.price + data.delivery.price)}</strong></p><a class="button primary" href="#meu-pedido">Montar meu pedido</a></div></article>`).join('\n');
// Single order form: a quantity per filling; pairs get the duo price automatically.
const orderForm = `<form data-order-form hidden novalidate>
<fieldset class="flavor-qty"><legend>1. Quantos de cada recheio?</legend>${data.flavors.map(flavorRow).join('')}</fieldset>
<p class="step-title">2. Quer Coca lata gelada?</p>${extraRow(coca)}
<details class="extras-options"><summary>Adicionar outros itens</summary>
${data.extras.filter(e => e !== coca).map(extraRow).join('')}
<label class="personalization" hidden>Nome ou mensagem nas caixinhas (opcional)<textarea name="personalization" maxlength="180" rows="2"></textarea></label></details>
<label class="notes">Observações do pedido — opcional<textarea name="notes" maxlength="300" rows="3" placeholder="Ex.: observação sobre o preparo"></textarea></label>
<h3>3. Entrega ou retirada</h3>${fulfillment()}
<div class="order-total" data-order-total aria-live="polite" aria-atomic="true"></div>
<details class="message-preview" hidden><summary>Conferir mensagem que será enviada</summary><pre data-message-preview></pre></details>
<p class="form-error" role="status" data-form-error></p>
<a class="button whatsapp" data-send-order target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_pedido">Enviar pedido no WhatsApp</a><p class="small">A Zadoni confirma disponibilidade, entrega ou retirada. Confira recheios, observações e endereço antes de enviar.</p>
</form>
<a class="button whatsapp fallback-order" href="${esc(whatsapp(`Olá! Quero pedir pastelão. Vou informar quantos de cada recheio, se quero Coca lata (${money(coca.price)}) e se é entrega (${money(data.delivery.price)}) ou retirada.`))}" target="_blank" rel="noopener noreferrer">Pedir no WhatsApp</a>`;
schemas['@graph'][2].itemListElement = offers.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.name, url: `${url}#${o.id}` }));
const html = `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="noindex, follow"><meta name="theme-color" content="#7a2f55">
<link rel="canonical" href="${url}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../assets/img/brand/logo-zadoni-180.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Zadoni Presentes"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${social}"><meta property="og:image:alt" content="${data.socialImage ? 'Arte da Zadoni Lanches com pastel aberto de carne moída e a chamada Canaã, bateu a fome?' : 'Marca Zadoni Presentes'}">
<meta name="twitter:card" content="${data.socialImage ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${social}">
<link rel="stylesheet" href="../assets/css/combos.css?v=20261029-1">
<link rel="stylesheet" href="../assets/css/tema-cor-2026.css?v=20260930-1">
<script type="application/ld+json">${json(schemas)}</script>
${live ? `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config', 'AW-16938428518');</script>\n${metaPixelHead}` : '<!-- Preview: no advertising trackers are loaded. -->'}
<script id="combos-data" type="application/json">${json(data)}</script><script src="../assets/js/combos.js?v=20261029-1" defer></script>
${live ? '<script src="../assets/js/google-ads-whatsapp.js?v=20260727-google-ads" defer></script>' : ''}
</head><body>
${live ? metaPixelBody : '<div class="draft-banner">Prévia da nova página · fotos e disponibilidade em confirmação</div>'}
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="../index.html"><img src="../assets/img/brand/logo-zadoni-96.webp" width="40" height="40" alt="" loading="eager" decoding="async"><span>Zadoni Lanches</span></a><nav aria-label="Navegação principal"><a href="../presentes-canaa.html">Ver presentes</a><a href="#combos">Cardápio</a><a href="#meu-pedido">Montar pedido</a></nav></div></header>
<main id="conteudo"><section class="hero shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Início</a><span aria-hidden="true"> / </span><span aria-current="page">Combos de pastel</span></nav>
<div class="combo-cover-layout"><div class="combo-cover"><a class="combo-cover-image" href="#combos" aria-label="Ver o cardápio e escolher seu recheio"><img src="../assets/optimized/combos/capa-pastel-20260929-480.webp" srcset="../assets/optimized/combos/capa-pastel-20260929-480.webp 480w, ../assets/optimized/combos/capa-pastel-20260929-864.webp 864w" sizes="(max-width: 760px) 280px, 360px" width="864" height="1231" alt="Arte do pastelão da Zadoni Lanches com os três recheios: carne com queijo, presunto com queijo e frango com queijo" loading="eager" fetchpriority="high" decoding="async"></a><a class="button primary" href="#meu-pedido">Montar meu pedido</a></div><div class="combo-cover-copy"><h1>Pastelão com muito queijo derretido</h1><p class="hero-copy">1 pastelão por <strong>${price}</strong> ou 2 por <strong>${duploPrice}</strong> — o 2º sai por só ${secondPrice}! Coca lata gelada por ${money(coca.price)}.</p><p class="order-notice"><strong>Entrega: ${money(data.delivery.price)} por pedido</strong> em Canaã dos Carajás. Retirada sem taxa.</p><p class="small">Recheios: carne com queijo, frango com queijo ou presunto com queijo.</p></div></div></section>
<section class="shell" id="combos" aria-label="Cardápio do pastelão"><div class="combo-grid">${cards}</div></section>
<section class="shell section" id="meu-pedido" tabindex="-1" aria-labelledby="order-title"><h2 id="order-title">Monte seu pedido</h2><p class="order-notice">Escolha quantos pastelões quer de cada recheio. A cada 2 você paga <strong>${duploPrice}</strong>; se sobrar 1, ele sai por ${price}. O desconto entra sozinho.</p>${orderForm}</section>
<section class="shell section faq" aria-labelledby="faq-title"><h2 id="faq-title">Dúvidas rápidas</h2><details><summary>Quanto custa o pastelão?</summary><p>1 pastelão sai por ${price} e 2 pastelões por ${duploPrice} — o 2º sai por só ${secondPrice}. Em pedidos maiores, cada dupla sai por ${duploPrice} e o pastelão que sobrar, por ${price}: 3 pastelões, por exemplo, ficam ${money(data.duplo.price + data.price)}. Todos os recheios têm o mesmo preço e vêm com muito queijo derretido.</p></details><details><summary>Vem bebida junto?</summary><p>Não. A Coca lata gelada é vendida à parte por ${money(coca.price)}; é só escolher a quantidade ao montar o pedido.</p></details><details><summary>Posso pedir recheios diferentes?</summary><p>Sim. Em “Monte seu pedido”, escolha a quantidade de cada recheio, por exemplo 2 de carne e 1 de frango, tudo no mesmo pedido. A entrega é cobrada uma única vez.</p></details><details><summary>Como funciona a entrega ou a retirada?</summary><p>A entrega custa ${money(data.delivery.price)} por pedido em toda a zona urbana de Canaã dos Carajás. Na retirada não há taxa; o local e o horário são combinados pelo WhatsApp.</p></details><details><summary>Quais adicionais posso incluir?</summary><p>Maçã, pão de queijo, barrinha Cacau Show, caixas de Ferrero Rocher e caixinha personalizada (R$ 10, com nome ou mensagem). Os valores aparecem em “Adicionar outros itens”.</p></details></section>
<section class="shell section related"><h2>Para outras ocasiões</h2><p>Conheça também nossas <a href="../cestas-de-presente-canaa/">cestas de presente</a>, <a href="../buques-canaa-dos-carajas/">buquês</a> e <a href="../cesta-de-aniversario-canaa/">cestas de aniversário em Canaã dos Carajás</a>.</p></section></main>
<footer><div class="shell footer-grid"><div><a class="brand" href="../index.html">Zadoni Presentes</a><p>Presentes, flores, cestas e combos de pastel em Canaã dos Carajás · Pará.</p><p>Rua Asdrúbal Bentes, 453 - Centro · CEP 68350-067 · <a href="https://www.google.com/maps/search/?api=1&amp;query=Zadoni+Presentes+Rua+Asdr%C3%BAbal+Bentes+453+Cana%C3%A3+dos+Caraj%C3%A1s" target="_blank" rel="noopener noreferrer">Como chegar</a></p></div><div><h2>Outras opções da Zadoni</h2><ul><li><a href="../presentes-canaa.html">Presentes em Canaã</a></li><li><a href="../buques-canaa-dos-carajas/">Buquês</a></li><li><a href="../cestas-de-presente-canaa/">Cestas</a></li><li><a href="../floricultura-canaa-dos-carajas/">Flores e buquês</a></li><li><a href="../cesta-cafe-da-manha-canaa/">Cesta de café</a></li><li><a href="../cesta-de-aniversario-canaa/">Cesta de aniversário</a></li><li><a href="../buques-canaa-dos-carajas/#novos-buques-title">Buquês perfumados</a></li><li><a href="../presentes-romanticos-canaa/">Presentes românticos</a></li><li><a href="../monte-sua-cesta/">Monte sua cesta</a></li><li><a href="../revenda-chocolates-canaa/">Chocolates</a></li><li><a href="../perfumaria-cosmeticos-canaa/">Perfumaria</a></li><li><a href="../links/">Links oficiais</a></li></ul></div><div><h2>Contato</h2><p>WhatsApp: <a href="https://wa.me/5594992993138?text=Ol%C3%A1%2C%20Zadoni!%20Tenho%20uma%20d%C3%BAvida%20sobre%20os%20combos%20de%20pastel.&amp;utm_source=site&amp;utm_medium=whatsapp&amp;utm_campaign=seo_local&amp;utm_content=combos_pastel" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_rodape">(94) 99299-3138</a></p><p>Instagram: <a href="https://www.instagram.com/zadonipresentes/" target="_blank" rel="noopener noreferrer" data-track="instagram">@zadonipresentes</a></p><p>Google: <a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">ver avaliações da Zadoni</a></p></div></div></footer>
<a class="whatsapp-float" href="${esc(contact)}" target="_blank" rel="noopener noreferrer" aria-label="Tirar dúvidas com a Zadoni pelo WhatsApp" data-track="whatsapp" data-track-source="combos_botao_fixo"><span aria-hidden="true">💬</span></a>
<div class="order-bar" hidden><div class="shell"><a class="bar-total" href="#meu-pedido"><span data-bar-total></span><small data-bar-count></small></a><a class="button primary" href="#meu-pedido">Revisar e enviar</a></div></div><p class="sr-only" role="status" data-status></p>
</body></html>\n`;
fs.mkdirSync(path.join(root, folder), { recursive: true });
if (process.argv.includes('--check')) {
  if (fs.readFileSync(path.join(root, folder, 'index.html'), 'utf8') !== html) throw new Error('Page differs from source: run node scripts/generate-combos.mjs');
  console.log('Combos: generated HTML matches catalog and template.');
} else {
  fs.writeFileSync(path.join(root, folder, 'index.html'), html);
  console.log(`Combos page generated (${data.status}); sitemap and existing pages unchanged.`);
}
