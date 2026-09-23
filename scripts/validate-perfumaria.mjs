import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(), file=path.join(root,'perfumaria-cosmeticos-canaa/index.html');
const html=fs.readFileSync(file,'utf8');
assert.equal((html.match(/<h1>/g)||[]).length,1);
assert.equal((html.match(/id="perfume-\d+"/g)||[]).length,5);
assert.equal((html.match(/Imagem em breve/g)||[]).length,4);
assert(!html.includes('schema.org/InStock'));
assert(!html.includes('aggregateRating'));
for(const [,data] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(data);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size);
for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(ref.startsWith('#'))assert(ids.includes(ref.slice(1)),`Missing anchor ${ref}`);
 else if(!/^https?:/.test(ref)){
  const localPath=ref.split(/[?#]/)[0];
  let target=path.resolve(path.dirname(file),localPath);
  if(localPath.endsWith('/'))target=path.join(target,'index.html');
  assert(fs.existsSync(target),`Missing asset/link ${ref}`);
 }
 if(ref.startsWith('https://wa.me/')){
  const u=new URL(ref.replaceAll('&amp;','&'));
  assert.equal(u.pathname,'/5594992993138');
  assert(u.searchParams.get('text').includes('perfumaria da Zadoni'));
 }
}
for(const f of ['index.html','rosas-perfumadas-canaa/index.html'])assert.equal((fs.readFileSync(f,'utf8').match(/id="perfumaria-discovery"/g)||[]).length,1);
assert.equal((fs.readFileSync('sitemap.xml','utf8').match(/<loc>https:\/\/zadonipresentes.com.br\/perfumaria-cosmeticos-canaa\/<\/loc>/g)||[]).length,1);
console.log('Perfumaria: metadata, 5 products, 4 placeholders, anchors, assets, WhatsApp and discovery links passed.');
