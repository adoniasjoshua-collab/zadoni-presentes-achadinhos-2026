import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const sourcePath = path.join(root, "assets", "data", "produtos.js");
const source = `${fs.readFileSync(sourcePath, "utf8")};globalThis.__catalogo = { produtosLocais, adicionaisBuques, adicionaisCestas, adicionaisCafeManha, adicionaisCestasCafe };`;
const appSource = fs.readFileSync(path.join(root, "assets", "js", "app.js"), "utf8");
const catalogHtml = fs.readFileSync(path.join(root, "presentes-canaa.html"), "utf8");
const montadorSource = fs.readFileSync(path.join(root, "monte-sua-cesta", "js", "produtos.js"), "utf8");
const context = {};

vm.createContext(context);
vm.runInContext(source, context, { filename: sourcePath });

const { produtosLocais, adicionaisBuques, adicionaisCestas, adicionaisCafeManha, adicionaisCestasCafe } = context.__catalogo;
const adicionais = [...adicionaisBuques, ...adicionaisCestas, ...adicionaisCafeManha];
const falhas = [];

function verificar(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
}

function obterProduto(id) {
  return produtosLocais.find((produto) => produto.id === id);
}

function obterAdicional(id) {
  return adicionais.find((adicional) => adicional.id === id);
}

function caminhoImagemExiste(imagem) {
  return !imagem || fs.existsSync(path.join(root, imagem));
}

verificar(produtosLocais.filter((produto) => produto.destaque).length === 35, "A categoria Destaques deve conter 35 produtos.");
verificar(catalogHtml.includes('id="catalog-results-count"'), "O catalogo deve exibir a contagem de resultados dos filtros.");
verificar(appSource.includes("atualizarContagemProdutos(lista, categoria)"), "A contagem dos filtros deve ser atualizada pelo aplicativo.");
verificar(adicionaisCestasCafe.length === 22, "Cestas de cafe devem oferecer 22 adicionais sem repetir o mini bolo.");
verificar(adicionaisCestasCafe.filter((adicional) => adicional.nome.includes("Mini bolo")).length === 1, "O mini bolo deve aparecer uma unica vez nas cestas de cafe.");
verificar(!produtosLocais.some((produto) => produto.id === 47), "A caixinha com 3 Ferrero nao pode permanecer no catalogo publico.");
verificar(!adicionais.some((adicional) => adicional.id === "caixinha-tres-ferrero"), "A caixinha com 3 Ferrero nao pode permanecer nas listas de adicionais.");

for (const produto of produtosLocais.filter((item) => ["Cestas", "Kits", "Mimos"].includes(item.categoria))) {
  const quantidadeEsperada = produto.nome.toLowerCase().includes("cafe") ? 22 : 11;
  verificar(produto.adicionaisOpcionais?.length === quantidadeEsperada, `${produto.nome} deve oferecer ${quantidadeEsperada} adicionais.`);
}

verificar(produtosLocais.filter((produto) => produto.categoria === "Adicionais").length === 12, "A categoria pública Adicionais deve conter 12 produtos.");
verificar(adicionais.length === 30, "As listas contextuais devem manter 30 posições de adicionais.");

for (const produto of produtosLocais) {
  verificar(Number.isFinite(produto.preco) && produto.preco > 0, `Preço inválido no produto ${produto.id}.`);
  verificar(Boolean(produto.nome && produto.descricao), `Nome ou descrição ausente no produto ${produto.id}.`);
  verificar(Boolean(produto.imagem), `Imagem ausente no produto público ${produto.id}.`);
  verificar(caminhoImagemExiste(produto.imagem), `Imagem inexistente no produto ${produto.id}: ${produto.imagem}`);
}

for (const adicional of adicionais) {
  verificar(Number.isFinite(adicional.preco) && adicional.preco > 0, `Preço inválido no adicional ${adicional.id}.`);
  verificar(Boolean(adicional.nome), `Nome ausente no adicional ${adicional.id}.`);
  verificar(caminhoImagemExiste(adicional.imagem), `Imagem inexistente no adicional ${adicional.id}: ${adicional.imagem}`);
}

const nomesVagosRemovidos = [
  "Pão francês",
  "Mini croissant",
  "Salgados variados",
  "Nutella",
  "Bolo simples",
  "Requeijão",
  "Queijo fatiado",
  "Achocolatado",
  "Leite Piracanjuba",
  "Iogurte",
  "Biscoitos",
  "Rosa branca"
];

for (const nome of nomesVagosRemovidos) {
  verificar(!adicionais.some((adicional) => adicional.nome === nome), `Nome vago ainda ativo: ${nome}.`);
}

verificar(!obterAdicional("foto-impressa").imagem, "Foto impressa não pode usar imagem de outro presente.");
verificar(obterAdicional("foto-impressa").preco === 15, "Foto impressa para buques deve custar R$ 15.");
verificar(obterAdicional("foto-impressa-cesta").preco === 15, "Foto impressa para cestas deve custar R$ 15.");
verificar(/id:'fotos-impressas'[^\n]*preco:1500/.test(montadorSource), "Fotografias impressas no montador devem custar R$ 15.");
verificar(/id:'balao'[^\n]*preco:1000/.test(montadorSource), "Balao decorativo no montador deve custar R$ 10.");

const precosCompartilhados = [
  [46, ["ferrero-rocher", "ferrero-rocher-cesta"]],
  [48, ["ursinho-chaveiro"]],
  [49, ["cartao-personalizado", "cartao-personalizado-cesta"]],
  [38, ["mini-bolo-cesta", "mini-bolo-cafe"]],
  [39, ["salgados-variados-cesta"]],
  [40, ["nutella-cesta"]],
  [41, ["bolo-simples-cafe"]],
  [43, ["suco-uva-aurora-cesta"]],
  [44, ["rosa-branca-cafe"]],
  [50, ["ferrero-rocher-12-cesta"]],
  [51, ["barrinha-cacau-show-cesta"]]
];

for (const [produtoId, adicionalIds] of precosCompartilhados) {
  const produto = obterProduto(produtoId);
  verificar(Boolean(produto), `Produto público ${produtoId} não encontrado.`);
  for (const adicionalId of adicionalIds) {
    const adicional = obterAdicional(adicionalId);
    verificar(Boolean(adicional), `Adicional ${adicionalId} não encontrado.`);
    if (produto && adicional) {
      verificar(produto.preco === adicional.preco, `Preço divergente entre ${produto.nome} e ${adicional.id}.`);
    }
  }
}

if (falhas.length) {
  console.error("Falhas de clareza do catálogo:");
  falhas.forEach((falha) => console.error(`- ${falha}`));
  process.exit(1);
}

console.log(`Catálogo validado: ${produtosLocais.length} produtos, 12 itens avulsos públicos e ${adicionais.length} posições de adicionais sem divergências críticas.`);
