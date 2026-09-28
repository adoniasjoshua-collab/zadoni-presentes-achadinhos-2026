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
  if (!data.delivery.areas.length || !data.socialImage || data.combos.some(c => !c.image)) throw new Error('Before release: confirm delivery areas and real product/social images.');
  for (const asset of [data.socialImage, ...data.combos.map(c => c.image)]) {
    if (!/^assets\/optimized\/combos\/[a-z0-9-]+\.(webp|jpg|png)$/.test(asset) || !fs.existsSync(path.join(root, asset))) throw new Error('Missing local combo image: ' + asset);
  }
}
const title = 'Combos de Pastel em Canaã dos Carajás | Zadoni';
const description = 'Combos de pastel com refrigerante em lata na Zadoni, em Canaã dos Carajás: 1 pastel por R$ 20, 2 por R$ 30 e 3 por R$ 47. Suco opcional. Retire sem taxa ou receba com entrega de R$ 5.';
const social = `${site}/${data.socialImage || 'assets/img/brand/logo-zadoni-320.webp'}`;
const whatsapp = text => `https://wa.me/${data.phone}?text=${encodeURIComponent(text)}&utm_source=site&utm_medium=whatsapp&utm_campaign=seo_local&utm_content=combos_pastel`;
const contact = whatsapp('Olá, Zadoni! Quero consultar os combos de pastel em Canaã dos Carajás.');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const composition = c => `${plural(c.pastels, 'pastel', 'pastéis')} + ${plural(c.pastels, 'bebida', 'bebidas')}`;
const schemas = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'pt-BR', breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#combos` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Zadoni Presentes', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Combos de Pastel', item: url }
    ] },
    { '@type': 'ItemList', '@id': `${url}#combos`, itemListElement: data.combos.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name}: ${composition(c)}`, url: `${url}#${c.id}` })) }
  ]
};
function fulfillment(key) {
  return `<fieldset class="fulfillment"><legend>Como você quer receber?</legend><label><input type="radio" name="fulfillment" value="entrega" checked> Entrega <small>+ ${money(data.delivery.price)} por pedido</small></label><label><input type="radio" name="fulfillment" value="retirada"> Retirada <small>sem taxa</small></label></fieldset>`;
}
function stepper(id, name, value, min = 0, max = 99) {
  return `<div class="quantity"><button type="button" data-step="-1" aria-label="Diminuir quantidade de ${esc(name)}">−</button><input id="${id}" aria-label="Quantidade de ${esc(name)}" type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${value}"><button type="button" data-step="1" aria-label="Aumentar quantidade de ${esc(name)}">+</button></div>`;
}
const drinkOptions = `<option value="">Escolha a bebida</option>${data.drinks.map(d => `<option value="${esc(d.id)}">${esc(d.name)}${d.price ? ' (+ ' + money(d.price) + ')' : ' (incluído)'}</option>`).join('')}`;
const juice = data.drinks.find(d => d.id === 'suco');
const flavorOptions = `<option value="">Escolha o sabor</option>${data.flavors.map(f => `<option value="${esc(f.id)}">${esc(f.name)}</option>`).join('')}`;
const cards = data.combos.map((c, i) => `<article class="combo-card" id="${c.id}" data-combo="${c.id}">
${c.image ? `<img class="combo-photo" src="../${esc(c.image)}" width="800" height="800" alt="${esc(c.imageAlt || c.name)}" loading="${i ? 'lazy' : 'eager'}" ${i ? '' : 'fetchpriority="high"'} decoding="async">` : `<div class="photo-pending"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p>Foto do combo em preparação</p></div>`}
<div class="card-content"><p class="eyebrow">Pastel + refrigerante em lata</p><h2>${esc(c.name)}: ${composition(c)}</h2><p>${c.pastels === 1 ? 'Um pastel do sabor que você escolher, com um refrigerante em lata' : `${c.pastels} pastéis, cada um do sabor que você escolher e com um refrigerante em lata`}. Troque por suco por + ${money(juice.price)} cada. Embalagem básica incluída.</p><p class="price">${money(c.price)} <small>por combo</small></p><p class="small">Retirada sem taxa ou + ${money(data.delivery.price)} de entrega por pedido na zona urbana.</p>
<form hidden data-configurator novalidate><p class="step-title">1. Escolha sabor e bebida</p>
${Array.from({ length: c.pastels }, (_, n) => `<fieldset class="pastel-choice" data-pastel="${n}"><legend>${c.pastels > 1 ? `Pastel ${n + 1}` : 'Seu pastel'}</legend><label for="${c.id}-sabor-${n}">Sabor</label><select id="${c.id}-sabor-${n}" name="flavor-${n}" required>${flavorOptions}</select><label for="${c.id}-bebida-${n}">Bebida</label><select id="${c.id}-bebida-${n}" name="drink-${n}" required>${drinkOptions}</select></fieldset>`).join('')}
<label class="notes">Marca do refrigerante ou sabor do suco (opcional)<input name="notes" maxlength="120" placeholder="Ex.: guaraná, suco de laranja"></label>
<details class="extras"><summary><span>2. Adicionar bebidas, chocolates e extras</span><small data-extras-label>Opcional · escolha as quantidades</small></summary><p class="small">Quantidades abaixo para cada combo. Refrigerante extra: ${money(data.extras.find(e => e.id === 'refrigerante-extra').price)} por lata. Ferrero Rocher é vendido por caixa.</p>
${data.extras.map(e => `<div class="extra-row" data-extra="${e.id}"><div><label for="${c.id}-${e.id}">${esc(e.name)}</label><small>+ ${money(e.price)} / ${esc(e.unit)}</small><small class="extra-subtotal" data-extra-subtotal></small></div>${stepper(`${c.id}-${e.id}`, e.name, 0)}</div>`).join('')}
<label class="personalization" hidden>Nome ou mensagem nas caixinhas (opcional)<textarea name="personalization" maxlength="180" rows="2" placeholder="Se pedir várias caixinhas, indique a mensagem de cada uma"></textarea></label></details>
<div class="combo-count"><label for="count-${c.id}">Quantidade de combos iguais</label>${stepper(`count-${c.id}`, c.name, 1, 1, 20)}</div><p class="small">Sabores, bebidas e adicionais se repetem em cada combo igual.</p>
${fulfillment(c.id)}
<div class="card-total" aria-live="polite" aria-atomic="true" data-card-total></div><p class="form-error" role="status" data-form-error></p>
<a class="button whatsapp direct-order" href="${esc(whatsapp(`Olá! Quero o ${c.name} (${composition(c)}) por ${money(c.price)}, para retirada sem taxa ou entrega de R$ 5 na zona urbana. Pode confirmar sabores e bebidas?`))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combo_${c.id}">Pedir este combo no WhatsApp</a>
<button class="button secondary" type="submit" data-add>Adicionar ao meu pedido</button></form>
<a class="button whatsapp fallback-order" href="${esc(whatsapp(`Olá! Quero o ${c.name} (${composition(c)}): ${money(c.price)} para retirada ou ${money(c.price + data.delivery.price)} com entrega de R$ 5 na zona urbana. Pode confirmar sabores, bebidas e como receber?`))}" target="_blank" rel="noopener noreferrer">Consultar este combo no WhatsApp</a></div></article>`).join('\n');
const html = `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="${live ? 'index, follow' : 'noindex, follow'}"><meta name="theme-color" content="#7a2f55">
<link rel="canonical" href="${url}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../assets/img/brand/logo-zadoni-180.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Zadoni Presentes"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${social}"><meta property="og:image:alt" content="${data.socialImage ? 'Combos de pastel Zadoni' : 'Marca Zadoni Presentes'}">
<meta name="twitter:card" content="${data.socialImage ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${social}">
<link rel="stylesheet" href="../assets/css/combos.css?v=20260928-2">
<script type="application/ld+json">${json(schemas)}</script>
${live ? `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config', 'AW-16938428518');</script>\n${metaPixelHead}` : '<!-- Preview: no advertising trackers are loaded. -->'}
<script id="combos-data" type="application/json">${json(data)}</script><script src="../assets/js/combos.js?v=20260928-2" defer></script>
${live ? '<script src="../assets/js/google-ads-whatsapp.js?v=20260727-google-ads" defer></script>' : ''}
</head><body>
${live ? metaPixelBody : '<div class="draft-banner">Prévia da nova página · fotos e disponibilidade em confirmação</div>'}
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="../index.html"><img src="../assets/img/brand/logo-zadoni-96.webp" width="40" height="40" alt="" loading="eager" decoding="async"><span>Zadoni Presentes</span></a><nav aria-label="Navegação principal"><a href="../presentes-canaa.html">Ver presentes</a><a href="#combos">Combos</a><a href="#meu-pedido" data-cart-nav hidden>Meu pedido</a></nav></div></header>
<main id="conteudo"><section class="hero shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Início</a><span aria-hidden="true"> / </span><span aria-current="page">Combos de pastel</span></nav>
<p class="eyebrow">Um lanche, um carinho · Canaã dos Carajás, PA</p><h1>Combos de Pastel<br><em>e Mini Kits</em></h1><p class="hero-copy">Pastel feito na hora com refrigerante em lata: <strong>1 pastel por R$ 20</strong>, <strong>2 por R$ 30</strong> ou <strong>3 por R$ 47</strong>. Prefere suco? É só trocar por + ${money(juice.price)} cada. Escolha o sabor de cada pastel e, se quiser, acrescente chocolates, maçã, pão de queijo ou uma caixinha personalizada para presentear.</p>
<div class="benefits"><span>Carne, frango ou queijo e presunto</span><span>Adicionais opcionais</span><span>Retirada sem taxa ou entrega de R$ 5*</span></div><p class="small">*Entrega por pedido, em toda a zona urbana de Canaã dos Carajás.</p><a class="button primary" href="#combos">Escolher meu combo <span aria-hidden="true">↓</span></a></section>
<section class="shell" id="combos" aria-label="Escolha seu combo de pastel"><div class="combo-grid">${cards}</div></section>
<section class="shell section" id="mini-kits"><div class="gift-panel"><div><p class="eyebrow">Dê um toque de presente</p><h2>Seu combo, com um carinho a mais</h2><p>Abra os adicionais do seu combo e escolha chocolates e uma caixinha personalizada por R$ 10. A quantidade e o preço de cada item aparecem antes de você enviar o pedido.</p></div><a class="button secondary" href="#combos">Personalizar um combo</a></div></section>
<section class="shell section" id="meu-pedido" tabindex="-1" hidden aria-labelledby="order-title"><p class="eyebrow">Tudo junto em um só pedido</p><h2 id="order-title">Meu pedido</h2><p>Confira os sabores, bebidas e adicionais. Você pode editar cada combo antes de enviar.</p><div data-order-items></div>${fulfillment('pedido')}<div class="order-total" data-order-total aria-live="polite" aria-atomic="true"></div><details class="message-preview"><summary>Conferir mensagem que será enviada</summary><pre data-message-preview></pre></details><a class="button whatsapp" data-send-order target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_pedido">Enviar pedido completo no WhatsApp</a><p class="small">O envio inicia o atendimento. Disponibilidade, entrega ou retirada são confirmadas pela Zadoni. Seu pedido fica apenas nesta página; ao recarregar, ele é limpo.</p></section>
<section class="shell section delivery" id="entrega"><h2>Retirada ou entrega dos combos em Canaã dos Carajás</h2><p><strong>Retirada sem taxa:</strong> o local e o horário são combinados pelo WhatsApp.</p><p><strong>Entrega em toda a zona urbana de Canaã dos Carajás</strong> por <strong>R$ 5 por pedido, para um único endereço</strong>. Dois ou mais combos no mesmo pedido pagam uma única entrega. A condição não se aplica automaticamente a cestas e buquês do outro catálogo.</p><p>O horário e a disponibilidade são combinados no atendimento.</p><a href="${esc(contact)}" target="_blank" rel="noopener noreferrer">Tirar dúvidas no WhatsApp</a></section>
<section class="shell section faq" aria-labelledby="faq-title"><h2 id="faq-title">Antes de fazer seu pedido</h2><details><summary>O que vem em cada combo?</summary><p>Combo 1: 1 pastel e 1 bebida por R$ 20. Combo 2: 2 pastéis e 2 bebidas por R$ 30. Combo 3: 3 pastéis e 3 bebidas por R$ 47. A bebida incluída é refrigerante em lata; se preferir suco, cada troca custa + ${money(juice.price)}. A embalagem básica está incluída. Adicionais e entrega são cobrados à parte e aparecem no resumo.</p></details><details><summary>Posso retirar o pedido?</summary><p>Sim. Escolha “Retirada” no pedido e não há taxa. O local e o horário de retirada são combinados pelo WhatsApp. Se preferir receber em casa, a entrega custa ${money(data.delivery.price)} por pedido em toda a zona urbana.</p></details><details><summary>Posso escolher a marca do refrigerante ou o sabor do suco?</summary><p>Sim. Escolha refrigerante em lata (incluído) ou suco (+ ${money(juice.price)}) para cada pastel e escreva sua preferência no campo de observação. A disponibilidade das marcas e sabores é confirmada no WhatsApp.</p></details><details><summary>Posso misturar sabores no mesmo combo?</summary><p>Sim. Nos combos 2 e 3 você escolhe o sabor e a bebida de cada pastel separadamente.</p></details><details><summary>Posso pedir mais de uma unidade dos adicionais?</summary><p>Sim. Use os botões de quantidade para maçãs, pães de queijo, barrinhas, caixinhas e caixas de Ferrero Rocher. Cada caixa de Ferrero contém a quantidade de bombons indicada.</p></details><details><summary>Como funciona a caixinha personalizada?</summary><p>Ela custa R$ 10 por caixinha. Você pode indicar nome ou mensagem ao selecionar o adicional. O acabamento é combinado com a Zadoni pelo WhatsApp.</p></details></section>
<section class="shell section related"><h2>Para outras ocasiões</h2><p>Conheça também nossas <a href="../cestas-de-presente-canaa/">cestas de presente</a>, <a href="../buques-canaa-dos-carajas/">buquês</a> e <a href="../cesta-de-aniversario-canaa/">cestas de aniversário em Canaã dos Carajás</a>.</p></section></main>
<footer class="shell"><a class="brand" href="../index.html">Zadoni Presentes</a><p>Canaã dos Carajás · Pará</p><a href="../presentes-canaa.html">Voltar ao catálogo de presentes</a></footer>
<div class="order-bar" hidden><div class="shell"><span data-bar-total></span><a class="button primary" href="#meu-pedido">Revisar pedido</a></div></div><p class="sr-only" role="status" data-status></p>
</body></html>\n`;
fs.mkdirSync(path.join(root, folder), { recursive: true });
if (process.argv.includes('--check')) {
  if (fs.readFileSync(path.join(root, folder, 'index.html'), 'utf8') !== html) throw new Error('Page differs from source: run node scripts/generate-combos.mjs');
  console.log('Combos: generated HTML matches catalog and template.');
} else {
  fs.writeFileSync(path.join(root, folder, 'index.html'), html);
  console.log(`Combos page generated (${data.status}); sitemap and existing pages unchanged.`);
}
