// Local Chrome/CDP smoke tests; no npm packages and no production tracking.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const runLabel = process.argv[2] || 'combos-20260928';
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
  const { run } = await import('./combos-browser-scenarios.mjs');
  await run({ cdp, evaluate, origin, out, errors, pause });
  await call('Browser.close');
} finally { socket?.close(); child.kill(); server.close(); }
