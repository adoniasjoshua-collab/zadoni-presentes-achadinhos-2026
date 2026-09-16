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
  await cdp('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*', '*googleadservices.com*', '*doubleclick.net*', '*wa.me*', '*facebook.net*'] });
  const results=[];
  for(const width of [360,390,768,1440]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
    await cdp('Page.navigate',{url:origin+'/perfumaria-cosmeticos-canaa/'});
    await pause(700);
    await evaluate("Promise.all(Array.from(document.images).map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))");
    const state=await evaluate(`(() => {const d=document.querySelector('details'); d.open=true; return {overflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:Array.from(document.images).filter(i=>!i.naturalWidth).map(i=>i.src),faqOpen:d.open,h1:document.querySelectorAll('h1').length,buttons:document.querySelectorAll('.pf-button').length}})()`);
    await evaluate("document.querySelector('details').open=false");
    const shot=await cdp('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(out,`perfumaria-${width}.png`),Buffer.from(shot.data,'base64'));
    results.push({width,...state,errors:[...errors]});
  }
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
  if(results.some(r=>r.overflow||r.brokenImages.length||r.errors.length||!r.faqOpen||r.h1!==1))throw new Error('Browser checks failed');
  console.log('4 browser viewports passed; tracking blocked and no messages sent.');
  await call('Browser.close');
} finally {socket?.close();child.kill();server.close();}
