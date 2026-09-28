import fs from 'node:fs';
import path from 'node:path';
export async function run({ cdp, evaluate, origin, out, errors, pause }) {
  const results = [];
  const slug = 'combos-pastel-canaa';
  const check = (value, name) => { if (!value) throw new Error(name); results.push({ check: name, passed: true }); };
  async function navigate() {
    await cdp('Page.navigate', { url: `${origin}/${slug}/` });
    for (let i = 0; i < 80; i++) {
      if (await evaluate(`location.pathname==='/${slug}/' && document.readyState==='complete'`)) return;
      await pause(100);
    }
    throw new Error('Navigation timeout');
  }
  for (const width of [360, 390, 412, 768, 1024, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate();
    check(await evaluate(`document.querySelectorAll('[data-configurator]:not([hidden])').length===3 && document.documentElement.scrollWidth<=innerWidth+1`), `Three working forms and no horizontal overflow at ${width}px`);
    await evaluate(`document.querySelectorAll('.extras').forEach(d=>d.open=true)`);
    check(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1 && [...document.querySelectorAll('.quantity button')].every(b=>b.getBoundingClientRect().height>=44)`), `Expanded lists and touch heights at ${width}px`);
    if ([390, 1440].includes(width)) {
      await evaluate(`document.querySelectorAll('.extras').forEach(d=>d.open=false)`);
      const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      fs.writeFileSync(path.join(out, `combos-${width}.png`), Buffer.from(shot.data, 'base64'));
    }
  }
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
  await navigate();
  check(await evaluate(`[...document.querySelectorAll('[name^=drink-]')].every(s=>s.value==='refrigerante') && [...document.querySelectorAll('.combo-compare a')].map(a=>a.getAttribute('href')).join()==='#combos,#combos,#combos' && !document.querySelector('.whatsapp-float').hidden && document.querySelectorAll('footer ul a').length===12`), 'Soda preselected, compare shortcuts, floating WhatsApp and full footer');
  check(await evaluate(`(() => {const f=document.querySelector('[data-configurator]');return f.elements.size.value==='combo-1' && !f.querySelector('[data-pastel="1"]').getClientRects().length && new URL(f.querySelector('.direct-order').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('1× Combo 1 de carne com queijo (1 pastel + 1 bebida)');})()`), 'Flavor cards default to 1 pastel with soda, ready to order');
  check(await evaluate(`(() => {const f=document.querySelector('[data-configurator]');f.querySelector('.drink-choice select').value='';f.querySelector('.direct-order').click();const ok=document.activeElement===f.querySelector('.drink-choice select') && f.querySelector('[data-form-error]').textContent.includes('bebida');f.querySelector('.drink-choice select').value='refrigerante';f.dispatchEvent(new Event('input',{bubbles:true}));return ok;})()`), 'Empty drink blocks direct checkout');
  await evaluate(`window.testForm=document.querySelector('[data-configurator]'); window.setValue=(selector,value)=>{const e=testForm.querySelector(selector);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));};setValue('[name=drink-0]','refrigerante');setValue('[data-extra=maca] input',2);setValue('[data-extra=pao-queijo] input',3);setValue('[data-extra=cacau-show] input',2);`);
  check(await evaluate(`new URL(testForm.querySelector('.direct-order').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 61,00')`), 'R$61 example and direct WhatsApp summary');
  await evaluate(`testForm.querySelector('.extras').open=true;testForm.querySelector('.extras').scrollIntoView({block:'start',behavior:'auto'})`);
  const extrasShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'extras-390.png'), Buffer.from(extrasShot.data, 'base64'));
  check(await evaluate(`(() => {testForm.querySelector('.extras').open=true;testForm.querySelector('.extras').open=false;return testForm.querySelector('[data-extra=maca] input').value==='2';})()`), 'Closing extras preserves quantities');
  await evaluate(`testForm.requestSubmit();`);
  check(await evaluate(`document.querySelector('.whatsapp-float').hidden && !document.querySelector('.order-bar').hidden`), 'Floating WhatsApp gives way to the order bar');
  check(await evaluate(`document.querySelectorAll('.order-item').length===1 && new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 61,00')`), 'Cart receives configured group');
  await evaluate(`const f=document.querySelectorAll('[data-configurator]')[1];f.elements.size.value='combo-2';f.dispatchEvent(new Event('change',{bubbles:true}));f.elements['drink-0'].value='suco';f.elements['drink-1'].value='refrigerante';f.dispatchEvent(new Event('input',{bubbles:true}));f.requestSubmit();`);
  check(await evaluate(`(() => {const m=new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ');return m.includes('TOTAL: R$ 98,00') && m.includes('1× Combo 2 de frango com queijo (2 pastéis + 2 bebidas)') && m.includes('Pastel 1: Frango com queijo + Suco (+R$ 7,00)') && m.includes('Pastel 2: Frango com queijo + Refrigerante em lata') && m.includes('1× Combo 1 de carne com queijo');})()`), 'Two flavors in one order: Combo 2 at R$30 plus R$7 juice and a single R$5 delivery');
  await evaluate(`document.getElementById('meu-pedido').scrollIntoView({block:'start',behavior:'auto'})`);
  const orderShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'pedido-390.png'), Buffer.from(orderShot.data, 'base64'));
  await evaluate(`(() => {const r=document.querySelector('#meu-pedido input[value=retirada]');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  check(await evaluate(`(() => {const m=new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ');return m.includes('TOTAL: R$ 93,00') && m.includes('Retirada: sem taxa') && m.includes('horário de retirada') && !m.includes('Entrega para') && document.querySelector('[data-bar-total]').textContent.includes('para retirada') && [...document.querySelectorAll('[data-configurator] input[value=retirada]')].every(r=>r.checked) && new URL(testForm.querySelector('.direct-order').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 56,00');})()`), 'Pickup removes the R$5 fee from cart, bar, cards and message');
  await evaluate(`document.getElementById('meu-pedido').scrollIntoView({block:'start',behavior:'auto'})`);
  const pickupShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'retirada-390.png'), Buffer.from(pickupShot.data, 'base64'));
  await evaluate(`(() => {const r=testForm.querySelector('input[value=entrega]');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  check(await evaluate(`new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 98,00') && document.querySelector('#meu-pedido input[value=entrega]').checked`), 'Choosing delivery on a card restores the single R$5 fee everywhere');
  await evaluate(`document.querySelector('[data-edit="0"]').click();setValue('.combo-count input',2);testForm.requestSubmit();`);
  check(await evaluate(`document.querySelectorAll('.order-item').length===2 && new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 154,00')`), 'Editing group multiplies extras and replaces rather than duplicates');
  await evaluate(`document.querySelector('[data-remove="1"]').click();`);
  check(await evaluate(`new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ').includes('TOTAL: R$ 117,00')`), 'Remove group recalculates totals');
  await evaluate(`document.querySelector('[data-edit="0"]').click();setValue('[name=drink-0]','suco');setValue('[name=notes]','Acerola');testForm.requestSubmit();`);
  check(await evaluate(`(() => {const m=new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' '); return m.includes('TOTAL: R$ 131,00') && m.includes('Carne com queijo + Suco (+R$ 7,00)') && m.includes('Acerola') && document.querySelector('[data-order-total]').textContent.replaceAll('\u00a0',' ').includes('Troca por suco') && !/estimad/i.test(m);})()`), 'Juice adds R$7 per drink and per repeated combo');
  await evaluate(`document.querySelector('[data-remove="0"]').click();`);
  check(await evaluate(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-send-order]').hasAttribute('href') && document.querySelector('.order-bar').hidden`), 'Empty cart cannot checkout or charge delivery');
  await navigate();
  await evaluate(`window.testForm=document.querySelector('[data-configurator]');window.setValue=(selector,value)=>{const e=testForm.querySelector(selector);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));};setValue('[name=drink-0]','refrigerante');setValue('[data-extra=ferrero-4] input',1);setValue('[data-extra=ferrero-8] input',1);setValue('[data-extra=ferrero-12] input',1);setValue('[data-extra=caixinha] input',1);setValue('[name=personalization]','<img src=x onerror=alert(1)> & Feliz aniversário');testForm.requestSubmit();`);
  check(await evaluate(`(() => {const m=new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ');return m.includes('TOTAL: R$ 199,00') && m.includes('<img src=x') && !document.querySelector('.order-item img') && m.includes('caixa com 8 unidades');})()`), 'All Ferrero box prices, personalization and HTML injection safety');
  await evaluate(`setValue('[data-extra=caixinha] input',0);`);
  check(await evaluate(`testForm.elements.personalization.disabled && !new URL(testForm.querySelector('.direct-order').href).searchParams.get('text').includes('Personalização')`), 'Deselected box omits stale personalization');
  await evaluate(`setValue('[data-extra=caixinha] input',0);setValue('[data-extra=ferrero-4] input',0);setValue('[data-extra=ferrero-8] input',0);setValue('[data-extra=ferrero-12] input',0);setValue('[data-extra=refrigerante-extra] input',2);`);
  check(await evaluate(`(() => {const m=new URL(testForm.querySelector('.direct-order').href).searchParams.get('text').replaceAll(' ',' ');return m.includes('2× Refrigerante em lata extra (R$ 6,00 por lata) = R$ 12,00') && m.includes('TOTAL: R$ 37,00');})()`), 'Extra canned soda at R$6 each with quantity');
  await evaluate(`setValue('[data-extra=maca] input',-2);setValue('[data-extra=pao-queijo] input',2.5);setValue('[data-extra=cacau-show] input',999);`);
  check(await evaluate(`testForm.querySelector('[data-extra=maca] input').value==='0' && testForm.querySelector('[data-extra=pao-queijo] input').value==='2' && testForm.querySelector('[data-extra=cacau-show] input').value==='99'`), 'Invalid quantities constrained to whole nonnegative bounded values');
  await navigate();
  await evaluate(`window.f3=document.querySelectorAll('[data-configurator]')[2];f3.elements.size.value='combo-3';f3.dispatchEvent(new Event('change',{bubbles:true}));`);
  check(await evaluate(`[...f3.querySelectorAll('[data-pastel]')].every(r=>!r.hidden && !r.querySelector('select').disabled)`), 'Choosing 3 pastéis shows three drink choices');
  await evaluate(`f3.elements['drink-2'].value='suco';f3.dispatchEvent(new Event('input',{bubbles:true}));f3.requestSubmit();`);
  check(await evaluate(`(() => {const m=new URL(document.querySelector('[data-send-order]').href).searchParams.get('text').replaceAll('\u00a0',' ');return m.includes('TOTAL: R$ 59,00') && m.includes('Combo 3 de queijo e presunto (3 pastéis + 3 bebidas)') && m.includes('Pastel 3: Queijo e presunto + Suco');})()`), 'Queijo e presunto with 3 pastéis at R$47 and one R$7 juice');
  await navigate();
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  check(await evaluate(`document.activeElement.classList.contains('skip-link')`), 'Keyboard skip link');
  const blocks = ['*googletagmanager.com*','*google-analytics.com*','*googleadservices.com*','*doubleclick.net*','*wa.me*','*facebook.net*','*facebook.com*'];
  await cdp('Network.setBlockedURLs', { urls: [...blocks, '*assets/js/combos.js*'] });
  await navigate();
  check(await evaluate(`[...document.querySelectorAll('.fallback-order')].every(a=>a.getClientRects().length) && [...document.querySelectorAll('[data-configurator]')].every(f=>f.hidden)`), 'Failed script keeps three functional contact links and static product content');
  await cdp('Network.setBlockedURLs', { urls: blocks });
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  await navigate();
  check(await evaluate(`document.querySelectorAll('article h2').length===3 && [...document.querySelectorAll('.fallback-order')].every(a=>a.getClientRects().length)`), 'No JavaScript preserves product names, prices and WhatsApp contact');
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  check(errors.length===0, 'No browser runtime exceptions');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, externalRequests: 'WhatsApp and trackers blocked; no messages sent' }, null, 2));
  console.log(`Combos browser: ${results.length} checks passed; screenshots in ${out}`);
}
