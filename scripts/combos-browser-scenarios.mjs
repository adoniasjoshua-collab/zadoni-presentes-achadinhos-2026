import fs from 'node:fs';
import path from 'node:path';
export async function run({cdp,evaluate,origin,out,errors,pause}) {
 const results=[];
 const check=async(e,n)=>{if(!await evaluate(e))throw Error(n);results.push(n);};
 for(const width of [360,390,768,1440]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
  await cdp('Page.navigate',{url:origin+'/combos-pastel-canaa/'});
  for(let i=0;i<80;i++){if(await evaluate(`document.readyState==='complete' && !!document.querySelector('[data-order-form]:not([hidden])')`))break;await pause(100);}
  await check(`!!document.querySelector('[data-order-form]:not([hidden])') && document.querySelector('.fallback-order').hidden && document.documentElement.scrollWidth<=innerWidth+1`, 'Order form without overflow '+width);
  if([390,1440].includes(width)){const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,`combos-${width}.png`),Buffer.from(shot.data,'base64'));}
  await check(`[...document.querySelectorAll('[data-flavor-qty] .quantity button')].every(b=>b.getBoundingClientRect().height>=44)`,'Large quantity buttons '+width);
 }
 await evaluate(`window.f=document.querySelector('[data-order-form]');window.q=(id,v)=>{const i=f.querySelector('[data-flavor-qty="'+id+'"] input, [data-extra="'+id+'"] input');i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));};window.set=(s,v)=>{const e=f.querySelector(s);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};window.cart=()=>{const h=f.querySelector('[data-send-order]').getAttribute('href');return h?new URL(h).searchParams.get('text').replaceAll('\\u00a0',' '):'';};`);
 await check(`f.querySelector('[data-send-order]').click();!f.querySelector('[data-send-order]').hasAttribute('href') && f.querySelector('[data-form-error]').textContent.includes('recheio') && document.querySelector('.order-bar').hidden`,'Empty order cannot send');
 await evaluate(`f.querySelector('[data-flavor-qty="carne-queijo"] [data-step="1"]').click();`);
 await check(`cart().includes('⭐ 1× Carne com queijo') && cart().includes('1 avulso × R$ 15,00 = R$ 15,00') && cart().includes('TOTAL: R$ 21,00') && !f.querySelector('[data-form-error]').textContent`,'One pastel with delivery');
 await evaluate(`q('carne-queijo',2);q('frango-queijo',1);q('queijo-presunto',1);`);
 await check(`cart().includes('⭐ 2× Carne com queijo') && cart().includes('⭐ 1× Frango com queijo') && cart().includes('⭐ 1× Presunto com queijo') && cart().includes('2 duplas × R$ 24,00 = R$ 48,00') && cart().includes('TOTAL: R$ 54,00') && cart().includes('· 4 pastelões')`,'Quantity per filling in a single order');
 await evaluate(`q('queijo-presunto',0);`);
 await check(`cart().includes('1 dupla × R$ 24,00 + 1 avulso × R$ 15,00 = R$ 39,00') && cart().includes('TOTAL: R$ 45,00') && !cart().includes('Presunto')`,'Odd pastel at the single price');
 await evaluate(`q('refrigerante-extra',2);set('[name=notes]','Guaraná <teste>');set('[data-field=address]','Rua Teste, 10');`);
 await check(`cart().includes('2× Coca lata gelada — R$ 12,00') && cart().includes('TOTAL: R$ 57,00') && cart().includes('Obs.: Guaraná <teste>') && !document.querySelector('teste') && cart().includes('Rua Teste, 10')`,'Coca lata R$ 6 each, escaped notes, address');
 await check(`document.querySelector('[data-bar-count]').textContent==='3 pastelões no pedido' && document.querySelector('[data-bar-total]').textContent.includes('57,00') && document.querySelector('.whatsapp-float').hidden`,'Bar shows total and pastel count');
 await evaluate(`const e=f.querySelector('[value=retirada]');e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));`);
 await check(`cart().includes('TOTAL: R$ 51,00') && !cart().includes('Endereço') && cart().includes('✅ *RETIRADA* · 3 pastelões') && f.querySelector('[data-customer-title]').textContent==='Seus dados'`,'Pickup removes fee and address');
 await evaluate(`q('caixinha',1);`);
 await check(`!f.querySelector('.personalization').hidden && cart().includes('1× Caixinha personalizada — R$ 10,00')`,'Gift box shows personalization');
 await evaluate(`['carne-queijo','frango-queijo'].forEach(id=>q(id,0));`);
 await check(`!f.querySelector('[data-send-order]').hasAttribute('href') && f.querySelector('.message-preview').hidden`,'Clearing fillings blocks sending');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(results.length+' browser checks passed');
}
