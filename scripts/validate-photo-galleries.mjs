import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = new Map([
  ["index.html", { galleries: 0, deliveries: 5 }],
  ["presentes-canaa.html", { galleries: 0, deliveries: 5 }],
  ["presentes-canaa-dos-carajas/index.html", { galleries: 0, deliveries: 5 }],
  ["cesta-cafe-da-manha-canaa/index.html", { galleries: 12, deliveries: 0 }],
  ["buques-canaa-dos-carajas/index.html", { galleries: 4, deliveries: 0 }],
  ["cestas-de-presente-canaa/index.html", { galleries: 3, deliveries: 0 }],
  ["cesta-de-aniversario-canaa/index.html", { galleries: 4, deliveries: 0 }],
  ["floricultura-canaa-dos-carajas/index.html", { galleries: 3, deliveries: 0 }],
  ["presentes-romanticos-canaa/index.html", { galleries: 3, deliveries: 0 }]
]);

const referencedAssets = new Set();

for (const [page, expected] of pages) {
  const source = fs.readFileSync(path.join(root, page), "utf8");
  const galleryCount = (source.match(/class="seo-gallery-item"/g) || []).length;
  const deliveryCount = (source.match(/class="entrega-real-card"/g) || []).length;

  assert.equal(galleryCount, expected.galleries, `${page}: quantidade incorreta de fotos na galeria`);
  assert.equal(deliveryCount, expected.deliveries, `${page}: quantidade incorreta de registros de entrega`);
  assert.ok(!source.includes("assets/img/comentarios instagram/"), `${page}: captura antiga de comentario ainda publicada`);
  assert.ok(!source.includes("Fotos adicionais para incluir"), `${page}: arquivo original nao tratado foi referenciado`);

  for (const match of source.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url.includes("assets/img/galerias/") && !url.includes("assets/img/prova-social/")) continue;

      const clean = url.replace(/^\.\.\//, "");
      referencedAssets.add(clean);
      assert.ok(fs.existsSync(path.join(root, clean)), `${page}: imagem ausente ${clean}`);
    }
  }

  for (const match of source.matchAll(/<img[^>]+src="[^"]*(?:galerias|prova-social)[^"]*"[^>]*>/g)) {
    assert.match(match[0], /alt="[^"]{12,}"/, `${page}: imagem sem texto alternativo descritivo`);
    assert.match(match[0], /width="720" height="900"/, `${page}: imagem sem dimensoes reservadas`);
  }
}

const generatedFiles = [
  ...fs.readdirSync(path.join(root, "assets/img/galerias/buques")).map((name) => `assets/img/galerias/buques/${name}`),
  ...fs.readdirSync(path.join(root, "assets/img/galerias/cestas")).map((name) => `assets/img/galerias/cestas/${name}`),
  ...fs.readdirSync(path.join(root, "assets/img/galerias/cestas-aniversario")).map((name) => `assets/img/galerias/cestas-aniversario/${name}`),
  ...fs.readdirSync(path.join(root, "assets/img/galerias/romanticos")).map((name) => `assets/img/galerias/romanticos/${name}`),
  ...fs.readdirSync(path.join(root, "assets/img/prova-social/entregas-canaa")).map((name) => `assets/img/prova-social/entregas-canaa/${name}`)
];

assert.equal(generatedFiles.length, 34, "Devem existir 17 fotos tratadas em duas resolucoes");
generatedFiles.forEach((file) => {
  const stats = fs.statSync(path.join(root, file));
  assert.ok(stats.size > 10_000, `${file}: arquivo pequeno ou invalido`);
  assert.ok(stats.size < 150_000, `${file}: arquivo acima do limite de 150 KB`);
  assert.ok(referencedAssets.has(file), `${file}: imagem tratada sem uso nas paginas`);
});

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
assert.ok(gitignore.includes("/Fotos adicionais para incluir/"), "A pasta com originais deve ficar fora do deploy");

console.log(`Galerias validadas: ${generatedFiles.length} arquivos WebP e ${referencedAssets.size} referencias publicas.`);
