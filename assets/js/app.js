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

  function temPrecoProduto(produto) {
    return Boolean(
      produto &&
      produto.precoSobConsulta !== true &&
      Number.isFinite(produto.preco) &&
      produto.preco > 0
    );
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
      "Valor do produto: " + (temPrecoProduto(produto) ? formatarPreco(produto.preco) : "sob consulta"),
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
      linhas.push(temPrecoProduto(produto)
        ? "Total estimado: " + formatarPreco(calcularTotalProduto(produto, adicionais))
        : "Subtotal estimado dos adicionais: " + formatarPreco(calcularTotalProduto(produto, adicionais)));
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

  function destacarControleQuandoVisivel(controle) {
    if (!controle || controle.dataset.attentionInitialized === "true") return;

    controle.dataset.attentionInitialized = "true";

    function destacar() {
      if (controle.closest("details")?.open) return;
      controle.classList.add("produto-adicionais-titulo--destaque");
    }

    controle.addEventListener("click", function () {
      controle.classList.remove("produto-adicionais-titulo--destaque");
    }, { once: true });

    if (!("IntersectionObserver" in window)) {
      destacar();
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      if (!entradas.some(function (entrada) { return entrada.isIntersecting; })) return;
      destacar();
      observador.disconnect();
    }, { threshold: 0.7 });

    observador.observe(controle);
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

    wrapper.addEventListener("toggle", function () {
      if (wrapper.open) {
        titulo.classList.remove("produto-adicionais-titulo--destaque");
      }
    });

    destacarControleQuandoVisivel(titulo);

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
          var linha = img.parentElement;
          img.remove();
          if (linha) linha.classList.remove("produto-adicional-com-imagem");
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

  function criarPainelAdicionaisGaleria(configuracao) {
    var painel = configuracao.painel;
    var destino = configuracao.destino;
    var total = configuracao.total;
    var modelos = configuracao.modelos;
    var produtoReferencia = configuracao.produtoReferencia;
    var estados = new WeakMap();
    var botoes = new WeakMap();
    var modeloAtivo = null;
    var gatilhoAtivo = null;

    if (!painel || !destino || !modelos.length || !produtoTemAdicionais(produtoReferencia)) return;

    painel.classList.add("seo-gallery-addons--modal");
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-modal", "true");
    painel.setAttribute("aria-hidden", "true");
    painel.tabIndex = -1;

    var fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "seo-gallery-addons-close";
    fechar.setAttribute("aria-label", "Fechar lista de adicionais");
    fechar.textContent = "×";
    painel.prepend(fechar);

    var fundo = document.createElement("button");
    fundo.type = "button";
    fundo.className = "seo-gallery-addons-backdrop";
    fundo.setAttribute("aria-label", "Fechar lista de adicionais");
    document.body.appendChild(fundo);

    function salvarEstado() {
      if (!modeloAtivo) return;

      estados.set(modeloAtivo, {
        checks: Array.prototype.slice.call(painel.querySelectorAll(".produto-adicional-check")).map(function (input) {
          return input.checked;
        }),
        quantidades: Array.prototype.slice.call(painel.querySelectorAll(".produto-adicional-quantidade")).map(function (input) {
          return input.value;
        })
      });
    }

    function restaurarEstado(modelo) {
      var estado = estados.get(modelo) || { checks: [], quantidades: [] };

      Array.prototype.slice.call(painel.querySelectorAll(".produto-adicional-check")).forEach(function (input, index) {
        input.checked = Boolean(estado.checks[index]);
      });
      Array.prototype.slice.call(painel.querySelectorAll(".produto-adicional-quantidade")).forEach(function (input, index) {
        input.value = estado.quantidades[index] || "0";
      });
    }

    function atualizarModeloAtivo(deveSalvar) {
      if (!modeloAtivo) return;
      if (deveSalvar !== false) salvarEstado();

      var selecionados = obterAdicionaisSelecionados(painel, produtoReferencia);
      var valor = selecionados.reduce(function (soma, adicional) {
        return soma + Number(adicional.preco || 0) * Math.max(1, Number(adicional.quantidade || 1));
      }, 0);
      var links = configuracao.obterLinks(modeloAtivo);
      var botao = botoes.get(modeloAtivo);

      links.forEach(function (link) {
        if (!link.dataset.baseWhatsappHref) link.dataset.baseWhatsappHref = link.href;
        link.href = adicionarExtrasAoLinkWhatsApp(link.dataset.baseWhatsappHref, selecionados);
      });

      if (botao) {
        botao.textContent = selecionados.length
          ? botao.dataset.baseLabel + " · " + selecionados.length + " selecionado(s)"
          : botao.dataset.baseLabel;
        botao.classList.toggle("btn-adicionais-modelo--selecionado", selecionados.length > 0);
      }

      if (total) {
        total.textContent = selecionados.length
          ? selecionados.length + " adicional(is) selecionado(s) - " + formatarPreco(valor)
          : "Nenhum adicional selecionado.";
      }
    }

    var adicionais = criarAdicionaisProduto(produtoReferencia, function () {
      atualizarModeloAtivo(true);
    });
    destino.appendChild(adicionais);

    var concluir = document.createElement("button");
    concluir.type = "button";
    concluir.className = "btn btn-primary btn-block seo-gallery-addons-done";
    concluir.textContent = "Concluir adicionais";
    painel.appendChild(concluir);

    function fecharPainel() {
      painel.classList.remove("is-open");
      fundo.classList.remove("is-open");
      painel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("addons-modal-open");
      if (gatilhoAtivo) gatilhoAtivo.focus();
    }

    function abrirPainel(modelo, botao) {
      modeloAtivo = modelo;
      gatilhoAtivo = botao;
      restaurarEstado(modelo);
      adicionais.open = true;
      atualizarModeloAtivo(false);
      painel.classList.add("is-open");
      fundo.classList.add("is-open");
      painel.setAttribute("aria-hidden", "false");
      document.body.classList.add("addons-modal-open");
      painel.scrollTop = 0;
      fechar.focus();
    }

    modelos.forEach(function (modelo, index) {
      var ancora = configuracao.obterAncora(modelo);
      if (!ancora) return;

      configuracao.obterLinks(modelo).forEach(function (link) {
        link.dataset.baseWhatsappHref = link.href;
      });

      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "btn btn-adicionais-modelo";
      botao.dataset.baseLabel = configuracao.rotuloBotao;
      botao.textContent = configuracao.rotuloBotao;
      botao.setAttribute("aria-haspopup", "dialog");
      botao.setAttribute("aria-controls", painel.id);
      botao.setAttribute("aria-label", configuracao.rotuloBotao + " no modelo " + (index + 1));
      botao.addEventListener("click", function () {
        abrirPainel(modelo, botao);
      });

      ancora.after(botao);
      botoes.set(modelo, botao);
      destacarControleQuandoVisivel(botao);
    });

    fechar.addEventListener("click", fecharPainel);
    concluir.addEventListener("click", fecharPainel);
    fundo.addEventListener("click", fecharPainel);
    document.addEventListener("keydown", function (event) {
      if (!painel.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        fecharPainel();
        return;
      }

      if (event.key !== "Tab") return;

      var focaveis = Array.prototype.slice.call(painel.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      )).filter(function (elemento) {
        return elemento.offsetParent !== null;
      });
      if (!focaveis.length) return;

      var primeiro = focaveis[0];
      var ultimo = focaveis[focaveis.length - 1];

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    });
  }

  function inicializarAdicionaisGaleriaCafe() {
    var painel = document.getElementById("cafe-gallery-addons");
    var destino = document.getElementById("cafe-gallery-addons-options");
    if (!painel || !destino || painel.dataset.initialized === "true") return;

    var lista = obterAdicionaisCafeGaleria();
    if (!lista.length) return;

    var produtoReferencia = {
      categoria: "Cestas",
      nome: "Cesta de café da manhã",
      adicionaisOpcionais: lista
    };
    var total = document.getElementById("cafe-gallery-addons-total");
    var modelos = Array.prototype.slice.call(document.querySelectorAll(".seo-gallery-grid--budget .seo-gallery-item"));
    var orientacao = painel.querySelector(":scope > p");

    painel.dataset.initialized = "true";
    painel.id = painel.id || "cafe-gallery-addons";
    if (orientacao) {
      orientacao.textContent = "Selecione os complementos deste modelo. Depois, escolha a faixa de orçamento para enviar o resumo completo pelo WhatsApp.";
    }

    criarPainelAdicionaisGaleria({
      painel: painel,
      destino: destino,
      total: total,
      modelos: modelos,
      produtoReferencia: produtoReferencia,
      rotuloBotao: "Adicionar itens à cesta",
      obterAncora: function (modelo) {
        return modelo.querySelector(".seo-gallery-budget-options");
      },
      obterLinks: function (modelo) {
        return Array.prototype.slice.call(modelo.querySelectorAll(".seo-gallery-budget-option"));
      }
    });
  }

  function inicializarAdicionaisModelosGaleria() {
    var caminho = removerAcentos(window.location.pathname);
    var configuracao = null;

    if (caminho.includes("cestas-de-presente-canaa") && typeof adicionaisCestas !== "undefined") {
      configuracao = {
        lista: adicionaisCestas,
        categoria: "Cestas",
        nome: "Cesta de presente",
        titulo: "Adicionais opcionais para esta cesta",
        descricao: "Selecione os complementos desejados para enviar junto com este modelo pelo WhatsApp.",
        rotuloBotao: "Adicionar itens à cesta"
      };
    } else if (caminho.includes("cesta-de-aniversario-canaa") && typeof adicionaisCestas !== "undefined") {
      configuracao = {
        lista: adicionaisCestas,
        categoria: "Cestas",
        nome: "Cesta de aniversário",
        titulo: "Adicionais opcionais para esta cesta de aniversário",
        descricao: "Selecione os complementos desejados para enviar junto com este modelo pelo WhatsApp.",
        rotuloBotao: "Adicionar itens à cesta"
      };
    } else if (caminho.includes("buques-canaa-dos-carajas") && typeof adicionaisBuques !== "undefined") {
      configuracao = {
        lista: adicionaisBuques,
        categoria: "Flores",
        nome: "Buquê",
        titulo: "Adicionais opcionais para este buquê",
        descricao: "Selecione os complementos desejados para enviar junto com este modelo pelo WhatsApp.",
        rotuloBotao: "Adicionar itens ao buquê"
      };
    }

    if (!configuracao || !Array.isArray(configuracao.lista) || !configuracao.lista.length) return;

    var modelos = Array.prototype.slice.call(document.querySelectorAll(".seo-gallery .seo-gallery-item"));
    if (!modelos.length || document.getElementById("gallery-model-addons")) return;

    var painel = document.createElement("aside");
    painel.className = "seo-gallery-addons";
    painel.id = "gallery-model-addons";

    var titulo = document.createElement("h3");
    titulo.id = "gallery-model-addons-title";
    titulo.textContent = configuracao.titulo;
    painel.setAttribute("aria-labelledby", titulo.id);

    var descricao = document.createElement("p");
    descricao.textContent = configuracao.descricao;

    var destino = document.createElement("div");
    var total = document.createElement("strong");
    total.className = "seo-gallery-addons-total";
    total.setAttribute("aria-live", "polite");
    total.textContent = "Nenhum adicional selecionado.";

    painel.append(titulo, descricao, destino, total);
    document.body.appendChild(painel);

    criarPainelAdicionaisGaleria({
      painel: painel,
      destino: destino,
      total: total,
      modelos: modelos,
      produtoReferencia: {
        categoria: configuracao.categoria,
        nome: configuracao.nome,
        adicionaisOpcionais: configuracao.lista
      },
      rotuloBotao: configuracao.rotuloBotao,
      obterAncora: function (modelo) {
        var cta = modelo.querySelector(".seo-gallery-cta");
        return cta ? cta.previousElementSibling || modelo.querySelector("figcaption > :last-child") : null;
      },
      obterLinks: function (modelo) {
        var link = modelo.querySelector(".seo-gallery-cta");
        return link ? [link] : [];
      }
    });
  }

  function inicializarAdicionaisCardsSeo() {
    if (document.getElementById("produtos-container")) return;

    var produtos = getProdutosLocais();

    document.querySelectorAll(".seo-products .seo-product-card[data-produto-id]").forEach(function (card) {
      if (card.dataset.addonsInitialized === "true") return;

      var produtoId = String(card.dataset.produtoId || "");
      var produto = produtos.find(function (item) {
        return String(item.id) === produtoId;
      });
      var acoes = card.querySelector(".produto-acoes");
      var whatsapp = card.querySelector(".btn-whatsapp-produto");

      if (!produtoTemAdicionais(produto) || !acoes || !whatsapp) return;

      card.dataset.addonsInitialized = "true";
      whatsapp.dataset.baseWhatsappHref = whatsapp.href;

      var totalEstimado = document.createElement("p");
      totalEstimado.className = "produto-total-estimado";

      function atualizarPedido() {
        var selecionados = obterAdicionaisSelecionados(card, produto);
        whatsapp.href = adicionarExtrasAoLinkWhatsApp(whatsapp.dataset.baseWhatsappHref, selecionados);

        if (temPrecoProduto(produto)) {
          totalEstimado.textContent = "Total estimado: " + formatarPreco(calcularTotalProduto(produto, selecionados));
        } else {
          totalEstimado.textContent = selecionados.length
            ? "Adicionais selecionados: " + formatarPreco(calcularTotalProduto(produto, selecionados)) + " · valor do buquê sob consulta"
            : "Valor do buquê sob consulta";
        }
      }

      var adicionais = criarAdicionaisProduto(produto, atualizarPedido);
      acoes.before(adicionais, totalEstimado);
      atualizarPedido();

      var linkAdicionais = acoes.querySelector(".btn-secondary");
      if (linkAdicionais && removerAcentos(linkAdicionais.textContent).includes("adicion")) {
        linkAdicionais.addEventListener("click", function (event) {
          event.preventDefault();
          adicionais.open = true;
          adicionais.scrollIntoView({ behavior: "smooth", block: "center" });
          adicionais.querySelector(".produto-adicionais-titulo")?.focus();
        });
      }
    });
  }

  function inicializarAtalhoModelosMobile() {
    var hero = document.querySelector(".seo-hero");
    var galeria = document.querySelector(".seo-gallery");
    var botoes = hero?.querySelector(".hero-buttons");

    if (!hero || !galeria || !botoes || hero.dataset.mobileShortcutInitialized === "true") return;

    hero.dataset.mobileShortcutInitialized = "true";
    hero.classList.add("seo-hero--tem-atalho-mobile");

    var atalho = document.createElement("button");
    atalho.type = "button";
    atalho.className = "btn btn-outline btn-catalogo-mobile";
    atalho.textContent = "Ver modelos";
    atalho.setAttribute("aria-label", "Ir direto aos modelos desta categoria");
    atalho.addEventListener("click", function () {
      galeria.scrollIntoView({ behavior: "smooth", block: "start" });
      rastrearEvento("click_mobile_catalog_shortcut", {
        pagina: window.location.pathname
      });
    });

    botoes.appendChild(atalho);
  }

  function inicializarExplicacoesRecolhiveisMobile() {
    var primeiroCatalogo = document.querySelector(".seo-gallery, .seo-products");
    var telaMobile = window.matchMedia("(max-width: 767px)");

    if (!primeiroCatalogo) return;

    document.querySelectorAll(".seo-copy").forEach(function (secao, index) {
      var estaAntesDoCatalogo = Boolean(
        secao.compareDocumentPosition(primeiroCatalogo) & Node.DOCUMENT_POSITION_FOLLOWING
      );
      var container = secao.querySelector(":scope > .container");
      var titulo = container?.querySelector(":scope > h2");

      if (!estaAntesDoCatalogo || !container || !titulo || secao.dataset.mobileCollapseInitialized === "true") return;

      var elementosExplicativos = Array.prototype.slice.call(container.children).filter(function (elemento) {
        return elemento !== titulo;
      });

      if (!elementosExplicativos.length) return;

      secao.dataset.mobileCollapseInitialized = "true";
      secao.classList.add("seo-copy--collapsible-mobile");

      var conteudo = document.createElement("div");
      conteudo.className = "seo-copy-collapse-content";
      conteudo.id = (titulo.id || "seo-copy-" + (index + 1)) + "-conteudo";
      elementosExplicativos.forEach(function (elemento) {
        conteudo.appendChild(elemento);
      });

      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "seo-copy-collapse-button";
      botao.setAttribute("aria-controls", conteudo.id);

      var expandidoNoMobile = false;

      function atualizarEstado() {
        var recolhido = telaMobile.matches && !expandidoNoMobile;
        conteudo.hidden = recolhido;
        botao.hidden = !telaMobile.matches;
        botao.setAttribute("aria-expanded", recolhido ? "false" : "true");
        botao.textContent = recolhido ? "Mais informações +" : "Recolher −";
        secao.classList.toggle("seo-copy--collapsed-mobile", recolhido);
        secao.classList.toggle("seo-copy--expanded-mobile", telaMobile.matches && !recolhido);
      }

      botao.addEventListener("click", function () {
        if (!telaMobile.matches) return;
        expandidoNoMobile = !expandidoNoMobile;
        atualizarEstado();
        rastrearEvento("toggle_mobile_explanation", {
          pagina: window.location.pathname,
          secao: titulo.id || "texto-explicativo-" + (index + 1),
          estado: expandidoNoMobile ? "expandido" : "recolhido"
        });
      });

      titulo.after(botao);
      botao.after(conteudo);
      atualizarEstado();

      if (typeof telaMobile.addEventListener === "function") {
        telaMobile.addEventListener("change", atualizarEstado);
      } else if (typeof telaMobile.addListener === "function") {
        telaMobile.addListener(atualizarEstado);
      }
    });
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
    preco.textContent = temPrecoProduto(produto) ? formatarPreco(produto.preco) : "Valor sob consulta";

    var totalEstimado = document.createElement("p");
    totalEstimado.className = "produto-total-estimado";
    totalEstimado.textContent = temPrecoProduto(produto)
      ? "Total estimado: " + formatarPreco(produto.preco)
      : "Valor do buquê sob consulta";

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
      totalEstimado.textContent = temPrecoProduto(produto)
        ? "Total estimado: " + formatarPreco(calcularTotalProduto(produto, adicionaisSelecionados))
        : adicionaisSelecionados.length
          ? "Adicionais selecionados: " + formatarPreco(calcularTotalProduto(produto, adicionaisSelecionados)) + " · valor do buquê sob consulta"
          : "Valor do buquê sob consulta";
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

  function renderizarProdutosLocais(lista, categoria) {
    var container = document.getElementById("produtos-container");
    var vazio = document.getElementById("sem-produtos");

    if (!container) return;

    container.innerHTML = "";
    container.dataset.carouselEnabled = categoria && categoria !== "todos" && lista.length > 1 ? "true" : "false";

    if (!lista.length) {
      container.style.display = "none";
      container.dispatchEvent(new CustomEvent("zadoni:gallery-items-change"));
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

    container.style.removeProperty("display");
    if (vazio) vazio.hidden = true;

    lista.forEach(function (produto, index) {
      var card = criarCardProdutoLocal(produto, index);
      card.style.animation = "fadeIn 0.45s ease both";
      card.style.animationDelay = (index * 0.04) + "s";
      container.appendChild(card);
    });

    container.dispatchEvent(new CustomEvent("zadoni:gallery-items-change"));
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
    renderizarProdutosLocais(filtrados, categoria);
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

    renderizarProdutosLocais(lista, categoriaInicial);
    atualizarContagemProdutos(lista, categoriaInicial);

    document.querySelectorAll(".filtro-btn").forEach(function (botao) {
      var texto = normalizarCategoriaProdutos(botao.textContent);
      botao.classList.toggle("ativo", texto === categoriaInicial);
    });

    if (window.location.hash.startsWith("#categoria-")) {
      window.requestAnimationFrame(function () {
        document.getElementById("produtos-container")?.scrollIntoView({ block: "start" });
      });
    } else if (window.location.hash.startsWith("#produto-")) {
      window.requestAnimationFrame(function () {
        document.querySelector(window.location.hash)?.scrollIntoView({ block: "start" });
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

  function trackWhatsAppClick(produtoOuNome, preco, origem) {
    var produto = normalizarProdutoParaTracking(produtoOuNome, preco);

    rastrearEvento("click_whatsapp", {
      produto_id: produto.id,
      produto_nome: produto.nome,
      categoria: produto.categoria,
      valor: produto.preco,
      origem: origem || "nao_informada"
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

        trackWhatsAppClick(produto || "WhatsApp", produto ? produto.preco : 0, link.dataset.trackSource);
      });
    });

    document.querySelectorAll(".nav-menu a").forEach(function (link) {
      if (link.dataset.navigationTrackingInitialized === "true") return;
      link.dataset.navigationTrackingInitialized = "true";

      link.addEventListener("click", function () {
        rastrearEvento("select_navigation", {
          label: (link.textContent || "").trim(),
          url: link.getAttribute("href") || ""
        });
      });
    });

    document.querySelectorAll(".category-card").forEach(function (link) {
      if (link.dataset.categoryTrackingInitialized === "true") return;
      link.dataset.categoryTrackingInitialized = "true";

      link.addEventListener("click", function () {
        rastrearEvento("select_home_category", {
          label: (link.textContent || "").trim(),
          url: link.getAttribute("href") || ""
        });
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

    function fecharMenu(devolverFoco) {
      navMenu.classList.remove("ativo");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      if (devolverFoco) menuToggle.focus();
    }

    menuToggle.addEventListener("click", function () {
      var aberto = navMenu.classList.toggle("ativo");
      menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
      menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        fecharMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navMenu.classList.contains("ativo")) {
        fecharMenu(true);
      }
    });

    document.addEventListener("click", function (event) {
      if (!navMenu.classList.contains("ativo")) return;
      if (navMenu.contains(event.target) || menuToggle.contains(event.target)) return;
      fecharMenu(false);
    });
  }

  function integrarBuquesArtificiaisCarrosselMobile() {
    var caminho = removerAcentos(window.location.pathname);
    if (!caminho.includes("buques-canaa-dos-carajas")) return;

    var galeria = document.querySelector(".seo-gallery .seo-gallery-grid");
    var gradeProdutos = document.querySelector(".seo-products .produtos-grid");
    var telaMobile = window.matchMedia("(max-width: 767px)");
    var idsArtificiais = ["52", "53", "54", "55", "56", "57"];

    if (!galeria || !gradeProdutos) return;

    var registros = idsArtificiais.map(function (produtoId) {
      var card = document.getElementById("produto-" + produtoId);
      if (!card || !gradeProdutos.contains(card)) return null;

      var marcador = document.createComment("origem-produto-" + produtoId);
      card.before(marcador);
      return { card: card, marcador: marcador };
    }).filter(Boolean);

    if (!registros.length) return;

    function notificarMudanca() {
      galeria.dispatchEvent(new CustomEvent("zadoni:gallery-items-change"));
      gradeProdutos.dispatchEvent(new CustomEvent("zadoni:gallery-items-change"));
    }

    function moverParaGaleria() {
      var mudou = false;

      registros.forEach(function (registro) {
        if (registro.card.parentElement === galeria) return;
        registro.card.classList.add("seo-gallery-item", "seo-gallery-carousel-product");
        registro.card.dataset.carouselType = "artificial";
        galeria.appendChild(registro.card);
        mudou = true;
      });

      if (mudou) notificarMudanca();
    }

    function restaurarNaGrade() {
      var mudou = false;

      registros.forEach(function (registro) {
        if (registro.card.parentElement !== galeria || !registro.marcador.parentNode) return;
        registro.marcador.parentNode.insertBefore(registro.card, registro.marcador.nextSibling);
        registro.card.classList.remove("seo-gallery-item", "seo-gallery-carousel-product");
        delete registro.card.dataset.carouselType;
        mudou = true;
      });

      if (mudou) notificarMudanca();
    }

    function atualizarIntegracao() {
      if (telaMobile.matches) moverParaGaleria();
      else restaurarNaGrade();
    }

    atualizarIntegracao();
    if (typeof telaMobile.addEventListener === "function") {
      telaMobile.addEventListener("change", atualizarIntegracao);
    } else if (typeof telaMobile.addListener === "function") {
      telaMobile.addListener(atualizarIntegracao);
    }
  }

  function inicializarCarrosseisGaleriaMobile() {
    var movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    var telaMobile = window.matchMedia("(max-width: 767px)");

    document.querySelectorAll(".seo-gallery-grid, .produtos-grid").forEach(function (galeria) {
      var carrosselProdutos = galeria.classList.contains("produtos-grid");
      var carrosselDinamico = galeria.id === "produtos-container";
      var seletorItens = carrosselProdutos ? ":scope > .produto-card" : ":scope > .seo-gallery-item";
      var rotuloItem = carrosselProdutos ? "Item" : "Modelo";
      var rotuloItemMinusculo = carrosselProdutos ? "item" : "modelo";
      var modelos = Array.prototype.slice.call(galeria.querySelectorAll(seletorItens));

      if (modelos.length < 2 || galeria.dataset.carouselInitialized === "true") return;

      galeria.dataset.carouselInitialized = "true";

      var controles = document.createElement("div");
      controles.className = "seo-gallery-carousel-controls";

      var status = document.createElement("div");
      status.className = "seo-gallery-carousel-status";

      var contador = document.createElement("strong");
      contador.className = "seo-gallery-carousel-counter";
      contador.setAttribute("aria-live", "polite");
      contador.setAttribute("aria-atomic", "true");

      var instrucao = document.createElement("span");
      instrucao.className = "seo-gallery-carousel-hint";
      instrucao.textContent = "Deslize para ver os próximos";

      var progresso = document.createElement("div");
      progresso.className = "seo-gallery-carousel-progress";
      progresso.setAttribute("aria-hidden", "true");

      var barraProgresso = document.createElement("span");
      progresso.appendChild(barraProgresso);
      status.append(contador, instrucao, progresso);

      var navegacao = document.createElement("div");
      navegacao.className = "seo-gallery-carousel-navigation";

      function criarBotaoNavegacao(direcao, simbolo) {
        var botao = document.createElement("button");
        botao.type = "button";
        botao.className = "seo-gallery-carousel-button";
        botao.setAttribute("aria-label", direcao === "anterior"
          ? "Ver " + rotuloItemMinusculo + " anterior"
          : "Ver próximo " + rotuloItemMinusculo);
        botao.textContent = simbolo;
        return botao;
      }

      var anterior = criarBotaoNavegacao("anterior", "‹");
      var proximo = criarBotaoNavegacao("proximo", "›");
      navegacao.append(anterior, proximo);
      controles.append(status, navegacao);
      galeria.before(controles);

      var indiceAtivo = 0;
      var atualizacaoPendente = false;

      function carrosselHabilitado() {
        return modelos.length > 1 && (!carrosselDinamico || galeria.dataset.carouselEnabled === "true");
      }

      function atualizarInterface(novoIndice) {
        if (!modelos.length) return;
        indiceAtivo = Math.max(0, Math.min(modelos.length - 1, novoIndice));
        contador.textContent = rotuloItem + " " + (indiceAtivo + 1) + " de " + modelos.length;
        barraProgresso.style.width = ((indiceAtivo + 1) / modelos.length * 100) + "%";
        anterior.disabled = indiceAtivo === 0;
        proximo.disabled = indiceAtivo === modelos.length - 1;
      }

      function obterIndiceVisivel() {
        var inicioGaleria = galeria.getBoundingClientRect().left;
        var melhorIndice = 0;
        var menorDistancia = Infinity;

        modelos.forEach(function (modelo, index) {
          var distancia = Math.abs(modelo.getBoundingClientRect().left - inicioGaleria);
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            melhorIndice = index;
          }
        });

        return melhorIndice;
      }

      function acompanharRolagem() {
        if (!carrosselHabilitado() || atualizacaoPendente) return;
        atualizacaoPendente = true;
        window.requestAnimationFrame(function () {
          atualizacaoPendente = false;
          atualizarInterface(obterIndiceVisivel());
        });
      }

      function irParaModelo(index) {
        if (!carrosselHabilitado()) return;
        var destino = modelos[Math.max(0, Math.min(modelos.length - 1, index))];
        if (!destino) return;

        var distancia = galeria.scrollLeft
          + destino.getBoundingClientRect().left
          - galeria.getBoundingClientRect().left;

        galeria.scrollTo({
          left: distancia,
          behavior: movimentoReduzido.matches ? "auto" : "smooth"
        });
      }

      function configurarModoMobile() {
        if (telaMobile.matches && carrosselHabilitado()) {
          galeria.setAttribute("role", "region");
          galeria.setAttribute("aria-roledescription", "carrossel");
          galeria.setAttribute("aria-label", carrosselProdutos ? "Itens disponíveis" : "Modelos disponíveis");
          galeria.tabIndex = 0;
          modelos.forEach(function (modelo, index) {
            modelo.setAttribute("role", "group");
            modelo.setAttribute("aria-roledescription", "slide");
            modelo.setAttribute("aria-label", rotuloItem + " " + (index + 1) + " de " + modelos.length);
          });
          acompanharRolagem();
          return;
        }

        galeria.removeAttribute("role");
        galeria.removeAttribute("aria-roledescription");
        galeria.removeAttribute("aria-label");
        galeria.removeAttribute("tabindex");
        modelos.forEach(function (modelo) {
          modelo.removeAttribute("role");
          modelo.removeAttribute("aria-roledescription");
          modelo.removeAttribute("aria-label");
        });
      }

      function aplicarEstadoCarrossel() {
        var habilitado = carrosselHabilitado();
        galeria.classList.toggle("seo-gallery-carousel", habilitado);
        controles.hidden = !habilitado;
        if (!habilitado) galeria.scrollLeft = 0;
        configurarModoMobile();
        if (modelos.length) atualizarInterface(telaMobile.matches && habilitado ? obterIndiceVisivel() : 0);
      }

      function sincronizarModelos() {
        var modelosAnteriores = modelos.slice();
        var modelosAtuais = Array.prototype.slice.call(galeria.querySelectorAll(seletorItens));

        modelosAnteriores.forEach(function (modelo) {
          if (modelosAtuais.includes(modelo)) return;
          modelo.removeAttribute("role");
          modelo.removeAttribute("aria-roledescription");
          modelo.removeAttribute("aria-label");
        });

        modelos = modelosAtuais;
        indiceAtivo = modelos.length ? Math.min(indiceAtivo, modelos.length - 1) : 0;
        aplicarEstadoCarrossel();
      }

      anterior.addEventListener("click", function () {
        irParaModelo(indiceAtivo - 1);
      });
      proximo.addEventListener("click", function () {
        irParaModelo(indiceAtivo + 1);
      });
      galeria.addEventListener("scroll", acompanharRolagem, { passive: true });
      galeria.addEventListener("zadoni:gallery-items-change", sincronizarModelos);
      galeria.addEventListener("keydown", function (event) {
        if (!telaMobile.matches || !carrosselHabilitado() || event.target !== galeria) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          irParaModelo(indiceAtivo - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          irParaModelo(indiceAtivo + 1);
        }
      });

      aplicarEstadoCarrossel();
      if (typeof telaMobile.addEventListener === "function") {
        telaMobile.addEventListener("change", aplicarEstadoCarrossel);
      } else if (typeof telaMobile.addListener === "function") {
        telaMobile.addListener(aplicarEstadoCarrossel);
      }
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
    inicializarAdicionaisModelosGaleria();
    inicializarAdicionaisCardsSeo();
    inicializarExplicacoesRecolhiveisMobile();
    integrarBuquesArtificiaisCarrosselMobile();
    inicializarCarrosseisGaleriaMobile();
    inicializarAtalhoModelosMobile();
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
