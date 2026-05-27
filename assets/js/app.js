/**
 * Zadoni - app.js
 * Renderizacao de produtos locais, achadinhos afiliados e eventos de tracking.
 */

(function () {
  var CONFIG = {
    whatsappNumber: "5594992993138",
    moeda: "BRL",
    locale: "pt-BR"
  };

  function getProdutosLocais() {
    return typeof produtosLocais !== "undefined" && Array.isArray(produtosLocais)
      ? produtosLocais
      : [];
  }

  function getAchadinhos() {
    return typeof achadinhos !== "undefined" && Array.isArray(achadinhos)
      ? achadinhos
      : [];
  }

  function removerAcentos(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function formatarPreco(preco) {
    return Number(preco || 0).toLocaleString(CONFIG.locale, {
      style: "currency",
      currency: CONFIG.moeda
    });
  }

  function gerarLinkWhatsApp(produto) {
    var mensagem = produto && produto.whatsappMensagem
      ? produto.whatsappMensagem
      : "Ola! Tenho interesse no produto " + (produto ? produto.nome : "Zadoni") + ".";

    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(mensagem);
  }

  function obterEmojiProduto(produto) {
    var categoria = removerAcentos(produto.categoria);
    var nome = removerAcentos(produto.nome);

    if (categoria.includes("flor") || nome.includes("buque")) return "💐";
    if (categoria.includes("kit") || nome.includes("romantico")) return "💕";
    if (categoria.includes("perfume")) return "💜";
    if (categoria.includes("cesta")) return "🎁";
    return "🎁";
  }

  function criarImagemProduto(produto, classe) {
    var wrapper = document.createElement("div");
    wrapper.className = classe;

    if (produto.imagem) {
      var img = document.createElement("img");
      img.src = produto.imagem;
      img.alt = produto.nome;
      img.loading = "lazy";
      img.onerror = function () {
        wrapper.textContent = obterEmojiProduto(produto);
        wrapper.classList.add("imagem-placeholder");
      };
      wrapper.appendChild(img);
    } else {
      wrapper.textContent = obterEmojiProduto(produto);
    }

    return wrapper;
  }

  function criarCardProdutoLocal(produto) {
    var card = document.createElement("article");
    card.className = "produto-card";
    card.dataset.produtoId = produto.id;

    var imagem = criarImagemProduto(produto, "produto-imagem");

    var categoria = document.createElement("span");
    categoria.className = "produto-categoria";
    categoria.textContent = produto.categoria;
    imagem.appendChild(categoria);

    var conteudo = document.createElement("div");
    conteudo.className = "produto-content";

    var nome = document.createElement("h3");
    nome.className = "produto-nome";
    nome.textContent = produto.nome;

    var descricao = document.createElement("p");
    descricao.className = "produto-descricao";
    descricao.textContent = produto.descricao;

    var preco = document.createElement("div");
    preco.className = "produto-preco";
    preco.textContent = formatarPreco(produto.preco);

    var acoes = document.createElement("div");
    acoes.className = "produto-acoes";

    var whatsapp = document.createElement("a");
    whatsapp.className = "btn-whatsapp-produto";
    whatsapp.href = gerarLinkWhatsApp(produto);
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.textContent = "Pedir no WhatsApp";
    whatsapp.addEventListener("click", function () {
      trackWhatsAppClick(produto);
    });

    card.addEventListener("mouseenter", function () {
      trackViewContent(produto);
    }, { once: true });

    acoes.appendChild(whatsapp);
    conteudo.append(nome, descricao, preco, acoes);
    card.append(imagem, conteudo);

    return card;
  }

  function renderizarProdutosLocais(lista) {
    var container = document.getElementById("produtos-container");
    var vazio = document.getElementById("sem-produtos");

    if (!container) return;

    container.innerHTML = "";

    if (!lista.length) {
      container.style.display = "none";
      if (vazio) vazio.style.display = "block";
      return;
    }

    container.style.display = "grid";
    if (vazio) vazio.style.display = "none";

    lista.forEach(function (produto, index) {
      var card = criarCardProdutoLocal(produto);
      card.style.animation = "fadeIn 0.45s ease both";
      card.style.animationDelay = (index * 0.04) + "s";
      container.appendChild(card);
    });
  }

  function categoriaCombina(produto, categoria) {
    var filtro = removerAcentos(categoria);
    var nome = removerAcentos(produto.nome);
    var categoriaProduto = removerAcentos(produto.categoria);
    var descricao = removerAcentos(produto.descricao);

    if (!filtro || filtro === "todos") return true;
    if (filtro.includes("buqu")) return categoriaProduto.includes("flor") || nome.includes("buque");
    if (filtro.includes("kit")) return categoriaProduto.includes("kit") || nome.includes("kit");
    if (filtro.includes("perfume")) return categoriaProduto.includes("perfume") || nome.includes("perfume");
    if (filtro.includes("promo")) return Boolean(produto.destaque);

    return categoriaProduto.includes(filtro) || nome.includes(filtro) || descricao.includes(filtro);
  }

  function atualizarBotaoAtivo(seletor, elementoAtivo) {
    document.querySelectorAll(seletor).forEach(function (botao) {
      botao.classList.remove("ativo");
      botao.classList.remove("active");
    });

    if (elementoAtivo) {
      elementoAtivo.classList.add(elementoAtivo.classList.contains("category-filter") ? "active" : "ativo");
    }
  }

  function filtrarProdutos(categoria, event) {
    event = event || window.event;

    var produtos = getProdutosLocais();
    var filtrados = produtos.filter(function (produto) {
      return categoriaCombina(produto, categoria);
    });

    atualizarBotaoAtivo(".filtro-btn", event && event.target ? event.target : null);
    renderizarProdutosLocais(filtrados);

    rastrearEvento("filter_products", {
      categoria: categoria,
      total_resultados: filtrados.length,
      pagina: "presentes-canaa"
    });
  }

  function carregarProdutosLocais() {
    if (!document.getElementById("produtos-container")) return;
    renderizarProdutosLocais(getProdutosLocais());
  }

  function criarCardAchadinho(produto) {
    var card = document.createElement("article");
    card.className = "affiliate-card";
    card.dataset.produtoId = produto.id;
    card.dataset.category = produto.categoria;

    var imagem = criarImagemProduto(produto, "affiliate-image");

    var conteudo = document.createElement("div");
    conteudo.className = "affiliate-content";

    var categoria = document.createElement("span");
    categoria.className = "affiliate-category";
    categoria.textContent = produto.categoria;

    var nome = document.createElement("h2");
    nome.textContent = produto.nome;

    var descricao = document.createElement("p");
    descricao.className = "affiliate-benefit";
    descricao.textContent = produto.descricao;

    var preco = document.createElement("p");
    preco.className = "affiliate-price";
    preco.textContent = produto.preco > 0
      ? "Preco aprox. " + formatarPreco(produto.preco)
      : "Ofertas selecionadas";

    var link = document.createElement("a");
    link.className = "btn btn-primary btn-block";
    link.href = produto.linkAfiliado;
    link.target = "_blank";
    link.rel = "noopener noreferrer sponsored";
    link.textContent = "Ver ofertas";
    link.addEventListener("click", function (event) {
      event.preventDefault();
      abrirLinkAfiliado(produto);
    });

    card.addEventListener("mouseenter", function () {
      trackViewContent(produto);
    }, { once: true });

    conteudo.append(categoria, nome, descricao, preco, link);
    card.append(imagem, conteudo);

    return card;
  }

  function renderizarAchadinhos(lista) {
    var container = document.getElementById("affiliate-products") || document.getElementById("achadinhos-container");
    var vazio = document.getElementById("affiliate-empty");

    if (!container) return;

    container.innerHTML = "";

    if (!lista.length) {
      if (vazio) vazio.style.display = "block";
      return;
    }

    if (vazio) vazio.style.display = "none";

    lista.forEach(function (produto, index) {
      var card = criarCardAchadinho(produto);
      card.style.animation = "fadeIn 0.45s ease both";
      card.style.animationDelay = (index * 0.04) + "s";
      container.appendChild(card);
    });
  }

  function filtrarAchadinhos(categoria, event) {
    var filtro = removerAcentos(categoria);
    var lista = getAchadinhos().filter(function (produto) {
      return filtro === "todos" || removerAcentos(produto.categoria) === filtro;
    });

    atualizarBotaoAtivo(".category-filter", event && event.target ? event.target : null);
    renderizarAchadinhos(lista);

    rastrearEvento("filter_affiliate_products", {
      categoria: categoria,
      total_resultados: lista.length,
      pagina: "achadinhos"
    });
  }

  function carregarAchadinhos() {
    if (!document.getElementById("affiliate-products") && !document.getElementById("achadinhos-container")) return;

    renderizarAchadinhos(getAchadinhos());

    document.querySelectorAll(".category-filter").forEach(function (botao) {
      botao.addEventListener("click", function (event) {
        filtrarAchadinhos(botao.dataset.category || botao.textContent, event);
      });
    });
  }

  function abrirLinkAfiliado(produto) {
    if (!produto || !produto.linkAfiliado) return;

    trackAffiliateClick(produto);

    var novaAba = window.open(produto.linkAfiliado, "_blank", "noopener,noreferrer");
    if (novaAba) {
      novaAba.opener = null;
    }
  }

  function rastrearEvento(nomeEvento, parametros) {
    var dados = parametros || {};

    // Google Tag Manager:
    // Descomente quando o GTM estiver instalado no site.
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: nomeEvento,
    //   ...dados
    // });

    console.log("[tracking]", nomeEvento, dados);
  }

  function normalizarProdutoParaTracking(produtoOuNome, preco) {
    if (produtoOuNome && typeof produtoOuNome === "object") {
      return produtoOuNome;
    }

    return {
      id: null,
      nome: String(produtoOuNome || "Produto"),
      categoria: "",
      preco: Number(preco || 0)
    };
  }

  function trackWhatsAppClick(produtoOuNome, preco) {
    var produto = normalizarProdutoParaTracking(produtoOuNome, preco);

    // Google Tag Manager:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: "whatsapp_click",
    //   produto_id: produto.id,
    //   produto_nome: produto.nome,
    //   categoria: produto.categoria,
    //   valor: produto.preco
    // });

    rastrearEvento("whatsapp_click", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco
    });
  }

  function trackAffiliateClick(produto) {
    // Google Tag Manager:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: "affiliate_click",
    //   produto_id: produto.id,
    //   produto_nome: produto.nome,
    //   categoria: produto.categoria,
    //   valor: produto.preco,
    //   link_afiliado: produto.linkAfiliado
    // });

    rastrearEvento("affiliate_click", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco,
      link_afiliado: produto.linkAfiliado
    });
  }

  function trackViewContent(produto) {
    // Google Tag Manager:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: "view_content",
    //   produto_id: produto.id,
    //   produto_nome: produto.nome,
    //   categoria: produto.categoria,
    //   valor: produto.preco
    // });

    rastrearEvento("view_content", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco
    });
  }

  function inicializarMenuMobile() {
    var menuToggle = document.querySelector(".menu-toggle");
    var navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu || menuToggle.dataset.initialized === "true") return;

    menuToggle.dataset.initialized = "true";

    menuToggle.addEventListener("click", function () {
      var aberto = navMenu.classList.toggle("ativo");
      menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("ativo");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function criarCompatibilidadeLegado() {
    var achadinhosCompat = getAchadinhos().map(function (produto) {
      return {
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria,
        descricao: produto.descricao,
        beneficio: produto.descricao,
        preco: produto.preco,
        precoAproximado: produto.preco,
        imagem: produto.imagem,
        link: produto.linkAfiliado,
        linkAfiliado: produto.linkAfiliado
      };
    });

    if (location.pathname.includes("presentes-canaa")) {
      window.PRODUTOS = { produtosLocais: getProdutosLocais() };
      return;
    }

    if (location.pathname.includes("achadinhos")) {
      window.PRODUTOS = {
        achadinhos: achadinhosCompat,
        achadinhosAfiliados: achadinhosCompat
      };
      return;
    }

    window.PRODUTOS = {
      produtosLocais: getProdutosLocais(),
      presentesCanaa: getProdutosLocais(),
      achadinhos: achadinhosCompat,
      achadinhosAfiliados: achadinhosCompat
    };
  }

  function inicializarApp() {
    exporFuncoesGlobais();
    criarCompatibilidadeLegado();
    inicializarMenuMobile();
    carregarProdutosLocais();
    carregarAchadinhos();

    // Garante que este arquivo continue sendo a fonte principal mesmo se
    // alguma pagina antiga ainda tiver scripts inline registrados no DOMContentLoaded.
    setTimeout(function () {
      exporFuncoesGlobais();
      criarCompatibilidadeLegado();
      carregarProdutosLocais();
      carregarAchadinhos();
    }, 0);
  }

  function exporFuncoesGlobais() {
    window.formatarPreco = formatarPreco;
    window.gerarLinkWhatsApp = gerarLinkWhatsApp;
    window.filtrarProdutos = filtrarProdutos;
    window.carregarProdutosLocais = carregarProdutosLocais;
    window.carregarAchadinhos = carregarAchadinhos;
    window.abrirLinkAfiliado = abrirLinkAfiliado;
    window.rastrearEvento = rastrearEvento;
    window.trackWhatsAppClick = trackWhatsAppClick;
    window.trackAffiliateClick = trackAffiliateClick;
    window.trackViewContent = trackViewContent;
  }

  exporFuncoesGlobais();

  criarCompatibilidadeLegado();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarApp);
  } else {
    inicializarApp();
  }
})();
