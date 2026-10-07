import fs from 'node:fs';
import path from 'node:path';
export async function run({cdp,evaluate,origin,out,errors,pause}) {
 const results=[];
 const check=async(e,n)=>{if(!await evaluate(e))throw Error(n);results.push(n);};
 for(const width of [360,390,768,1440]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
  await cdp('Page.navigate',{url:origin+'/combos-pastel-canaa/'});
  for(let i=0;i<80;i++){if(await evaluate(`document.readyState==='complete' && document.querySelectorAll('[data-configurator]:not([hidden])').length===2`))break;await pause(100);}
  await check(`document.querySelectorAll('[data-configurator]:not([hidden])').length===2 && document.documentElement.scrollWidth<=innerWidth+1`, 'Two offers without overflow '+width);
  if([390,1440].includes(width)){const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,`combos-${width}.png`),Buffer.from(shot.data,'base64'));}
  await evaluate(`document.querySelector('#combo-duplo .options').open=true`);
  await check(`document.documentElement.scrollWidth<=innerWidth+1 && [...document.querySelectorAll('#combo-duplo .flavor-choices label')].every(l=>l.getBoundingClientRect().height>=48)`,'Large filling buttons '+width);
 }
 await evaluate(`window.forms=[...document.querySelectorAll('[data-configurator]')];window.pick=(i,n,v)=>forms[i].querySelector('[name='+n+'][value="'+v+'"]').click();window.set=(s,v)=>{const e=document.querySelector(s);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};window.cart=()=>new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll(' ',' ');`);
 await check(`forms[1].requestSubmit();forms[1].querySelector('[data-form-error]').textContent.includes('recheio') && !document.querySelectorAll('.order-item').length`,'Filling is required');
 await check(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-card-send]')`,'No send button before the summary');
 await evaluate(`pick(1,'flavor1','frango-queijo');pick(1,'flavor2','queijo-presunto');forms[1].querySelector('[name=notes]').value='Guaraná <teste>';forms[1].requestSubmit();`);
 await check(`cart().includes('⭐ Pastelão 1: Frango com queijo') && cart().includes('⭐ Pastelão 2: Presunto com queijo') && cart().includes('1 refrigerante em lata (incluído)') && cart().includes('TOTAL: R$ 35,00') && !document.querySelector('.order-item teste')`,'Duplo in summary, escaped notes');
 await evaluate(`forms[0].querySelector('.options').open=true`);
 await check(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-pending-notice]').hidden`,'Send waits while another combo is open');
 await evaluate(`pick(0,'flavor1','carne-queijo');forms[0].requestSubmit();set('#meu-pedido [data-field=address]','Rua Teste, 10');`);
 await check(`cart().includes('TOTAL: R$ 55,00') && cart().split('Entrega na zona urbana:').length===2 && cart().includes('Rua Teste, 10') && cart().split('1 refrigerante em lata (incluído)').length===3`,'Mixed order, one delivery, same drink label');
 await check(`document.querySelector('[data-bar-count]').textContent==='2 combos no pedido' && document.querySelectorAll('.order-bar a').length===2`,'Bar shows total and combo count');
 await evaluate(`document.querySelector('[data-edit="0"]').click();forms[1].querySelector('.combo-count input').value=2;forms[1].querySelector('[data-extra=refrigerante-extra] input').value=1;forms[1].dispatchEvent(new Event('input',{bubbles:true}));forms[1].requestSubmit();`);
 await check(`cart().includes('TOTAL: R$ 97,00') && document.querySelectorAll('.order-item').length===2 && cart().includes('2× Refrigerante em lata extra')`,'Edit and extra cans per combo');
 await evaluate(`const e=document.querySelector('#meu-pedido [value=retirada]');e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));`);
 await check(`cart().includes('TOTAL: R$ 92,00') && !cart().includes('Endereço') && cart().includes('✅ *RETIRADA* · 3 combos') && document.querySelector('#meu-pedido [data-customer-title]').textContent==='Seus dados'`,'Pickup removes fee and address');
 await evaluate(`document.querySelector('[data-edit="1"]').click();pick(0,'flavor1','queijo-presunto');forms[0].elements.drink.value='suco';forms[0].requestSubmit();`);
 await check(`cart().includes('TOTAL: R$ 99,00')`,'Juice adds R$ 7');
 await evaluate(`document.querySelector('[data-edit="1"]').click();`);
 await check(`forms[0].elements.flavor1.value==='queijo-presunto' && forms[0].elements.drink.value==='suco' && document.querySelector('[data-send-order]').hidden`,'Individual flavor and juice survive editing');
 await evaluate(`forms[0].querySelector('[data-cancel]').click();document.querySelector('[data-remove="1"]').click();document.querySelector('[data-remove="0"]').click();`);
 await check(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-send-order]').hasAttribute('href') && document.querySelector('.order-bar').hidden`,'Empty cart cannot send');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(results.length+' browser checks passed');
}
