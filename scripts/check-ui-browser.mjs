// Local Chrome/CDP smoke tests; no npm packages and no production tracking.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const runLabel = process.argv[3] || phase;
if (!/^[a-z0-9-]+$/.test(runLabel)) throw new Error('Report label must use lowercase letters, digits and hyphens');
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
const live = process.env.UI_LIVE === '1';
const origin = live ? 'https://zadonipresentes.com.br' : `http://127.0.0.1:${server.address().port}`;
const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
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
  await cdp('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*', '*googleadservices.com*', '*doubleclick.net*', '*wa.me*', '*facebook.net*'] });
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/seo-baseline-before-ui.json'), 'utf8'));
  const pages = Object.keys(baseline.snapshot.pages).filter(p => !['links/index.html', 'monte-sua-cesta/index.html'].includes(p));
  const results = [];
  const widths = process.env.UI_MOBILE_ONLY === '1' ? [390] : [360, 390, 430, 540, 640, 768, 1024, 1280, 1440];
  for (const width of widths) {
    for (const page of pages) {
      errors = [];
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await cdp('Page.navigate', { url: `${origin}/${page}` });
      for (let i = 0; i < 100; i++) {
        if (await evaluate(`location.pathname.replace(/index\\.html$/, '') === ${JSON.stringify('/' + page.replace(/index\.html$/, ''))} && document.readyState === 'complete'`)) break;
        await pause(50);
      }
      await evaluate('document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))');
      const state = await evaluate(`(() => {
        const box = el => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav-menu');
        const wa = document.querySelector('.whatsapp-float');
        const logo = document.querySelector('.header-content .logo');
        const header = document.querySelector('header');
        const visible = el => !!el && el.getBoundingClientRect().height > 0;
        const targets = Array.from(document.querySelectorAll('.header-content a,.header-content button')).filter(visible);
        return {overflow: document.documentElement.scrollWidth > innerWidth + 1,
          header: header && box(header), logo: logo && box(logo), whatsapp: wa && box(wa),
          whatsappHref: wa?.href, toggleVisible: visible(toggle),
          navVisible: visible(nav), headerTargets: targets.map(el => ({label:el.getAttribute('aria-label') || el.textContent.trim(),...box(el)})),
          brokenImages: Array.from(document.images).filter(i => i.loading !== 'lazy' && i.complete && i.naturalWidth === 0).map(i => i.src)};
      })()`);
      const failures = [];
      if (state.overflow) failures.push('page horizontal overflow');
      if (errors.length) failures.push('JavaScript exception');
      if (state.brokenImages.length) failures.push('broken eager image');
      if (state.toggleVisible) {
        const interaction = await evaluate(`(() => {
          const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-menu');
          toggle.click(); const opened=toggle.getAttribute('aria-expanded')==='true' && nav.getBoundingClientRect().height>0;
          const links=Array.from(nav.querySelectorAll('a')); links[0].focus();
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
          return {opened, closed:toggle.getAttribute('aria-expanded')==='false', focusReturned:document.activeElement===toggle};
        })()`);
        if (!interaction.opened || !interaction.closed || !interaction.focusReturned) failures.push('mobile menu interaction');
        if (phase === 'after' && (!state.whatsapp || state.whatsapp.y + state.whatsapp.height > state.header.height + 1)) failures.push('WhatsApp outside mobile header');
        if (phase === 'after') {
          await evaluate("document.querySelector('.menu-toggle').focus(); document.querySelector('.menu-toggle').click()");
          await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
          await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
          if (!await evaluate("document.activeElement === document.querySelector('.nav-menu a')")) failures.push('Tab does not reach open menu');
          await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
          await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
          await evaluate("document.querySelector('.menu-toggle').click(); document.querySelector('.logo').focus()");
          if (!await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'")) failures.push('menu remains open after focus leaves');
          const ax = await cdp('Accessibility.getFullAXTree');
          if (!ax.nodes.some(n => n.role?.value === 'navigation' && n.name?.value === 'Navegação principal' && !n.ignored)) failures.push('navigation landmark missing');
        }
      }
      if (phase === 'after' && state.headerTargets.some(t => t.width < 43 || t.height < 43)) failures.push('header touch target below 44px');
      if (phase === 'after' && state.logo && state.whatsapp && state.toggleVisible && state.logo.x + state.logo.width > state.whatsapp.x + 1) failures.push('logo overlaps WhatsApp');
      if (phase === 'after' && page === 'index.html' && width === 390) {
        await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
        await pause(100);
        if (!await evaluate("!document.querySelector('.whatsapp-float').closest('header') && document.querySelectorAll('.whatsapp-float').length === 1")) failures.push('desktop WhatsApp restoration');
        await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
        await pause(100);
        await evaluate("document.querySelector('.menu-toggle').click()");
        if (!await evaluate("document.querySelector('.nav-menu').getBoundingClientRect().bottom <= innerHeight && document.querySelector('.nav-menu').clientHeight < document.querySelector('.nav-menu').scrollHeight")) failures.push('short viewport menu not scrollable');
        await evaluate("document.querySelector('.menu-toggle').click()");
        await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
        await pause(100);
        if (!await evaluate(`document.querySelector('.header-whatsapp')?.href === ${JSON.stringify(state.whatsappHref)} && document.querySelector('.header-whatsapp')?.dataset.track === 'whatsapp'`)) failures.push('WhatsApp message or tracking changed after resize');
        await evaluate("document.querySelector('.menu-toggle').click()");
        const menuShot = await cdp('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(out, 'menu-390.png'), Buffer.from(menuShot.data, 'base64'));
        await evaluate("document.querySelector('.menu-toggle').click()");
      }
      if (['index.html', 'cesta-cafe-da-manha-canaa/index.html'].includes(page) && [390, 1440].includes(width)) {
        const shot = await cdp('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(out, `${page === 'index.html' ? 'home' : 'cafe'}-${width}.png`), Buffer.from(shot.data, 'base64'));
      }
      const galleries = await evaluate(`Array.from(document.querySelectorAll('.seo-gallery-grid,.produtos-grid')).filter(g => g.clientWidth > 0).map(g => ({
        id:g.id, display:getComputedStyle(g).display, items:g.children.length,
        horizontal:g.scrollWidth > g.clientWidth + 1, role:g.getAttribute('aria-roledescription')
      }))`);
      state.galleries = galleries;
      if (phase === 'after' && galleries.some(g => g.horizontal || g.role === 'carrossel')) failures.push('catalog still uses horizontal carousel');
      if (width === 390 && galleries.length) {
        await evaluate("document.querySelector('.seo-gallery-grid,.produtos-grid').scrollIntoView({block:'start',behavior:'instant'})");
        await pause(250);
        const shot = await cdp('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(out, `${page.replaceAll('/', '-').replace('.html', '')}-gallery.png`), Buffer.from(shot.data, 'base64'));
        await evaluate("window.scrollTo({top:0,behavior:'instant'})");
      }
      if (phase === 'after' && width < 768) {
        state.filters = await evaluate(`(() => {
          const filters=Array.from(document.querySelectorAll('.filtro-btn'));
          const results=filters.map(button => {button.click(); const grid=document.getElementById('produtos-container');
            return {label:button.textContent.trim(),count:grid?.children.length || 0,horizontal:!!grid && grid.scrollWidth > grid.clientWidth+1};});
          filters[0]?.click(); return results;
        })()`);
        if (state.filters.some(f => f.horizontal || f.count === 0)) failures.push('category filter has empty or horizontal results');
        state.addons = await evaluate(`(() => {
          const trigger=document.querySelector('.btn-adicionais-modelo'); if(!trigger) return null;
          trigger.click(); const panel=document.getElementById(trigger.getAttribute('aria-controls'));
          const opened=panel?.getAttribute('aria-hidden')==='false';
          const input=panel?.querySelector('input[type=checkbox]');
          const model=trigger.closest('figure,.produto-card');
          const links=() => Array.from(model?.querySelectorAll('a[href*="wa.me/"]') || []).map(a => a.href).join('|');
          const original=links(); let updated=true,restored=true;
          if(input) {input.click(); updated=links()!==original; input.click(); restored=links()===original;}
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
          return {opened,closed:panel?.getAttribute('aria-hidden')==='true',focusReturned:document.activeElement===trigger,updated,restored};
        })()`);
        if (state.addons && Object.values(state.addons).some(v => !v)) failures.push('addons modal or WhatsApp message regression');
        await evaluate("window.scrollTo({top:0,behavior:'instant'})");
      }
      results.push({ page, width, ...state, errors: [...errors], failures });
    }
    console.log(`${phase}: checked ${pages.length} pages at ${width}px`);
  }
  const failed = results.filter(r => r.failures.length);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ phase, browser: await call('Browser.getVersion'), capturedAt: new Date().toISOString(), scope: `${live ? 'production' : 'local'} Chromium; tracking blocked; no WhatsApp messages sent`, cases: results.length, failedCases: failed.length, results }, null, 2) + '\n');
  console.log(`${results.length} browser cases; ${failed.length} failed`);
  for (const row of failed) console.log(`${row.page} ${row.width}: ${row.failures.join(', ')}`);
  if (failed.length) process.exitCode = 1;
  await call('Browser.close');
} finally {
  socket?.close();
  child.kill();
  server.close();
}
