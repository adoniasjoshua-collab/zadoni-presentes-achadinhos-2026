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
const juice = data.drinks.find(d => d.id === 'suco');
const lower = f => f.name.toLowerCase();
const title = 'Combos de Pastel em Canaã dos Carajás | Zadoni';
const description = `Combo pastelão com refrigerante em lata por ${price} na Zadoni, em Canaã dos Carajás: carne com queijo, frango com queijo ou presunto com queijo. Retire sem taxa ou receba com entrega de R$ 5.`;
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
const drinkOptions = data.drinks.map(d => `<option value="${esc(d.id)}"${d.id === 'refrigerante' ? ' selected' : ''}>${esc(d.name)}${d.price ? ' (+ ' + money(d.price) + ')' : ' (incluído)'}</option>`).join('');
const offers = [{ id: 'combo-individual', name: 'Combo Individual', price: data.price, pastels: 1 }, data.duplo];
const flavorChoices = (id, name, label) => `<fieldset class="flavor-choices"><legend>${label} <small>Escolha 1</small></legend>${data.flavors.map(f => `<label><input type="radio" name="${name}" value="${esc(f.id)}" required><span>${esc(f.name)}</span></label>`).join('')}</fieldset>`;
const cards = offers.map(o => `<article class="combo-card" id="${o.id}" data-flavor="${o.id}">
<div class="card-content"><p class="eyebrow">${o.pastels === 2 ? 'Mais um pastelão por R$ 10' : 'Seu lanche completo'}</p><h2>${o.name}</h2><p class="price">${money(o.price)}</p><p class="includes">${o.pastels} ${o.pastels === 2 ? 'pastelões' : 'pastelão'} + 1 refrigerante em lata</p><p class="delivered">Com entrega: <strong>${money(o.price + data.delivery.price)}</strong></p>
<form hidden data-configurator novalidate>
<details class="options"><summary>Escolher ${o.pastels === 2 ? 'Combo Duplo' : 'Combo Individual'}</summary>
<p class="step-title">1. Escolha ${o.pastels === 2 ? 'os recheios' : 'o recheio'}</p>
${flavorChoices(o.id, 'flavor1', o.pastels === 2 ? '1º pastelão' : 'Recheio do pastelão')}
${o.pastels === 2 ? flavorChoices(o.id, 'flavor2', '2º pastelão') + '<p class="small">Pode repetir ou combinar os recheios.</p>' : ''}
<div class="combo-count"><label for="count-${o.id}">Quantidade de combos</label>${stepper(`count-${o.id}`, o.name, 1, 1, 20)}</div>
<label class="notes">Observações do pedido — opcional<textarea name="notes" maxlength="300" rows="3" placeholder="Ex.: preferência de refrigerante ou observação sobre o preparo"></textarea></label><p class="small">Preferências sujeitas à disponibilidade.</p>
<details class="extras-options"><summary>Adicionar bebida ou outros itens</summary>
${o.pastels === 1 ? `<label for="${o.id}-bebida">Bebida</label><select id="${o.id}-bebida" name="drink">${drinkOptions}</select>` : '<p class="small">1 refrigerante em lata já incluído. Se quiser, acrescente outra lata abaixo.</p>'}
${data.extras.map(e => `<div class="extra-row" data-extra="${e.id}"><div><label for="${o.id}-${e.id}">${esc(e.name)}</label><small>+ ${money(e.price)} / ${esc(e.unit)}</small><small class="extra-subtotal" data-extra-subtotal></small></div>${stepper(`${o.id}-${e.id}`, e.name, 0)}</div>`).join('')}
<label class="personalization" hidden>Nome ou mensagem nas caixinhas (opcional)<textarea name="personalization" maxlength="180" rows="2"></textarea></label></details>
<p class="selection-total" data-card-total aria-live="polite"></p>
<button class="button primary" type="submit" data-add>Continuar pedido</button><button class="button secondary" type="button" data-cancel>Voltar aos combos</button></details>
<p class="form-error" role="status" data-form-error></p></form>
<a class="button whatsapp fallback-order" href="${esc(whatsapp(`Olá! Quero 1 ${o.name}: ${o.pastels} pastelão(ões) + 1 refri lata por ${money(o.price)}. Com entrega de R$ 5, total ${money(o.price + data.delivery.price)}. Vou informar os recheios e observações por aqui.`))}" target="_blank" rel="noopener noreferrer">Pedir no WhatsApp</a></div></article>`).join('\n');
schemas['@graph'][2].itemListElement = offers.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.name, url: `${url}#${o.id}` }));
const html = `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="${live ? 'index, follow' : 'noindex, follow'}"><meta name="theme-color" content="#7a2f55">
<link rel="canonical" href="${url}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../assets/img/brand/logo-zadoni-180.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Zadoni Presentes"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${social}"><meta property="og:image:alt" content="${data.socialImage ? 'Arte da Zadoni Lanches com pastel aberto de carne moída e a chamada Canaã, bateu a fome?' : 'Marca Zadoni Presentes'}">
<meta name="twitter:card" content="${data.socialImage ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${social}">
<link rel="stylesheet" href="../assets/css/combos.css?v=20261005-4">
<link rel="stylesheet" href="../assets/css/tema-cor-2026.css?v=20260930-1">
<script type="application/ld+json">${json(schemas)}</script>
${live ? `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config', 'AW-16938428518');</script>\n${metaPixelHead}` : '<!-- Preview: no advertising trackers are loaded. -->'}
<script id="combos-data" type="application/json">${json(data)}</script><script src="../assets/js/combos.js?v=20261005-4" defer></script>
${live ? '<script src="../assets/js/google-ads-whatsapp.js?v=20260727-google-ads" defer></script>' : ''}
</head><body>
${live ? metaPixelBody : '<div class="draft-banner">Prévia da nova página · fotos e disponibilidade em confirmação</div>'}
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="../index.html"><img src="../assets/img/brand/logo-zadoni-96.webp" width="40" height="40" alt="" loading="eager" decoding="async"><span>Zadoni Lanches</span></a><nav aria-label="Navegação principal"><a href="../presentes-canaa.html">Ver presentes</a><a href="#combos">Combos</a><a href="#meu-pedido" data-cart-nav hidden>Meu pedido</a></nav></div></header>
<main id="conteudo"><section class="hero shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Início</a><span aria-hidden="true"> / </span><span aria-current="page">Combos de pastel</span></nav>
<div class="combo-cover-layout"><div class="combo-cover"><a class="combo-cover-image" href="#combos" aria-label="Ver os combos e escolher seu recheio"><img src="../assets/optimized/combos/capa-pastel-20260929-480.webp" srcset="../assets/optimized/combos/capa-pastel-20260929-480.webp 480w, ../assets/optimized/combos/capa-pastel-20260929-864.webp 864w" sizes="(max-width: 760px) 280px, 360px" width="864" height="1231" alt="Pastelão com refrigerante e os três recheios: carne com queijo, presunto com queijo e frango com queijo" loading="eager" fetchpriority="high" decoding="async"></a><a class="button primary" href="#combos">Escolher meu combo</a></div><div class="combo-cover-copy"><h1>Seu pastelão com refri lata</h1><p class="hero-copy">Individual por <strong>${price}</strong> ou Duplo por <strong>${money(data.duplo.price)}</strong>. Escolha o combo e depois o recheio.</p><p class="order-notice"><strong>Entrega: R$ 5 por pedido.</strong> Individual entregue por R$ 25 ou Duplo por R$ 35. Retirada sem taxa.</p><p class="small">Escolha o combo, marque os recheios e envie seu pedido.</p></div></div></section>
<section class="shell" id="combos" aria-label="Escolha seu combo"><div class="combo-grid">${cards}</div></section>
<section class="shell section" id="meu-pedido" tabindex="-1" hidden aria-labelledby="order-title"><h2 id="order-title">Confira e envie seu pedido</h2><p data-pending-notice hidden class="order-notice">Conclua a escolha do combo ou toque em “Voltar aos combos” antes de enviar.</p><div data-order-items></div><a class="add-another" href="#combos">+ Adicionar outro combo</a><h3>Entrega ou retirada</h3>${fulfillment()}<div class="order-total" data-order-total aria-live="polite" aria-atomic="true"></div><details class="message-preview"><summary>Conferir mensagem que será enviada</summary><pre data-message-preview></pre></details><a class="button whatsapp" data-send-order target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_pedido">Enviar pedido no WhatsApp</a><p class="small">A Zadoni confirma disponibilidade, entrega ou retirada. Confira recheios, observações e endereço antes de enviar.</p></section>
<section class="shell section faq" aria-labelledby="faq-title"><h2 id="faq-title">Dúvidas rápidas</h2><details><summary>O que vem no combo?</summary><p>Um pastelão do recheio escolhido e um refrigerante em lata, com embalagem básica, por ${price}. Todos os recheios têm o mesmo preço.</p></details><details><summary>O que vem no Combo Duplo?</summary><p>2 pastelões com recheios à sua escolha + 1 refrigerante em lata por ${money(data.duplo.price)}. Com entrega, ${money(data.duplo.price + data.delivery.price)}.</p></details><details><summary>Posso trocar o refrigerante por suco?</summary><p>No Individual, por + ${money(juice.price)}. Abra “Adicionar bebida ou outros itens” e escolha suco. A marca do refrigerante ou o sabor do suco podem ser indicados no campo de observação.</p></details><details><summary>Posso pedir recheios diferentes?</summary><p>Sim. No Duplo, escolha o recheio de cada pastelão; pode repetir ou combinar. Após escolher o primeiro combo, toque em “Adicionar outro combo” no resumo. A entrega é cobrada uma única vez.</p></details><details><summary>Como funciona a entrega ou a retirada?</summary><p>A entrega custa ${money(data.delivery.price)} por pedido em toda a zona urbana de Canaã dos Carajás. Na retirada não há taxa; o local e o horário são combinados pelo WhatsApp.</p></details><details><summary>Quais adicionais posso incluir?</summary><p>Refrigerante extra, maçã, pão de queijo, barrinha Cacau Show, caixas de Ferrero Rocher e caixinha personalizada (R$ 10, com nome ou mensagem). Os valores aparecem em “Adicionar bebida ou outros itens”.</p></details></section>
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
