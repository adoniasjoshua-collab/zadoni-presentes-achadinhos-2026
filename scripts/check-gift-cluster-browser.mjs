// Local Chrome/CDP smoke tests; no npm packages and no production tracking.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const runLabel = process.argv[2] || 'gift-cluster-20260926';
if (!/^[a-z0-9-]+$/.test(runLabel)) throw new Error('Invalid report label');
const out = path.join(root, 'docs', `ui-${runLabel}`);
if (fs.existsSync(out) && fs.readdirSync(out).length) throw new Error(`Historical browser report already exists: ${out}`);
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(path.join(root, '.tmp'), { recursive: true });
const profile = fs.mkdtempSync(path.join(root, '.tmp', 'chrome-'));
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const target = path.resolve(root, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(x => x.startsWith('.'))) {
    res.writeHead(403).end(); return;
  }
  try { res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }).end(fs.readFileSync(target)); }
  catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const live = false;
const origin = live ? 'https://zadonipresentes.com.br' : `http://127.0.0.1:${server.address().port}`;
const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; !fs.existsSync(portFile) && i < 100; i++) await pause(100);
  const [port, endpoint] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
  socket = new WebSocket(`ws://127.0.0.1:${port}${endpoint}`);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  let errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      clearTimeout(timer); pending.delete(message.id);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description || ''));
  };
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => call(method, params, sessionId);
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');
  await cdp('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*', '*googleadservices.com*', '*doubleclick.net*', '*wa.me*', '*facebook.net*', '*facebook.com*'] });
  const results = [];
  const pages = ['presentes-de-natal-canaa-dos-carajas', 'guias-de-presentes', 'mensagens-para-acompanhar-presentes'];
  async function navigate(slug) {
    await cdp('Page.navigate', { url: origin + '/' + slug + '/' });
    for (let i = 0; i < 80; i++) {
      if (await evaluate(`location.pathname === '/${slug}/' && document.readyState === 'complete'`)) return;
      await pause(100);
    }
    throw new Error('Navigation timeout: ' + slug);
  }
  function check(value, message) { if (!value) throw new Error(message); }
  for (const slug of pages) {
    for (const width of [360, 390, 412, 768, 1440]) {
      errors = [];
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await navigate(slug);
      // Force lazy images only in the test so decoding offscreen assets can finish.
      await evaluate(`Promise.all(Array.from(document.images).map(i => { i.loading = 'eager'; return i.decode().catch(() => null); }))`);
      const state = await evaluate(`(() => {
        const visible = e => e.getClientRects().length > 0;
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          images: [...document.images].filter(visible).every(i => i.naturalWidth > 0),
          intrinsicRatio: [...document.images].filter(visible).every(i => Math.abs(i.naturalWidth / i.naturalHeight - Number(i.getAttribute('width')) / Number(i.getAttribute('height'))) < .01),
          h1: document.querySelectorAll('h1').length,
          tapTargets: [...document.querySelectorAll('.btn, .gift-nav a, button, select, textarea, summary')].filter(visible).every(e => e.getBoundingClientRect().height >= 44),
          formReady: !document.querySelector('[data-gift-form]') || !document.querySelector('[data-gift-form]').hidden,
          labels: [...document.querySelectorAll('select,textarea')].every(e => e.labels.length > 0)
        };
      })()`);
      const screenshot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      fs.writeFileSync(path.join(out, `${slug}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
      results.push({ slug, width, ...state, errors: [...errors] });
      check(!state.overflow && state.images && state.intrinsicRatio && state.h1 === 1 && state.tapTargets && state.formReady && state.labels && !errors.length, JSON.stringify(results.at(-1)));
    }
  }
  // Test the actual href and existing click handlers while cancelling navigation.
  // External requests are blocked throughout, so no analytics or message is sent.
  for (const slug of pages.slice(1)) {
    await cdp('Emulation.setDeviceMetricsOverride', { width: 360, height: 900, deviceScaleFactor: 1, mobile: true });
    await navigate(slug);
    check(await evaluate(`(() => { document.querySelector('button[type=submit]').click(); return document.querySelector('[data-gift-summary]').hidden; })()`), 'Empty form must not generate a summary');
    const flow = await evaluate(`(() => {
      const form = document.querySelector('form');
      const values = { recipient: 'Mãe', occasion: 'Aniversário', style: 'Café da manhã', budget: 'Até R$80', message: 'Escrever minha mensagem', fulfillment: 'Consultar entrega' };
      Object.entries(values).forEach(([key, value]) => { form.elements.namedItem(key).value = value; });
      form.dispatchEvent(new Event('change', { bubbles: true }));
      form.elements.namedItem('custom-message').value = 'Mãe, você é especial! 💝 & + # ?';
      form.elements.namedItem('notes').value = '<img src=x onerror=alert(1)> Sem açúcar & café + pão?';
      form.requestSubmit();
      const box = document.querySelector('[data-gift-summary]');
      const send = document.querySelector('[data-gift-send]');
      const url = new URL(send.href);
      const text = box.querySelector('pre').textContent;
      let clicked = false;
      window.gtag = function(...args) { (window.__testCalls ||= []).push(args); };
      send.addEventListener('click', e => { e.preventDefault(); clicked = true; });
      send.click();
      const calls = window.__testCalls || [];
      return { visible: !box.hidden, roundTrip: url.searchParams.get('text') === text,
        phone: url.pathname, utm: url.searchParams.get('utm_campaign'),
        safe: !box.querySelector('pre img'), text, clicked,
        conversionCount: calls.filter(c => c[0] === 'event' && c[1] === 'conversion').length,
        privateFieldsNotTracked: !JSON.stringify(calls).includes('Sem açúcar'),
        focus: document.activeElement === box.querySelector('h3'),
        overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    })()`);
    check(flow.visible && flow.roundTrip && flow.phone === '/5594992993138' && flow.utm === 'seo_local' && flow.safe && flow.clicked && flow.conversionCount === 1 && flow.privateFieldsNotTracked && flow.focus && !flow.overflow && flow.text.includes('Mãe, você é especial! 💝 & + # ?'), JSON.stringify(flow));
    check(await evaluate(`(() => { const f=document.querySelector('form'); f.elements.namedItem('budget').value='Acima de R$200'; f.dispatchEvent(new Event('change',{bubbles:true})); return document.querySelector('[data-gift-summary]').hidden; })()`), 'Changed answers must invalidate the old summary');
    check(await evaluate(`(() => { const f=document.querySelector('form'); f.elements.namedItem('custom-message').value=' '; f.requestSubmit(); return document.querySelector('[data-gift-summary]').hidden; })()`), 'Whitespace message must fail');
    await evaluate(`(() => { const f=document.querySelector('form'); f.elements.namedItem('custom-message').value='Com carinho'; f.elements.namedItem('custom-message').dispatchEvent(new Event('input',{bubbles:true})); f.requestSubmit(); })()`);
    check(await evaluate(`!document.querySelector('[data-gift-summary]').hidden`), 'Corrected custom message must recover');
    results.push({ slug, flow: 'encoding, custom text, validation, safe rendering, invalidation, tracking and recovery passed' });
  }
  await navigate(pages[2]);
  const choices = await evaluate(`(() => {
    const form=document.querySelector('form');
    form.elements.namedItem('recipient').value = 'Mãe';
    form.elements.namedItem('occasion').value = 'Natal';
    return [...document.querySelectorAll('[data-use-message]')].map(button => {
      button.click();
      return form.elements.namedItem('message').value === button.dataset.useMessage
        && form.elements.namedItem('occasion').value === 'Natal'
        && form.elements.namedItem('recipient').value === 'Mãe'
        && new URL(document.querySelector('[data-message-send]').href).searchParams.get('text').includes(button.dataset.useMessage)
        && document.activeElement === form.elements.namedItem('recipient');
    });
  })()`);
  check(choices.length === 7 && choices.every(Boolean), 'Every original message must be selectable');
  async function go(route) {
    await cdp('Page.navigate', { url: origin + route });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`location.href === ${JSON.stringify(origin + route)} && document.readyState === 'complete'`)) return;
      await pause(100);
    }
    throw new Error('Navigation timeout: ' + route);
  }
  // Session continuation, explicit choices, context and clearing.
  await go('/guias-de-presentes/?ocasiao=natal');
  check(await evaluate(`document.querySelector('#recipient').value === 'Mãe' && document.querySelector('#occasion').value === 'Natal' && !document.querySelector('#notes').value && !document.querySelector('#custom-message').value`), 'Continue preferences without persisting free text');
  await evaluate(`document.querySelector('form').reset()`); await pause(50);
  await go('/guias-de-presentes/?ocasiao=natal');
  check(await evaluate(`document.querySelector('#occasion').value === 'Natal' && !document.querySelector('#recipient').value`), 'Christmas context after clearing');
  await go('/guias-de-presentes/#contexto=buques-canaa-dos-carajas');
  check(await evaluate(`document.querySelector('form').textContent.includes('Você veio de: Buquês')`), 'Category context');
  await evaluate(`document.querySelector('#occasion').value='Aniversário'; document.querySelector('#occasion').dispatchEvent(new Event('change',{bubbles:true}))`);
  await go('/guias-de-presentes/?ocasiao=natal');
  check(await evaluate(`document.querySelector('#occasion').value === 'Aniversário'`), 'Suggested context must preserve explicit choice');
  const entryPages = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'docs/seo-release-20260923.json'), 'utf8')).snapshot.pages);
  for (const file of entryPages) {
    for (const width of [390, 1440]) {
      errors = [];
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await go('/' + file.replace(/index\.html$/, ''));
      const state = await evaluate(`(() => {
        const bar=document.querySelector('.journey-help');
        const rect=bar.getBoundingClientRect();
        return { overflow:document.documentElement.scrollWidth>innerWidth+1, top:rect.top, bottom:rect.bottom,
          help:!!bar.querySelector('a[href*="guias-de-presentes"]'),
          contact:!!bar.querySelector('a[href*="wa.me"]'),
          targets:[...bar.querySelectorAll('a')].every(a=>a.getBoundingClientRect().height>=44) };
      })()`);
      check(!state.overflow && state.help && state.targets && state.top >= 0 && state.bottom < 900 && (!file.startsWith('achadinhos/') ? state.contact : true) && !errors.length, file + ': ' + JSON.stringify(state) + errors.join(','));
      results.push({ entry:file, width, ...state });
      if (['index.html','monte-sua-cesta/index.html','perfumaria-cosmeticos-canaa/index.html'].includes(file)) {
        const shot=await cdp('Page.captureScreenshot', { format:'png' });
        fs.writeFileSync(path.join(out, 'entry-'+file.replace(/[^a-z0-9]/g,'-')+'-'+width+'.png'),Buffer.from(shot.data,'base64'));
      }
    }
  }
  await go('/presentes-canaa.html');
  check(await evaluate(`(async () => {
    const search=document.querySelector('#ux-search'); search.value='zzzz-inexistente'; search.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(resolve => setTimeout(resolve, 300));
    const clear=document.querySelector('[data-clear-empty]'); const box=clear.parentElement;
    const empty=!box.hidden && !!box.querySelector('a[href*="guias-de-presentes"]') && !!box.querySelector('a[href*="wa.me"]');
    clear.click(); return empty && search.value === '' && box.hidden;
  })()`), 'Empty search offers help/contact and working reset');
  results.push({ continuation:'passed', contextualEntry:'passed', explicitChoices:'preserved', emptySearch:'passed' });
  // Native keyboard navigation and visible focus.
  await navigate(pages[1]);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  check(await evaluate(`document.activeElement.classList.contains('skip-link') && getComputedStyle(document.activeElement).outlineStyle !== 'none'`), 'Keyboard skip link focus');
  // Form enhancement failure: static content and direct WhatsApp stay usable.
  const blocks = ['*googletagmanager.com*', '*google-analytics.com*', '*googleadservices.com*', '*doubleclick.net*', '*wa.me*', '*facebook.net*', '*facebook.com*'];
  await cdp('Network.setBlockedURLs', { urls: [...blocks, '*gift-guides.js*'] });
  await navigate(pages[1]);
  check(await evaluate(`document.querySelector('[data-gift-form]').hidden && [...document.querySelectorAll('a[href*="wa.me"]')].some(a => a.getClientRects().length && a.href.includes('text='))`), 'Script failure fallback');
  await cdp('Network.setBlockedURLs', { urls: blocks });
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  for (const slug of pages) {
    await navigate(slug);
    check(await evaluate(`document.querySelector('h1').textContent.length > 0 && [...document.querySelectorAll('a[href*="wa.me"]')].some(a => a.getClientRects().length) && [...document.querySelectorAll('.gift-nav a')].every(a => a.getClientRects().length)`), 'No-JS content, navigation and CTA: ' + slug);
  }
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  results.push({ keyboard: 'passed', originalMessages: 7, noJavaScript: '3 pages passed', failedEnhancementFallback: 'passed', externalRequests: 'blocked' });
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2));
  console.log('Gift cluster: 15 responsive checks, 2 full WhatsApp flows, 7 messages, keyboard and no-JS/script-failure fallbacks passed; external tracking blocked.');
  await call('Browser.close');
} finally { socket?.close(); child.kill(); server.close(); }
