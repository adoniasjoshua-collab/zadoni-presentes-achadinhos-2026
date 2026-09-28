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
const title = 'Combos de Pastel em Canaã dos Carajás | Zadoni';
const description = 'Combos de pastel com refrigerante em lata na Zadoni, em Canaã dos Carajás: 1 pastel por R$ 20, 2 por R$ 30 e 3 por R$ 47. Suco opcional. Retire sem taxa ou receba com entrega de R$ 5.';
const social = `${site}/${data.socialImage || 'assets/img/brand/logo-zadoni-320.webp'}`;
const whatsapp = text => `https://wa.me/${data.phone}?text=${encodeURIComponent(text)}&utm_source=site&utm_medium=whatsapp&utm_campaign=seo_local&utm_content=combos_pastel`;
const contact = whatsapp('Olá, Zadoni! Tenho uma dúvida sobre os combos de pastel.');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const composition = c => `${plural(c.pastels, 'pastel', 'pastéis')} + ${plural(c.pastels, 'bebida', 'bebidas')}`;
const schemas = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'pt-BR', breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#combos` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Zadoni Presentes', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Combos de Pastel', item: url }
    ] },
    { '@type': 'ItemList', '@id': `${url}#combos`, itemListElement: data.flavors.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: `Combo de pastel de ${f.name.toLowerCase()}`, url: `${url}#${f.id}` })) }
  ]
};
function fulfillment(key) {
  return `<fieldset class="fulfillment"><legend>Como você quer receber?</legend><label><input type="radio" name="fulfillment" value="entrega" checked> Entrega <small>+ ${money(data.delivery.price)} por pedido</small></label><label><input type="radio" name="fulfillment" value="retirada"> Retirada <small>sem taxa</small></label></fieldset>`;
}
function stepper(id, name, value, min = 0, max = 99) {
  return `<div class="quantity"><button type="button" data-step="-1" aria-label="Diminuir quantidade de ${esc(name)}">−</button><input id="${id}" aria-label="Quantidade de ${esc(name)}" type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${value}"><button type="button" data-step="1" aria-label="Aumentar quantidade de ${esc(name)}">+</button></div>`;
}
const drinkOptions = `<option value="">Escolha a bebida</option>${data.drinks.map(d => `<option value="${esc(d.id)}"${d.id === 'refrigerante' ? ' selected' : ''}>${esc(d.name)}${d.price ? ' (+ ' + money(d.price) + ')' : ' (incluído)'}</option>`).join('')}`;
const juice = data.drinks.find(d => d.id === 'suco');
const maxPastels = Math.max(...data.combos.map(c => c.pastels));
const priceList = data.combos.map(c => `${plural(c.pastels, 'pastel', 'pastéis')} ${money(c.price)}`).join(' · ');
const cards = data.flavors.map((f, i) => `<article class="combo-card" id="${f.id}" data-flavor="${f.id}">
${f.image ? `<figure class="combo-figure"><img class="combo-photo" src="../${esc(f.image)}" width="800" height="800" alt="${esc(f.imageAlt + '. Imagem ilustrativa: o recheio segue o sabor escolhido.')}" loading="${i ? 'lazy' : 'eager'}" ${i ? '' : 'fetchpriority="high"'} decoding="async"><figcaption>Imagem ilustrativa. Seu combo vem com pastel de ${esc(f.name.toLowerCase())}. Todos os sabores têm o mesmo preço.</figcaption></figure>` : `<div class="photo-pending"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p>Foto do combo em preparação</p></div>`}
<div class="card-content"><p class="eyebrow">Pastel + refrigerante em lata</p><h2>Pastel de ${esc(f.name.toLowerCase())}</h2><p>Escolha 1, 2 ou 3 pastéis de ${esc(f.name.toLowerCase())}, cada um com um refrigerante em lata. Troque por suco por + ${money(juice.price)} cada. Embalagem básica incluída.</p><p class="price-list">${priceList}</p><p class="small">Retirada sem taxa ou + ${money(data.delivery.price)} de entrega por pedido na zona urbana.</p>
<form hidden data-configurator novalidate><fieldset class="size-choice"><legend>1. Quantos pastéis?</legend>${data.combos.map((c, n) => `<label><input type="radio" name="size" value="${c.id}"${n ? '' : ' checked'}> <span><strong>${esc(c.name)}</strong> ${composition(c)}</span> <b>${money(c.price)}</b></label>`).join('')}</fieldset>
<p class="step-title">2. Bebida de cada pastel</p><p class="small">O refrigerante em lata já vem marcado. Troque por suco (+ ${money(juice.price)}) se preferir.</p>
${Array.from({ length: maxPastels }, (_, n) => `<div class="drink-choice" data-pastel="${n}"${n ? ' hidden' : ''}><label for="${f.id}-bebida-${n}">Bebida do pastel ${n + 1}</label><select id="${f.id}-bebida-${n}" name="drink-${n}"${n ? ' disabled' : ''}>${drinkOptions}</select></div>`).join('')}
<label class="notes">Marca do refrigerante ou sabor do suco (opcional)<input name="notes" maxlength="120" placeholder="Ex.: guaraná, suco de laranja"></label>
<details class="extras"><summary><span>3. Adicionar bebidas, chocolates e extras</span><small data-extras-label>Opcional · escolha as quantidades</small></summary><p class="small">Quantidades abaixo para cada combo. Refrigerante extra: ${money(data.extras.find(e => e.id === 'refrigerante-extra').price)} por lata. Ferrero Rocher é vendido por caixa.</p>
${data.extras.map(e => `<div class="extra-row" data-extra="${e.id}"><div><label for="${f.id}-${e.id}">${esc(e.name)}</label><small>+ ${money(e.price)} / ${esc(e.unit)}</small><small class="extra-subtotal" data-extra-subtotal></small></div>${stepper(`${f.id}-${e.id}`, e.name, 0)}</div>`).join('')}
<label class="personalization" hidden>Nome ou mensagem nas caixinhas (opcional)<textarea name="personalization" maxlength="180" rows="2" placeholder="Se pedir várias caixinhas, indique a mensagem de cada uma"></textarea></label></details>
<div class="combo-count"><label for="count-${f.id}">Quantidade de combos iguais</label>${stepper(`count-${f.id}`, 'combos de ' + f.name.toLowerCase(), 1, 1, 20)}</div><p class="small">Bebidas e adicionais se repetem em cada combo igual. Para outro sabor, adicione também o card dele.</p>
${fulfillment(f.id)}
<div class="card-total" aria-live="polite" aria-atomic="true" data-card-total></div><p class="form-error" role="status" data-form-error></p>
<a class="button whatsapp direct-order" href="${esc(whatsapp(`Olá! Quero um combo de pastel de ${f.name.toLowerCase()} (${priceList}), para retirada sem taxa ou entrega de R$ 5 na zona urbana. Pode confirmar?`))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combo_${f.id}">Pedir este combo no WhatsApp</a>
<button class="button secondary" type="submit" data-add>Adicionar ao meu pedido</button></form>
<a class="button whatsapp fallback-order" href="${esc(whatsapp(`Olá! Quero um combo de pastel de ${f.name.toLowerCase()}: ${priceList}, com refrigerante em lata; entrega de R$ 5 na zona urbana ou retirada sem taxa. Pode confirmar quantidade, bebidas e como receber?`))}" target="_blank" rel="noopener noreferrer">Consultar este combo no WhatsApp</a></div></article>`).join('\n');
const html = `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="${live ? 'index, follow' : 'noindex, follow'}"><meta name="theme-color" content="#7a2f55">
<link rel="canonical" href="${url}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../assets/img/brand/logo-zadoni-180.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Zadoni Presentes"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${social}"><meta property="og:image:alt" content="${data.socialImage ? 'Combos de pastel Zadoni' : 'Marca Zadoni Presentes'}">
<meta name="twitter:card" content="${data.socialImage ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${social}">
<link rel="stylesheet" href="../assets/css/combos.css?v=20260928-4">
<script type="application/ld+json">${json(schemas)}</script>
${live ? `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config', 'AW-16938428518');</script>\n${metaPixelHead}` : '<!-- Preview: no advertising trackers are loaded. -->'}
<script id="combos-data" type="application/json">${json(data)}</script><script src="../assets/js/combos.js?v=20260928-4" defer></script>
${live ? '<script src="../assets/js/google-ads-whatsapp.js?v=20260727-google-ads" defer></script>' : ''}
</head><body>
${live ? metaPixelBody : '<div class="draft-banner">Prévia da nova página · fotos e disponibilidade em confirmação</div>'}
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="../index.html"><img src="../assets/img/brand/logo-zadoni-96.webp" width="40" height="40" alt="" loading="eager" decoding="async"><span>Zadoni Presentes</span></a><nav aria-label="Navegação principal"><a href="../presentes-canaa.html">Ver presentes</a><a href="#combos">Combos</a><a href="#meu-pedido" data-cart-nav hidden>Meu pedido</a></nav></div></header>
<main id="conteudo"><section class="hero shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Início</a><span aria-hidden="true"> / </span><span aria-current="page">Combos de pastel</span></nav>
<p class="eyebrow">Um lanche, um carinho · Canaã dos Carajás, PA</p><h1>Combos de Pastel<br><em>e Mini Kits</em></h1><p class="hero-copy">Pastel feito na hora com refrigerante em lata: <strong>1 pastel por R$ 20</strong>, <strong>2 por R$ 30</strong> ou <strong>3 por R$ 47</strong>. Prefere suco? É só trocar por + ${money(juice.price)} cada. Escolha o sabor e a quantidade e, se quiser, acrescente chocolates, maçã, pão de queijo ou uma caixinha personalizada para presentear.</p>
<nav class="combo-compare" aria-label="Compare os combos">${data.combos.map(c => `<a href="#combos"><strong>${esc(c.name)}</strong><span>${composition(c)}</span><b>${money(c.price)}</b></a>`).join('')}</nav><p class="compare-note">Qualquer sabor, mesmo preço. O valor muda só pela quantidade de pastéis, pela troca por suco e pelos adicionais.</p>
<div class="benefits"><span>Carne, frango ou queijo e presunto</span><span>Adicionais opcionais</span><span>Retirada sem taxa ou entrega de R$ 5*</span></div><p class="small">*Entrega por pedido, em toda a zona urbana de Canaã dos Carajás.</p><a class="button primary" href="#combos">Escolher meu combo <span aria-hidden="true">↓</span></a></section>
<section class="shell" id="combos" aria-label="Escolha seu combo de pastel"><div class="combo-grid">${cards}</div></section>
<section class="shell section" id="mini-kits"><div class="gift-panel"><div><p class="eyebrow">Dê um toque de presente</p><h2>Seu combo, com um carinho a mais</h2><p>Abra os adicionais do seu combo e escolha chocolates e uma caixinha personalizada por R$ 10. A quantidade e o preço de cada item aparecem antes de você enviar o pedido.</p></div><a class="button secondary" href="#combos">Personalizar um combo</a></div></section>
<section class="shell section" id="meu-pedido" tabindex="-1" hidden aria-labelledby="order-title"><p class="eyebrow">Tudo junto em um só pedido</p><h2 id="order-title">Meu pedido</h2><p>Confira os sabores, bebidas e adicionais. Você pode editar cada combo antes de enviar.</p><div data-order-items></div>${fulfillment('pedido')}<div class="order-total" data-order-total aria-live="polite" aria-atomic="true"></div><details class="message-preview"><summary>Conferir mensagem que será enviada</summary><pre data-message-preview></pre></details><a class="button whatsapp" data-send-order target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_pedido">Enviar pedido completo no WhatsApp</a><p class="small">O envio inicia o atendimento. Disponibilidade, entrega ou retirada são confirmadas pela Zadoni. Seu pedido fica apenas nesta página; ao recarregar, ele é limpo.</p></section>
<section class="shell section delivery" id="entrega"><h2>Retirada ou entrega dos combos em Canaã dos Carajás</h2><p><strong>Retirada sem taxa:</strong> o local e o horário são combinados pelo WhatsApp.</p><p><strong>Entrega em toda a zona urbana de Canaã dos Carajás</strong> por <strong>R$ 5 por pedido, para um único endereço</strong>. Dois ou mais combos no mesmo pedido pagam uma única entrega. A condição não se aplica automaticamente a cestas e buquês do outro catálogo.</p><p>O horário e a disponibilidade são combinados no atendimento.</p><a href="${esc(contact)}" target="_blank" rel="noopener noreferrer">Tirar dúvidas no WhatsApp</a></section>
<section class="shell section faq" aria-labelledby="faq-title"><h2 id="faq-title">Antes de fazer seu pedido</h2><details><summary>O que vem em cada combo?</summary><p>Combo 1: 1 pastel e 1 bebida por R$ 20. Combo 2: 2 pastéis e 2 bebidas por R$ 30. Combo 3: 3 pastéis e 3 bebidas por R$ 47. A bebida incluída é refrigerante em lata; se preferir suco, cada troca custa + ${money(juice.price)}. A embalagem básica está incluída. Adicionais e entrega são cobrados à parte e aparecem no resumo.</p></details><details><summary>Posso retirar o pedido?</summary><p>Sim. Escolha “Retirada” no pedido e não há taxa. O local e o horário de retirada são combinados pelo WhatsApp. Se preferir receber em casa, a entrega custa ${money(data.delivery.price)} por pedido em toda a zona urbana.</p></details><details><summary>Posso escolher a marca do refrigerante ou o sabor do suco?</summary><p>Sim. Escolha refrigerante em lata (incluído) ou suco (+ ${money(juice.price)}) para cada pastel e escreva sua preferência no campo de observação. A disponibilidade das marcas e sabores é confirmada no WhatsApp.</p></details><details><summary>O preço muda conforme o sabor?</summary><p>Não. Carne com queijo, frango com queijo e queijo e presunto têm o mesmo preço. O valor do pedido muda apenas pela quantidade de pastéis (Combo 1, 2 ou 3), pela troca do refrigerante por suco (+ ${money(juice.price)} cada) e pelos adicionais escolhidos.</p></details><details><summary>Posso pedir sabores diferentes?</summary><p>Sim. Configure o combo de cada sabor e toque em “Adicionar ao meu pedido”. Tudo vai numa única mensagem de WhatsApp, com uma só taxa de entrega.</p></details><details><summary>Posso pedir mais de uma unidade dos adicionais?</summary><p>Sim. Use os botões de quantidade para maçãs, pães de queijo, barrinhas, caixinhas e caixas de Ferrero Rocher. Cada caixa de Ferrero contém a quantidade de bombons indicada.</p></details><details><summary>Como funciona a caixinha personalizada?</summary><p>Ela custa R$ 10 por caixinha. Você pode indicar nome ou mensagem ao selecionar o adicional. O acabamento é combinado com a Zadoni pelo WhatsApp.</p></details></section>
<section class="shell section related"><h2>Para outras ocasiões</h2><p>Conheça também nossas <a href="../cestas-de-presente-canaa/">cestas de presente</a>, <a href="../buques-canaa-dos-carajas/">buquês</a> e <a href="../cesta-de-aniversario-canaa/">cestas de aniversário em Canaã dos Carajás</a>.</p></section></main>
<footer><div class="shell footer-grid"><div><a class="brand" href="../index.html">Zadoni Presentes</a><p>Presentes, flores, cestas e combos de pastel em Canaã dos Carajás · Pará.</p></div><div><h2>Outras opções da Zadoni</h2><ul><li><a href="../presentes-canaa.html">Presentes em Canaã</a></li><li><a href="../buques-canaa-dos-carajas/">Buquês</a></li><li><a href="../cestas-de-presente-canaa/">Cestas</a></li><li><a href="../floricultura-canaa-dos-carajas/">Flores e buquês</a></li><li><a href="../cesta-cafe-da-manha-canaa/">Cesta de café</a></li><li><a href="../cesta-de-aniversario-canaa/">Cesta de aniversário</a></li><li><a href="../rosas-perfumadas-canaa/">Rosas e perfumes</a></li><li><a href="../presentes-romanticos-canaa/">Presentes românticos</a></li><li><a href="../monte-sua-cesta/">Monte sua cesta</a></li><li><a href="../revenda-chocolates-canaa/">Chocolates</a></li><li><a href="../perfumaria-cosmeticos-canaa/">Perfumaria</a></li><li><a href="../links/">Links oficiais</a></li></ul></div><div><h2>Contato</h2><p>WhatsApp: <a href="${esc(contact)}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="combos_rodape">(94) 99299-3138</a></p><p>Instagram: <a href="https://www.instagram.com/zadonipresentes/" target="_blank" rel="noopener noreferrer" data-track="instagram">@zadonipresentes</a></p><p>Google: <a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">ver avaliações da Zadoni</a></p></div></div></footer>
<a class="whatsapp-float" href="${esc(contact)}" target="_blank" rel="noopener noreferrer" aria-label="Tirar dúvidas com a Zadoni pelo WhatsApp" data-track="whatsapp" data-track-source="combos_botao_fixo"><span aria-hidden="true">💬</span></a>
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
