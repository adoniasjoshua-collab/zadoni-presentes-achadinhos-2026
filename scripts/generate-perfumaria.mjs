import { metaPixelHead, metaPixelBody } from './meta-pixel-snippet.mjs';
// Isolated, repeatable department build. Does not run the legacy page generator.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, text) => { fs.mkdirSync(path.dirname(path.join(root,p)), {recursive:true}); fs.writeFileSync(path.join(root,p),text); };
const site = 'https://zadonipresentes.com.br';
const slug = 'perfumaria-cosmeticos-canaa';
const url = `${site}/${slug}/`;
const esc = x => String(x).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const wa = (subject) => `https://wa.me/5594992993138?text=${encodeURIComponent(`Olá! Vi a página de perfumaria da Zadoni. Tenho interesse em ${subject}. Pode confirmar preço, disponibilidade, formas de pagamento e prazo de entrega em Canaã dos Carajás? Meu bairro é: `)}`;
const cta = (subject, label='Consultar no WhatsApp') => `<a class="pf-button" href="${esc(wa(subject))}" target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-source="perfumaria">${esc(label)}</a>`;
const ctx = {};
vm.runInNewContext(`${read('assets/data/produtos.js')}\nglobalThis.items = produtosLocais;`,ctx);
const products = ctx.items.filter(p=>[28,29,30,31,32].includes(p.id));
const categories = [
 ['importados','Perfumes importados','Consulte marcas e fragrâncias importadas por meio dos parceiros da Zadoni. Informe o produto e o volume desejados para confirmar preço, procedência, disponibilidade e prazo.'],
 ['nacionais','Perfumes nacionais','Encontre uma fragrância para sua rotina ou para presentear. Consulte opções nacionais, incluindo Hinode, conforme a oferta dos parceiros. Marca, volume e valor são confirmados no atendimento.'],
 ['body-splash','Body splash','Procura uma fragrância para acompanhar os cuidados do dia a dia? Consulte as opções de body splash, seus volumes e preços. A foto da embalagem é confirmada antes do pedido.'],
 ['cosmeticos','Cosméticos','Consulte os produtos de cuidados e beleza disponíveis com nossos parceiros. Conte qual item, marca e quantidade você procura para receber uma proposta com preço e prazo.']
];
const faqs = [
 ['Onde comprar perfumes em Canaã dos Carajás?','Você pode consultar perfumes nacionais, importados e cosméticos com a Zadoni pelo WhatsApp. Informe o produto ou o perfil de fragrância que procura e seu orçamento. O atendimento confirma as opções e as condições do pedido.'],
 ['Os perfumes estão disponíveis na loja?','A disponibilidade varia por produto. Há opções do catálogo da Zadoni e opções consultadas com parceiros. Antes de fechar, confirme se o item está disponível, se depende do parceiro e qual é o prazo.'],
 ['A Zadoni entrega perfumes em Canaã dos Carajás?','Consulte a possibilidade de entrega informando o bairro e o horário desejado. Taxa, área atendida e prazo são confirmados no WhatsApp antes do fechamento.'],
 ['Como consultar preço e formas de pagamento?','Use o botão do produto ou da categoria. Os perfumes de bolso apresentam os valores cadastrados no catálogo; confirme o valor vigente. Nos demais itens, o atendimento informa o preço e as formas de pagamento disponíveis.'],
 ['Perfumes inspirados são os mesmos produtos das marcas de referência?','Não. Uma fragrância inspirada é um produto de sua própria marca. As referências olfativas não significam que o frasco seja da marca citada como inspiração. Confira marca, nome, volume e embalagem antes de comprar.'],
 ['Posso pedir uma foto antes de comprar?','Sim. Peça uma foto do produto e da embalagem no atendimento. Os espaços marcados como imagem em breve são ilustrativos da categoria e não representam um frasco específico.']
];
const title = 'Perfumaria em Canaã dos Carajás | Zadoni';
const description = 'Perfumes nacionais, importados e cosméticos em Canaã dos Carajás. Conheça a perfumaria Zadoni e consulte preços, disponibilidade e entrega pelo WhatsApp.';
const image = `${site}/${products[0].imagem}`;
const home = read('index.html');
const schemas = [...home.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
function findBusiness(x) { if (!x || typeof x!=='object') return; if(x['@type']==='LocalBusiness') return x; for(const v of Object.values(x)){ const found=findBusiness(v); if(found)return found; } }
const business = schemas.map(findBusiness).find(Boolean);
if(!business) throw new Error('Existing business identity missing');
const graph = [business, {'@type':'CollectionPage','@id':url+'#webpage',url,name:title,description,inLanguage:'pt-BR'}, {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:site+'/'},{'@type':'ListItem',position:2,name:'Perfumaria',item:url}]}, {'@type':'ItemList',name:'Perfumes de bolso Amakha Paris',itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.nome,url:url+'#perfume-'+p.id}))}];
const cards = products.map(p=>`<article class="pf-card" id="perfume-${p.id}"><img src="../${esc(p.imagem)}" alt="${esc(p.nome)} — Amakha Paris" width="720" height="900" loading="lazy" decoding="async"><div class="pf-card-body"><p class="pf-eyebrow">Amakha Paris · 15 ml</p><h3>${esc(p.nome)}</h3><p>${esc(p.descricao)}</p><p class="pf-price">${p.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><p class="pf-note">Valor cadastrado · confirme preço e disponibilidade.</p>${cta(p.nome,'Consultar este perfume')}</div></article>`).join('\n');
write(`${slug}/index.html`, `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${url}"><meta name="robots" content="index,follow"><meta name="geo.placename" content="Canaã dos Carajás, Pará"><meta name="geo.region" content="BR-PA">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Zadoni Presentes"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/css/perfumaria.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16938428518"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','AW-16938428518');</script>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph},null,2).replaceAll('<','\\u003c')}</script>${metaPixelHead}
</head>
<body>
${metaPixelBody}<a class="pf-skip" href="#conteudo">Pular para o conteúdo</a>
<header class="pf-header"><a class="pf-brand" href="../"><img src="../assets/img/brand/logo-zadoni-96.webp" alt="" width="40" height="40" loading="eager" decoding="async">Zadoni Presentes</a><nav aria-label="Navegação principal"><a href="../">Início</a><a href="../presentes-canaa.html">Presentes</a><a href="./" aria-current="page">Perfumaria</a><a href="#atendimento">Atendimento</a></nav></header>
<main id="conteudo"><section class="pf-hero"><div class="pf-wrap"><nav class="pf-crumb" aria-label="Breadcrumb"><a href="../">Início</a> / <span aria-current="page">Perfumaria</span></nav><p class="pf-eyebrow">Seu próximo perfume, com atendimento em Canaã</p><h1>Perfumaria em Canaã dos Carajás</h1><p class="pf-lead">Perfumes nacionais, importados e cosméticos para sua rotina ou para presentear. Encontre sua fragrância com a Zadoni e consulte as opções disponíveis na loja e com nossos parceiros.</p><div class="pf-actions"><a class="pf-button" href="#perfumes-bolso">Ver perfumes de bolso</a>${cta('perfumes e cosméticos','Encontrar meu perfume')}</div><p class="pf-note">Preço, disponibilidade e condições de entrega confirmados antes do pedido.</p></div></section>
<div class="pf-wrap"><nav class="pf-categories" aria-label="Categorias de perfumaria"><a href="#importados">Importados</a><a href="#nacionais">Nacionais</a><a href="#masculinos">Masculinos</a><a href="#femininos">Femininos</a><a href="#body-splash">Body splash</a><a href="#cosmeticos">Cosméticos</a><a href="#perfumes-bolso">Amakha Paris</a></nav>
<section class="pf-section" aria-labelledby="bolso-title" id="perfumes-bolso"><p class="pf-eyebrow">Conheça as fragrâncias do catálogo</p><h2 id="bolso-title">Perfumes de bolso Amakha Paris em Canaã</h2><p>Frascos de 15 ml para levar com você ou incluir em um presente. Veja o perfil de cada fragrância e consulte a disponibilidade da sua escolha.</p><div class="pf-grid">${cards}</div></section>
<section class="pf-section" aria-labelledby="escolha-title"><h2 id="escolha-title">Encontre o perfume que combina com você</h2><div class="pf-two"><article class="pf-panel" id="masculinos"><h3>Perfumes masculinos</h3><p>Gosta de fragrâncias amadeiradas ou ambaradas? Conheça Fortune e Asadiyy no catálogo de bolso, ou consulte uma opção nacional ou importada. Conte se prefere uma fragrância discreta ou marcante.</p>${cta('perfumes masculinos','Ver opções masculinas')}</article><article class="pf-panel" id="femininos"><h3>Perfumes femininos</h3><p>Prefere um perfil floral, frutado ou doce? Explore Chic Woman, Zaya e 521 Vip Rose, ou informe a fragrância nacional ou importada que procura. A escolha pode acompanhar seu estilo e orçamento.</p>${cta('perfumes femininos','Ver opções femininas')}</article></div></section>
<section class="pf-section" aria-labelledby="categorias-title"><p class="pf-eyebrow">Mais opções com nossos parceiros</p><h2 id="categorias-title">Perfumes nacionais, importados e cosméticos</h2><p>Consulte o item que você procura. A oferta dos parceiros depende de confirmação; o atendimento informa marca, embalagem, preço e prazo antes de fechar o pedido.</p><div class="pf-two">${categories.map(([id,name,copy])=>`<article class="pf-card" id="${id}"><div class="pf-placeholder" role="img" aria-label="${name}: imagem em breve, nenhum produto específico representado"><span aria-hidden="true">Z</span><strong>${name}</strong><small>Imagem em breve</small></div><div class="pf-card-body"><h3>${name}</h3><p>${copy}</p><p class="pf-note">Disponibilidade e prazo sob consulta</p>${cta(name,'Consultar '+name.toLowerCase())}</div></article>`).join('')}</div></section>
<section class="pf-section pf-panel" id="atendimento"><h2>Como comprar perfumes em Canaã dos Carajás</h2><ol><li><strong>Escolha ou peça uma indicação.</strong> Informe o produto, a marca, o volume ou o perfil de fragrância desejado e seu orçamento.</li><li><strong>Confirme as condições.</strong> Consulte preço vigente, foto da embalagem, disponibilidade na loja ou no parceiro e formas de pagamento.</li><li><strong>Combine a entrega.</strong> Envie seu bairro e horário desejado. Prazo e taxa são confirmados antes do fechamento; consulte também a possibilidade de retirada.</li></ol>${cta('uma indicação de perfume para meu orçamento','Pedir uma indicação')}</section>
<section class="pf-section"><h2>Perfume para presente ou para o dia a dia</h2><p>Procura uma fragrância para usar no trabalho, sair ou presentear? Conte sua preferência no atendimento. Para uma composição especial, conheça também nossas <a href="../rosas-perfumadas-canaa/">combinações de rosas e perfumes</a> e o <a href="../presentes-canaa.html">catálogo de presentes da Zadoni</a>.</p></section>
<section class="pf-section pf-faq"><h2>Dúvidas sobre a perfumaria Zadoni</h2>${faqs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section></div></main>
<footer class="pf-footer"><div class="pf-wrap"><strong>Zadoni Presentes · Perfumaria</strong><p>Atendimento em Canaã dos Carajás — PA</p><p><a href="${wa('perfumaria')}">WhatsApp: (94) 99299-3138</a> · <a href="https://www.instagram.com/zadonipresentes/" target="_blank" rel="noopener noreferrer">Instagram</a></p><p><a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">Perfil e avaliações no Google</a> · <a href="../">Início</a> · <a href="../presentes-canaa.html">Catálogo de presentes</a></p></div></footer>
<script src="../assets/js/google-ads-whatsapp.js" defer></script></body></html>\n`);
// Append-only discovery links. All existing content and metadata stay untouched.
for (const [file,prefix] of [['index.html',''],['rosas-perfumadas-canaa/index.html','../']]) {
 const old=read(file);
 if(!old.includes('id="perfumaria-discovery"')) {
 const newline=old.includes('\r\n')?'\r\n':'\n';
 const block=`<section class="seo-copy" id="perfumaria-discovery"><div class="container"><h2>Conheça a perfumaria Zadoni</h2><p>Procura uma fragrância para sua rotina ou para presentear? <a href="${prefix}${slug}/">Veja perfumes nacionais, importados e cosméticos em Canaã dos Carajás</a> e consulte as opções pelo WhatsApp.</p></div></section>${newline}    `;
 if(!old.includes('</main>'))throw new Error(`Missing main: ${file}`);
 write(file,old.replace('</main>',block+'</main>'));
 }
}
let sitemap=read('sitemap.xml');
if(!sitemap.includes(`<loc>${url}</loc>`)) write('sitemap.xml',sitemap.replace('</urlset>',`  <url><loc>${url}</loc></url>\n</urlset>`));
console.log('Perfumaria generated: 5 existing products, 4 consultation categories; discovery links and sitemap added.');
