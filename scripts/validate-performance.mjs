import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function htmlFiles(directory = ROOT) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.name.endsWith(".html") ? [target] : [];
  });
}

for (const file of htmlFiles()) {
  const relative = path.relative(ROOT, file).replaceAll("\\", "/");
  const source = fs.readFileSync(file, "utf8");
  const head = source.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || "";

  for (const match of head.matchAll(/<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi)) {
    const attributes = `${match[1]} ${match[3]}`;
    const src = match[2];
    if (/^(?:https?:)?\/\//i.test(src)) continue;
    assert.match(attributes, /\b(?:defer|async)\b/i, `${relative}: script local bloqueando renderização: ${src}`);
  }

  for (const [image] of source.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(image, /\bwidth=["']\d+["']/i, `${relative}: imagem sem width`);
    assert.match(image, /\bheight=["']\d+["']/i, `${relative}: imagem sem height`);
    assert.match(image, /\bloading=["'](?:lazy|eager)["']/i, `${relative}: imagem sem política de loading`);
    assert.match(image, /\bdecoding=["']async["']/i, `${relative}: imagem sem decoding async`);
  }

  for (const [anchor] of source.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi)) {
    assert.match(anchor, /\brel=["'][^"']*noopener/i, `${relative}: target=_blank sem noopener`);
  }

  assert.ok(!/href=["'][^"']*\?categoria=/i.test(source), `${relative}: link interno com parâmetro de categoria rastreável`);
}

console.log("Performance validation ok: scripts locais não bloqueiam o head, imagens têm dimensões e links de filtro usam fragmentos.");
