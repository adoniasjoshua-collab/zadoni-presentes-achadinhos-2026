import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = {
  window: {},
  URLSearchParams
};

for (const file of [
  "monte-sua-cesta/js/configuracao.js",
  "monte-sua-cesta/js/modelos.js",
  "monte-sua-cesta/js/whatsapp.js"
]) {
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

const cesta = context.window.ZadoniCesta;
const expectedTiers = [
  ["basica", "Básica", 18900],
  ["intermediaria", "Intermediária", 27000],
  ["premium", "Premium", 30000]
];

assert.equal(cesta.config.niveisMontagem.length, 3);
assert.equal(
  JSON.stringify(cesta.config.niveisMontagem.map(({ id, nome, preco }) => [id, nome, preco])),
  JSON.stringify(expectedTiers)
);
assert.equal(cesta.modelos.length, 3);

for (const modelo of cesta.modelos) {
  for (const nivel of cesta.config.niveisMontagem) {
    const estado = {
      modelo: modelo.id,
      nivel: nivel.id,
      preferencias: {
        ocasiao: "Aniversário",
        dataEntrega: "2026-08-25",
        observacoes: "Prefere tons de rosa"
      }
    };
    const mensagem = cesta.whatsapp.gerarMensagem(estado);

    assert.match(mensagem, new RegExp(`Modelo: ${modelo.nome}`));
    assert.match(mensagem, new RegExp(`Versão: ${nivel.nome}`));
    assert.ok(mensagem.includes(nivel.precoLabel));
    assert.ok(mensagem.includes(modelo.urlPublica));
    assert.equal(new URL(cesta.whatsapp.criarUrl(estado)).searchParams.get("text"), mensagem);
  }
}

const interfaceSource = fs.readFileSync("monte-sua-cesta/js/interface.js", "utf8");
const storageSource = fs.readFileSync("monte-sua-cesta/js/storage.js", "utf8");
assert.ok(interfaceSource.includes('data-action="selecionar-nivel"'));
assert.ok(interfaceSource.includes('id="niveis-montagem"'));
assert.ok(storageSource.includes("versao: 3"));

console.log("Cesta budget tiers validation ok: 3 models x 3 tiers = 9 combinations");
