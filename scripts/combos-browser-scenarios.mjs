import fs from 'node:fs';
import path from 'node:path';
export async function run({ cdp, evaluate, origin, out, errors, pause }) {
  const results = [];
  const slug = 'combos-pastel-canaa';
  const check = (value, name) => { if (!value) throw new Error(name); results.push({ check: name, passed: true }); };
  const text = selector => `new URL(${selector}.href).searchParams.get('text').replaceAll('\\u00a0',' ')`;
  const cart = text(`document.querySelector('[data-send-order]')`);
  async function navigate() {
    await cdp('Page.navigate', { url: `${origin}/${slug}/` });
    for (let i = 0; i < 80; i++) {
      if (await evaluate(`location.pathname==='/${slug}/' && document.readyState==='complete'`)) return;
      await pause(100);
    }
    throw new Error('Navigation timeout');
  }
  const useForm = index => evaluate(`window.testForm=document.querySelectorAll('[data-configurator]')[${index}];window.setValue=(selector,value)=>{const e=testForm.querySelector(selector);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));};`);
  for (const width of [360, 390, 412, 768, 1024, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate();
    check(await evaluate(`document.querySelectorAll('[data-configurator]:not([hidden])').length===3 && document.documentElement.scrollWidth<=innerWidth+1`), `Three working cards and no horizontal overflow at ${width}px`);
    await evaluate(`document.querySelectorAll('.options').forEach(d=>d.open=true)`);
    check(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1 && [...document.querySelectorAll('.quantity button')].every(b=>b.getBoundingClientRect().height>=44)`), `Opened options and touch heights at ${width}px`);
    if ([390, 1440].includes(width)) {
      await evaluate(`document.querySelectorAll('.options').forEach(d=>d.open=false)`);
      const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      fs.writeFileSync(path.join(out, `combos-${width}.png`), Buffer.from(shot.data, 'base64'));
    }
  }
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
  await navigate();
  check(await evaluate(`(() => {const cards=[...document.querySelectorAll('.combo-card')];return cards.map(c=>c.querySelector('h2').textContent).join('|')==='Carne com queijo|Frango com queijo|Presunto com queijo' && new Set(cards.map(c=>c.querySelector('img').getAttribute('src'))).size===3 && cards.every(c=>c.querySelector('.price').textContent.replaceAll('\\u00a0',' ')==='R$ 22,00' && !c.querySelector('.options').open);})()`), 'Three flavors, three different photos, R$22 up front and options closed');
  check(await evaluate(`[...document.querySelectorAll('[name=drink]')].every(s=>s.value==='refrigerante') && !document.querySelector('.whatsapp-float').hidden && document.querySelectorAll('footer ul a').length===12`), 'Soda preselected, floating WhatsApp and full footer');
  await useForm(0);
  check(await evaluate(`(() => {const m=${text(`testForm.querySelector('.direct-order')`)};return m.includes('1× Combo pastelão de carne com queijo — R$ 22,00') && m.includes('Bebida: Refrigerante em lata') && m.includes('TOTAL: R$ 27,00');})()`), 'One tap orders R$22 + R$5 delivery');
  await evaluate(`setValue('[data-extra=maca] input',2);setValue('[data-extra=pao-queijo] input',3);setValue('[data-extra=cacau-show] input',2);`);
  check(await evaluate(`${text(`testForm.querySelector('.direct-order')`)}.includes('TOTAL: R$ 63,00')`), 'Add-ons update the direct WhatsApp total');
  await evaluate(`testForm.querySelector('.options').open=true;testForm.querySelector('.options').scrollIntoView({block:'start',behavior:'auto'})`);
  const extrasShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'extras-390.png'), Buffer.from(extrasShot.data, 'base64'));
  check(await evaluate(`(() => {testForm.querySelector('.options').open=false;return testForm.querySelector('[data-extra=maca] input').value==='2';})()`), 'Closing options preserves quantities');
  await evaluate(`testForm.requestSubmit();`);
  check(await evaluate(`document.querySelector('.whatsapp-float').hidden && !document.querySelector('.order-bar').hidden`), 'Floating WhatsApp gives way to the order bar');
  check(await evaluate(`document.querySelectorAll('.order-item').length===1 && ${cart}.includes('TOTAL: R$ 63,00')`), 'Cart receives configured combo');
  await evaluate(`const f=document.querySelectorAll('[data-configurator]')[1];f.elements.drink.value='suco';f.querySelector('.combo-count input').value=2;f.dispatchEvent(new Event('input',{bubbles:true}));f.requestSubmit();`);
  check(await evaluate(`(() => {const m=${cart};return m.includes('TOTAL: R$ 121,00') && m.includes('2× Combo pastelão de frango com queijo — R$ 44,00') && m.includes('Bebida: Suco (+R$ 7,00) em cada combo') && m.split('Entrega na zona urbana').length===2;})()`), 'Two flavors in one order with juice +R$7 each and one R$5 delivery');
  await evaluate(`document.getElementById('meu-pedido').scrollIntoView({block:'start',behavior:'auto'})`);
  const orderShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'pedido-390.png'), Buffer.from(orderShot.data, 'base64'));
  await evaluate(`(() => {const r=document.querySelector('#meu-pedido input[value=retirada]');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  check(await evaluate(`(() => {const m=${cart};return m.includes('TOTAL: R$ 116,00') && m.includes('Retirada: sem taxa') && m.includes('horário de retirada') && !m.includes('Entrega na') && document.querySelector('[data-bar-total]').textContent.includes('para retirada') && [...document.querySelectorAll('[data-configurator] input[value=retirada]')].every(r=>r.checked) && ${text(`testForm.querySelector('.direct-order')`)}.includes('TOTAL: R$ 58,00');})()`), 'Pickup removes the R$5 fee from cart, bar, cards and message');
  await evaluate(`document.getElementById('meu-pedido').scrollIntoView({block:'start',behavior:'auto'})`);
  const pickupShot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, 'retirada-390.png'), Buffer.from(pickupShot.data, 'base64'));
  await evaluate(`(() => {const r=testForm.querySelector('input[value=entrega]');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  check(await evaluate(`${cart}.includes('TOTAL: R$ 121,00') && document.querySelector('#meu-pedido input[value=entrega]').checked`), 'Choosing delivery on a card restores the single R$5 fee everywhere');
  await evaluate(`document.querySelector('[data-edit="0"]').click();setValue('.combo-count input',2);testForm.requestSubmit();`);
  check(await evaluate(`document.querySelectorAll('.order-item').length===2 && ${cart}.includes('TOTAL: R$ 179,00')`), 'Editing multiplies add-ons and replaces rather than duplicates');
  await evaluate(`document.querySelector('[data-remove="1"]').click();`);
  check(await evaluate(`${cart}.includes('TOTAL: R$ 121,00')`), 'Remove recalculates totals');
  await evaluate(`document.querySelector('[data-edit="0"]').click();setValue('[name=drink]','suco');setValue('[name=notes]','Acerola');testForm.requestSubmit();`);
  check(await evaluate(`(() => {const m=${cart};return m.includes('TOTAL: R$ 135,00') && m.includes('Bebida: Suco (+R$ 7,00)') && m.includes('Acerola') && document.querySelector('[data-order-total]').textContent.includes('Troca por suco');})()`), 'Juice adds R$7 per combo');
  await evaluate(`document.querySelector('[data-remove="0"]').click();`);
  check(await evaluate(`document.querySelector('[data-send-order]').hidden && !document.querySelector('[data-send-order]').hasAttribute('href') && document.querySelector('.order-bar').hidden && !document.querySelector('.whatsapp-float').hidden`), 'Empty cart cannot checkout or charge delivery');
  await navigate();
  await useForm(0);
  await evaluate(`setValue('[data-extra=ferrero-4] input',1);setValue('[data-extra=ferrero-8] input',1);setValue('[data-extra=ferrero-12] input',1);setValue('[data-extra=caixinha] input',1);setValue('[name=personalization]','<img src=x onerror=alert(1)> & Feliz aniversário');testForm.requestSubmit();`);
  check(await evaluate(`(() => {const m=${cart};return m.includes('TOTAL: R$ 201,00') && m.includes('<img src=x') && !document.querySelector('.order-item img') && m.includes('caixa com 8 unidades');})()`), 'All Ferrero box prices, personalization and HTML injection safety');
  await evaluate(`setValue('[data-extra=caixinha] input',0);`);
  check(await evaluate(`testForm.elements.personalization.disabled && !${text(`testForm.querySelector('.direct-order')`)}.includes('Personalização')`), 'Deselected box omits stale personalization');
  await evaluate(`setValue('[data-extra=ferrero-4] input',0);setValue('[data-extra=ferrero-8] input',0);setValue('[data-extra=ferrero-12] input',0);setValue('[data-extra=refrigerante-extra] input',2);`);
  check(await evaluate(`(() => {const m=${text(`testForm.querySelector('.direct-order')`)};return m.includes('2× Refrigerante em lata extra (R$ 6,00 por lata) = R$ 12,00') && m.includes('TOTAL: R$ 39,00');})()`), 'Extra canned soda at R$6 each with quantity');
  await evaluate(`setValue('[data-extra=maca] input',-2);setValue('[data-extra=pao-queijo] input',2.5);setValue('[data-extra=cacau-show] input',999);`);
  check(await evaluate(`testForm.querySelector('[data-extra=maca] input').value==='0' && testForm.querySelector('[data-extra=pao-queijo] input').value==='2' && testForm.querySelector('[data-extra=cacau-show] input').value==='99'`), 'Invalid quantities constrained to whole nonnegative bounded values');
  await navigate();
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  check(await evaluate(`document.activeElement.classList.contains('skip-link')`), 'Keyboard skip link');
  const blocks = ['*googletagmanager.com*','*google-analytics.com*','*googleadservices.com*','*doubleclick.net*','*wa.me*','*facebook.net*','*facebook.com*'];
  await cdp('Network.setBlockedURLs', { urls: [...blocks, '*assets/js/combos.js*'] });
  await navigate();
  check(await evaluate(`[...document.querySelectorAll('.fallback-order')].every(a=>a.getClientRects().length) && [...document.querySelectorAll('[data-configurator]')].every(f=>f.hidden)`), 'Failed script keeps three WhatsApp links and static product content');
  await cdp('Network.setBlockedURLs', { urls: blocks });
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  await navigate();
  check(await evaluate(`document.querySelectorAll('article h2').length===3 && [...document.querySelectorAll('.fallback-order')].every(a=>a.getClientRects().length)`), 'No JavaScript preserves flavors, price and WhatsApp contact');
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  check(errors.length===0, 'No browser runtime exceptions');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, externalRequests: 'WhatsApp and trackers blocked; no messages sent' }, null, 2));
  console.log(`Combos browser: ${results.length} checks passed; screenshots in ${out}`);
}
