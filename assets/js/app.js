/**
 * Zadoni - app.js
 * Renderizacao de produtos locais e eventos de tracking.
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

  function criarUrlAbsoluta(caminho) {
    if (!caminho) return "";
    if (/^(?:https?:|data:|blob:)/i.test(caminho)) return caminho;

    var caminhoDesdeRaiz = "/" + String(caminho)
      .replace(/^\.\//, "")
      .replace(/^\/+/, "");

    return new URL(caminhoDesdeRaiz, window.location.origin).href;
  }

  function criarSlug(texto) {
    return removerAcentos(texto)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function obterSrcsetWebp(caminho) {
    if (!caminho || !/\.(jpe?g|png|webp)$/i.test(caminho)) return "";
    if (!caminho.includes("assets/optimized/products/")) return "";

    var base = caminho.replace(/\.(jpe?g|png|webp)$/i, "");
    var responsivo = base.replace("assets/optimized/products/", "assets/optimized/products/responsive/");

    return criarUrlAbsoluta(responsivo + "-480.webp") + " 480w, " +
      criarUrlAbsoluta(responsivo + "-720.webp") + " 720w";
  }

  function calcularTotalProduto(produto, adicionais) {
    var total = Number(produto && produto.preco ? produto.preco : 0);

    (adicionais || []).forEach(function (adicional) {
      total += Number(adicional.preco || 0) * Number(adicional.quantidade || 1);
    });

    return total;
  }

  function montarResumoWhatsApp(produto, adicionais) {
    if (!produto) {
      return "Ola! Quero ajuda para escolher um presente na Zadoni.";
    }

    adicionais = adicionais || [];

    var linhas = [
      "Ola! Quero este presente:",
      "",
      "Produto: " + produto.nome,
      "Categoria: " + produto.categoria,
      "Valor do produto: " + formatarPreco(produto.preco),
      "Resumo: " + produto.descricao
    ];

    if (produto.observacaoPreco) {
      linhas.push("Observação: " + produto.observacaoPreco);
    }

    if (adicionais.length) {
      linhas.push("");
      linhas.push("Adicionais opcionais:");
      adicionais.forEach(function (adicional) {
        var quantidade = Number(adicional.quantidade || 1);
        var detalheQuantidade = quantidade > 1 ? quantidade + "x " : "";
        var subtotal = Number(adicional.preco || 0) * quantidade;
        var observacao = adicional.observacao ? " - " + adicional.observacao : "";

        linhas.push("- " + detalheQuantidade + adicional.nome + " (+" + formatarPreco(subtotal) + ")" + observacao);
      });
      linhas.push("Total estimado: " + formatarPreco(calcularTotalProduto(produto, adicionais)));
    }

    if (produto.observacaoPreco || adicionais.length) {
      linhas.push("Valores estimados. A composição final depende dos itens disponíveis e da personalização escolhida.");
    }

    var imagemUrl = criarUrlAbsoluta(produto.imagem);
    if (imagemUrl) {
      linhas.push("Imagem do produto: " + imagemUrl);
    }

    linhas.push("");
    linhas.push("Pode me informar disponibilidade, formas de pagamento e entrega em Canaa dos Carajas?");

    return linhas.join("\n");
  }

  function obterParametroUrl(nome) {
    try {
      return new URLSearchParams(window.location.search).get(nome) || "";
    } catch (error) {
      return "";
    }
  }

  function normalizarCategoriaProdutos(categoria) {
    var filtro = removerAcentos(categoria).replace(/[-_]+/g, " ");

    if (!filtro || filtro === "todos" || filtro.startsWith("todos")) return "todos";
    if (filtro.includes("buqu") || filtro.includes("flor")) return "buques";
    if (filtro.includes("kit") || filtro.includes("romant")) return "kits";
    if (filtro.includes("mimo")) return "mimos";
    if (filtro.includes("cesta")) return "cestas";
    if (filtro.includes("perfume")) return "perfumes";
    if (filtro.includes("adicion") || filtro.includes("avulso") || filtro.includes("extra")) return "adicionais";
    if (filtro.includes("promo") || filtro.includes("destaque")) return "promocoes";
    if (filtro.includes("data") || filtro.includes("especial")) return "datas especiais";

    return categoria;
  }

  function gerarLinkWhatsApp(produto, adicionais) {
    var mensagem = montarResumoWhatsApp(produto, adicionais);
    var params = new URLSearchParams({
      text: mensagem,
      utm_source: "site",
      utm_medium: "whatsapp",
      utm_campaign: "seo_local",
      utm_content: produto ? "produto_" + criarSlug(produto.nome) : "catalogo"
    });

    return "https://wa.me/" + CONFIG.whatsappNumber + "?" + params.toString();
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

  function criarImagemProduto(produto, classe, prioridade) {
    var wrapper = document.createElement("div");
    wrapper.className = classe;

    if (produto.imagem) {
      var picture = document.createElement("picture");
      var srcsetWebp = obterSrcsetWebp(produto.imagem);

      if (srcsetWebp) {
        var source = document.createElement("source");
        source.type = "image/webp";
        source.srcset = srcsetWebp;
        source.sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px";
        picture.appendChild(source);
      }

      var img = document.createElement("img");
      img.src = criarUrlAbsoluta(produto.imagem);
      img.alt = produto.nome;
      img.width = 720;
      img.height = 900;
      img.decoding = "async";
      img.loading = prioridade ? "eager" : "lazy";
      img.fetchPriority = prioridade ? "high" : "low";
      img.sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px";
      img.onerror = function () {
        wrapper.textContent = obterEmojiProduto(produto);
        wrapper.classList.add("imagem-placeholder");
      };
      picture.appendChild(img);
      wrapper.appendChild(picture);
    } else {
      wrapper.textContent = obterEmojiProduto(produto);
    }

    return wrapper;
  }

  function produtoTemAdicionais(produto) {
    return produto &&
      Array.isArray(produto.adicionaisOpcionais) &&
      produto.adicionaisOpcionais.length > 0;
  }

  function obterTituloAdicionais(produto) {
    var categoria = removerAcentos(produto && produto.categoria);
    var nome = removerAcentos(produto && produto.nome);

    if (categoria.includes("cesta") || nome.includes("cesta")) return "Monte sua cesta:";
    if (categoria.includes("flor") || nome.includes("buque")) return "Adicionar ao buque:";

    return "Personalize seu presente:";
  }

  function obterAdicionaisSelecionados(card, produto) {
    if (!produtoTemAdicionais(produto)) return [];

    var selecionados = Array.prototype.slice.call(card.querySelectorAll(".produto-adicional-check:checked"))
      .map(function (checkbox) {
        var adicional = produto.adicionaisOpcionais[Number(checkbox.dataset.adicionalIndex)];
        return adicional ? Object.assign({}, adicional, { quantidade: 1 }) : null;
      })
      .filter(Boolean);

    Array.prototype.slice.call(card.querySelectorAll(".produto-adicional-quantidade")).forEach(function (input) {
      var quantidade = Number(input.value || 0);
      if (quantidade <= 0) return;

      var adicional = produto.adicionaisOpcionais[Number(input.dataset.adicionalIndex)];
      if (adicional) {
        selecionados.push(Object.assign({}, adicional, { quantidade: quantidade }));
      }
    });

    return selecionados;
  }

  function criarAdicionaisProduto(produto, onChange) {
    if (!produtoTemAdicionais(produto)) return null;

    var wrapper = document.createElement("details");
    wrapper.className = "produto-adicionais";

    var titulo = document.createElement("summary");
    titulo.className = "produto-adicionais-titulo";
    titulo.textContent = obterTituloAdicionais(produto) + " " + produto.adicionaisOpcionais.length + " opções";
    wrapper.appendChild(titulo);

    produto.adicionaisOpcionais.forEach(function (adicional, index) {
      function criarImagemAdicional() {
        if (!adicional.imagem) return null;

        var img = document.createElement("img");
        img.className = "produto-adicional-imagem";
        img.src = criarUrlAbsoluta(adicional.imagem);
        img.alt = "";
        img.width = 44;
        img.height = 44;
        img.loading = "lazy";
        img.decoding = "async";
        img.onerror = function () {
          img.remove();
        };
        return img;
      }

      if (adicional.tipo === "quantidade") {
        var linhaQuantidade = document.createElement("label");
        linhaQuantidade.className = "produto-adicional produto-adicional-com-quantidade";
        if (adicional.imagem) {
          linhaQuantidade.classList.add("produto-adicional-com-imagem");
        }

        var inputQuantidade = document.createElement("input");
        inputQuantidade.className = "produto-adicional-quantidade";
        inputQuantidade.type = "number";
        inputQuantidade.min = "0";
        inputQuantidade.max = "10";
        inputQuantidade.step = "1";
        inputQuantidade.value = "0";
        inputQuantidade.inputMode = "numeric";
        inputQuantidade.dataset.adicionalIndex = String(index);
        inputQuantidade.addEventListener("input", onChange);

        var textoQuantidade = document.createElement("span");
        textoQuantidade.textContent = adicional.nome + " +" + formatarPreco(adicional.preco) + " por " + (adicional.unidade || "unidade") + (adicional.observacao ? " · " + adicional.observacao : "");

        var imagemQuantidade = criarImagemAdicional();
        if (imagemQuantidade) {
          linhaQuantidade.append(inputQuantidade, imagemQuantidade, textoQuantidade);
        } else {
          linhaQuantidade.append(inputQuantidade, textoQuantidade);
        }
        wrapper.appendChild(linhaQuantidade);
        return;
      }

      var label = document.createElement("label");
      label.className = "produto-adicional";
      if (adicional.imagem) {
        label.classList.add("produto-adicional-com-imagem");
      }

      var checkbox = document.createElement("input");
      checkbox.className = "produto-adicional-check";
      checkbox.type = "checkbox";
      checkbox.dataset.adicionalIndex = String(index);
      checkbox.addEventListener("change", onChange);

      var texto = document.createElement("span");
      texto.textContent = adicional.nome + " +" + formatarPreco(adicional.preco) + (adicional.observacao ? " · " + adicional.observacao : "");

      var imagem = criarImagemAdicional();
      if (imagem) {
        label.append(checkbox, imagem, texto);
      } else {
        label.append(checkbox, texto);
      }
      wrapper.appendChild(label);
    });

    return wrapper;
  }

  function obterCategoriaInicial() {
    var categoriaQuery = obterParametroUrl("categoria");
    if (categoriaQuery) return categoriaQuery;

    var hash = String(window.location.hash || "");
    return hash.startsWith("#categoria-")
      ? hash.slice("#categoria-".length)
      : "";
  }

  function obterAdicionaisCafeGaleria() {
    return typeof adicionaisCestasCafe !== "undefined" && Array.isArray(adicionaisCestasCafe)
      ? adicionaisCestasCafe
      : [];
  }

  function adicionarExtrasAoLinkWhatsApp(linkBase, adicionaisSelecionados) {
    if (!adicionaisSelecionados.length) return linkBase;

    var url = new URL(linkBase);
    var mensagem = url.searchParams.get("text") || "";
    var linhas = ["", "Adicionais opcionais selecionados:"];
    var total = 0;

    adicionaisSelecionados.forEach(function (adicional) {
      var quantidade = Math.max(1, Number(adicional.quantidade || 1));
      var subtotal = Number(adicional.preco || 0) * quantidade;
      total += subtotal;
      linhas.push("- " + quantidade + "x " + adicional.nome + " (" + formatarPreco(subtotal) + ")");
    });

    linhas.push("Total estimado dos adicionais: " + formatarPreco(total));
    url.searchParams.set("text", mensagem + "\n" + linhas.join("\n"));
    return url.toString();
  }

  function inicializarAdicionaisGaleriaCafe() {
    var painel = document.getElementById("cafe-gallery-addons");
    var destino = document.getElementById("cafe-gallery-addons-options");
    if (!painel || !destino || painel.dataset.initialized === "true") return;

    var lista = obterAdicionaisCafeGaleria();
    if (!lista.length) return;

    painel.dataset.initialized = "true";
    var produtoReferencia = {
      categoria: "Cestas",
      nome: "Cesta de café da manhã",
      adicionaisOpcionais: lista
    };
    var links = Array.prototype.slice.call(document.querySelectorAll(".seo-gallery-budget-option"));
    var total = document.getElementById("cafe-gallery-addons-total");

    links.forEach(function (link) {
      link.dataset.baseWhatsappHref = link.href;
    });

    function atualizarLinksGaleria() {
      var selecionados = obterAdicionaisSelecionados(painel, produtoReferencia);
      var valor = selecionados.reduce(function (soma, adicional) {
        return soma + Number(adicional.preco || 0) * Math.max(1, Number(adicional.quantidade || 1));
      }, 0);

      links.forEach(function (link) {
        link.href = adicionarExtrasAoLinkWhatsApp(link.dataset.baseWhatsappHref, selecionados);
      });

      if (total) {
        total.textContent = selecionados.length
          ? selecionados.length + " adicional(is) selecionado(s) - " + formatarPreco(valor)
          : "Nenhum adicional selecionado.";
      }
    }

    destino.appendChild(criarAdicionaisProduto(produtoReferencia, atualizarLinksGaleria));
    atualizarLinksGaleria();
  }

  function criarCardProdutoLocal(produto, index) {
    var card = document.createElement("article");
    card.className = "produto-card";
    card.id = "produto-" + produto.id;
    card.dataset.produtoId = produto.id;
    card.dataset.category = normalizarCategoriaProdutos(produto.categoria);

    var imagem = criarImagemProduto(produto, "produto-imagem", index < 2);

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

    var totalEstimado = document.createElement("p");
    totalEstimado.className = "produto-total-estimado";
    totalEstimado.textContent = "Total estimado: " + formatarPreco(produto.preco);

    var acoes = document.createElement("div");
    acoes.className = "produto-acoes";

    var whatsapp = document.createElement("a");
    whatsapp.className = "btn-whatsapp-produto";
    whatsapp.href = gerarLinkWhatsApp(produto);
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.dataset.track = "whatsapp";
    whatsapp.dataset.produtoId = String(produto.id);
    whatsapp.setAttribute("aria-label", "Chamar no WhatsApp sobre " + produto.nome);
    whatsapp.textContent = "Quero este presente";
    function atualizarLinkWhatsApp() {
      var adicionaisSelecionados = obterAdicionaisSelecionados(card, produto);
      whatsapp.href = gerarLinkWhatsApp(produto, adicionaisSelecionados);
      totalEstimado.textContent = "Total estimado: " + formatarPreco(calcularTotalProduto(produto, adicionaisSelecionados));
    }

    var adicionais = criarAdicionaisProduto(produto, atualizarLinkWhatsApp);

    whatsapp.addEventListener("click", function () {
      atualizarLinkWhatsApp();
    });

    card.addEventListener("mouseenter", function () {
      trackViewContent(produto);
    }, { once: true });
    card.addEventListener("focusin", function () {
      trackViewContent(produto);
    }, { once: true });

    acoes.appendChild(whatsapp);
    conteudo.append(nome, descricao, preco);
    if (adicionais) {
      conteudo.append(adicionais, totalEstimado);
      atualizarLinkWhatsApp();
    }
    conteudo.appendChild(acoes);
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
      if (vazio) {
        if (!vazio.dataset.initialized) {
          vazio.innerHTML = "<h3>Nenhum produto encontrado</h3><p>Tente outra categoria ou fale conosco no WhatsApp.</p><a href=\"" + gerarLinkWhatsApp(null) + "\" target=\"_blank\" rel=\"noopener noreferrer\" data-track=\"whatsapp\">Conversar no WhatsApp</a>";
          vazio.dataset.initialized = "true";
          inicializarTrackingLinks();
        }
        vazio.hidden = false;
      }
      return;
    }

    container.style.display = "grid";
    if (vazio) vazio.hidden = true;

    lista.forEach(function (produto, index) {
      var card = criarCardProdutoLocal(produto, index);
      card.style.animation = "fadeIn 0.45s ease both";
      card.style.animationDelay = (index * 0.04) + "s";
      container.appendChild(card);
    });

    inicializarTrackingLinks();
  }

  function categoriaCombina(produto, categoria) {
    var filtro = removerAcentos(categoria);
    var nome = removerAcentos(produto.nome);
    var categoriaProduto = removerAcentos(produto.categoria);
    var descricao = removerAcentos(produto.descricao);

    if (!filtro || filtro === "todos") return true;
    if (filtro.includes("buqu")) return categoriaProduto.includes("flor") || nome.includes("buque");
    if (filtro.includes("kit")) return categoriaProduto.includes("kit") || nome.includes("kit");
    if (filtro.includes("mimo")) return categoriaProduto.includes("mimo") || nome.includes("mimo");
    if (filtro.includes("perfume")) return categoriaProduto.includes("perfume") || nome.includes("perfume");
    if (filtro.includes("adicion") || filtro.includes("avulso") || filtro.includes("extra")) {
      return categoriaProduto.includes("adicion") || nome.includes("adicion");
    }
    if (filtro.includes("promo")) return Boolean(produto.destaque);
    if (filtro.includes("data") || filtro.includes("especial")) {
      return Boolean(produto.destaque) ||
        categoriaProduto.includes("flor") ||
        categoriaProduto.includes("kit") ||
        categoriaProduto.includes("cesta");
    }

    return categoriaProduto.includes(filtro) || nome.includes(filtro) || descricao.includes(filtro);
  }

  function atualizarBotaoAtivo(seletor, elementoAtivo) {
    document.querySelectorAll(seletor).forEach(function (botao) {
      botao.classList.remove("ativo");
      botao.classList.remove("active");
    });

    if (elementoAtivo) {
      elementoAtivo.classList.add("ativo");
    }
  }

  function atualizarContagemProdutos(lista, categoria) {
    var status = document.getElementById("catalog-results-count");
    if (!status) return;

    var rotulos = {
      todos: "no catálogo",
      buques: "em Buquês",
      kits: "em Kits",
      mimos: "em Mimos",
      cestas: "em Cestas",
      perfumes: "em Perfumes de bolso",
      adicionais: "em Itens avulsos",
      promocoes: "em Destaques"
    };
    var total = lista.length;
    var substantivo = total === 1 ? "produto encontrado" : "produtos encontrados";
    status.textContent = total + " " + substantivo + " " + (rotulos[categoria] || "nesta categoria") + ".";
  }

  function filtrarProdutos(categoria, event) {
    event = event || window.event;
    categoria = normalizarCategoriaProdutos(categoria);

    var produtos = getProdutosLocais();
    var filtrados = produtos.filter(function (produto) {
      return categoriaCombina(produto, categoria);
    });

    atualizarBotaoAtivo(".filtro-btn", event && event.target ? event.target : null);
    renderizarProdutosLocais(filtrados);
    atualizarContagemProdutos(filtrados, categoria);

    rastrearEvento("select_category", {
      categoria: categoria,
      total_resultados: filtrados.length,
      pagina: "presentes-canaa"
    });
  }

  function carregarProdutosLocais() {
    if (!document.getElementById("produtos-container")) return;

    var categoriaInicial = normalizarCategoriaProdutos(obterCategoriaInicial());
    var produtos = getProdutosLocais();
    var lista = categoriaInicial === "todos"
      ? produtos
      : produtos.filter(function (produto) {
        return categoriaCombina(produto, categoriaInicial);
      });

    renderizarProdutosLocais(lista);
    atualizarContagemProdutos(lista, categoriaInicial);

    document.querySelectorAll(".filtro-btn").forEach(function (botao) {
      var texto = normalizarCategoriaProdutos(botao.textContent);
      botao.classList.toggle("ativo", texto === categoriaInicial);
    });

    if (window.location.hash.startsWith("#categoria-")) {
      window.requestAnimationFrame(function () {
        document.getElementById("produtos-container")?.scrollIntoView({ block: "start" });
      });
    }
  }

  function rastrearEvento(nomeEvento, parametros) {
    var dados = parametros || {};

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: nomeEvento }, dados));

    if (obterParametroUrl("debug_tracking") === "1" && window.console) {
      console.log("[tracking]", nomeEvento, dados);
    }
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

    rastrearEvento("click_whatsapp", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco
    });
  }

  function trackViewContent(produto) {
    rastrearEvento("view_product", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco
    });
  }

  function trackInstagramClick(link) {
    rastrearEvento("click_instagram", {
      url: link && link.href ? link.href : ""
    });
  }

  function inicializarTrackingLinks() {
    document.querySelectorAll("[data-track='whatsapp']").forEach(function (link) {
      if (link.dataset.trackingInitialized === "true") return;
      link.dataset.trackingInitialized = "true";

      link.addEventListener("click", function () {
        var produtoId = Number(link.dataset.produtoId || 0);
        var produto = getProdutosLocais().find(function (item) {
          return Number(item.id) === produtoId;
        });

        trackWhatsAppClick(produto || "WhatsApp", produto ? produto.preco : 0);
      });
    });

    document.querySelectorAll("[data-track='instagram']").forEach(function (link) {
      if (link.dataset.trackingInitialized === "true") return;
      link.dataset.trackingInitialized = "true";

      link.addEventListener("click", function () {
        trackInstagramClick(link);
      });
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
    if (location.pathname.includes("presentes-canaa")) {
      window.PRODUTOS = { produtosLocais: getProdutosLocais() };
      return;
    }

    window.PRODUTOS = {
      produtosLocais: getProdutosLocais(),
      presentesCanaa: getProdutosLocais()
    };
  }

  function inicializarApp() {
    exporFuncoesGlobais();
    criarCompatibilidadeLegado();
    inicializarMenuMobile();
    carregarProdutosLocais();
    inicializarAdicionaisGaleriaCafe();
    inicializarTrackingLinks();
  }

  function exporFuncoesGlobais() {
    window.formatarPreco = formatarPreco;
    window.gerarLinkWhatsApp = gerarLinkWhatsApp;
    window.filtrarProdutos = filtrarProdutos;
    window.carregarProdutosLocais = carregarProdutosLocais;
    window.rastrearEvento = rastrearEvento;
    window.trackWhatsAppClick = trackWhatsAppClick;
    window.trackInstagramClick = trackInstagramClick;
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
