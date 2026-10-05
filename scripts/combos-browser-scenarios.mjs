import fs from 'node:fs';
import path from 'node:path';
export async function run({cdp,evaluate,origin,out,errors,pause}) {
 const results=[];
 const check=async(e,n)=>{if(!await evaluate(e))throw Error(n);results.push(n);};
 for(const width of [360,390,768,1440]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
  await cdp('Page.navigate',{url:origin+'/combos-pastel-canaa/'});
  for(let i=0;i<80;i++){if(await evaluate(`document.readyState==='complete' && !!document.querySelector('[data-card-send][href]')`))break;await pause(100);}
  await check(`document.querySelectorAll('[data-configurator]:not([hidden])').length===2 && document.documentElement.scrollWidth<=innerWidth+1`, 'Two offers without overflow '+width);
  if([390,1440].includes(width)){const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,`combos-${width}.png`),Buffer.from(shot.data,'base64'));}
  await evaluate(`document.querySelector('#combo-duplo .options').open=true`);
  await check(`document.documentElement.scrollWidth<=innerWidth+1 && document.querySelector('#combo-duplo [name=notes]').getBoundingClientRect().height>0`,'Expanded notes visible '+width);
 }
 await evaluate(`window.forms=[...document.querySelectorAll('[data-configurator]')];window.set=(i,s,v)=>{const e=forms[i].querySelector(s);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};window.msg=i=>new URL(forms[i].querySelector('[data-card-send]').href).searchParams.get('text').replaceAll('\u00a0',' ');window.cart=()=>new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ');`);
 await check(`msg(0).includes('TOTAL: R$ 25,00') && msg(1).includes('TOTAL: R$ 35,00') && msg(1).includes('1 refrigerante em lata (incluído)')`,'Prices and soda included');
 await evaluate(`set(1,'[name=flavor1]','frango-queijo');set(1,'[name=flavor2]','queijo-presunto');set(1,'[name=notes]','Guaraná <teste>');set(1,'[data-field=address]','Rua Teste, 10');set(1,'[data-field=payment]','pix');`);
 await check(`msg(1).includes('frango com queijo + presunto com queijo') && msg(1).includes('Observações do pedido: Guaraná <teste>') && msg(1).includes('Rua Teste, 10') && msg(1).includes('Pagamento: Pix')`,'Fillings, notes, address and payment');
 await evaluate(`forms[1].requestSubmit();forms[0].requestSubmit();`);
 await check(`cart().includes('TOTAL: R$ 55,00') && cart().split('Entrega na zona urbana:').length===2 && !document.querySelector('.order-item teste')`,'Mixed order, one delivery, escaped notes');
 await evaluate(`document.querySelector('[data-edit="0"]').click();set(1,'.combo-count input',2);set(1,'[data-extra=refrigerante-extra] input',1);forms[1].requestSubmit();`);
 await check(`cart().includes('TOTAL: R$ 97,00') && document.querySelectorAll('.order-item').length===2 && cart().includes('2× Refrigerante em lata extra')`,'Edit and extra cans per combo');
 await evaluate(`const e=document.querySelector('#meu-pedido [value=retirada]');e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));`);
 await check(`cart().includes('TOTAL: R$ 92,00') && !cart().includes('Endereço da entrega')`,'Pickup removes fee and address');
 await evaluate(`document.querySelector('[data-edit="1"]').click();set(0,'[name=flavor1]','queijo-presunto');set(0,'[name=drink]','suco');forms[0].requestSubmit();document.querySelector('[data-edit="1"]').click();`);
 await check(`cart().includes('TOTAL: R$ 99,00') && forms[0].elements.flavor1.value==='queijo-presunto' && forms[0].elements.drink.value==='suco'`,'Individual flavor and juice survive editing');
 await evaluate(`document.querySelector('[data-remove="1"]').click();document.querySelector('[data-remove="0"]').click();`);
 await check(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-send-order]').hasAttribute('href')`,'Empty cart cannot send');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(results.length+' browser checks passed');
}
