/**
 * Origem da visita na mensagem do WhatsApp.
 * Guarda na aba (sessionStorage) de onde a visita veio e, no clique em um
 * link de WhatsApp, acrescenta ao texto uma linha como
 * "Origem: Instagram bio › Links › Buquês".
 * Bio do Instagram: https://zadonipresentes.com.br/links/?origem=ig_bio
 * Nada é enviado a terceiros e nenhum dado pessoal é lido.
 */
(function () {
  if (window.__zadoniWhatsAppOriginInitialized) return;
  window.__zadoniWhatsAppOriginInitialized = true;

  var STORAGE_KEY = "zadoniOrigem";
  var LINE_PREFIX = "Origem: ";
  var SEPARATOR = " › ";
  var SOURCES = {
    ig_bio: "Instagram bio",
    ig_stories: "Instagram stories",
    ig_post: "Instagram post",
    ig_reels: "Instagram reels",
    ig_direct: "Instagram direct",
    instagram: "Instagram",
    wa_status: "Status do WhatsApp",
    whatsapp: "WhatsApp",
    google_perfil: "Perfil do Google",
    google: "Google",
    facebook: "Facebook",
    fb: "Facebook"
  };
  var PAGES = {
    "links": "Links",
    "buques-canaa-dos-carajas": "Buquês",
    "floricultura-canaa-dos-carajas": "Floricultura",
    "presentes-canaa": "Catálogo",
    "presentes-canaa-dos-carajas": "Presentes",
    "cestas-de-presente-canaa": "Cestas",
    "cesta-cafe-da-manha-canaa": "Cesta de café",
    "cesta-de-aniversario-canaa": "Cesta de aniversário",
    "presentes-de-natal-canaa-dos-carajas": "Natal",
    "presentes-romanticos-canaa": "Namorada",
    "rosas-perfumadas-canaa": "Rosas perfumadas",
    "revenda-chocolates-canaa": "Chocolates",
    "monte-sua-cesta": "Monte sua cesta",
    "guias-de-presentes": "Guias",
    "mensagens-para-acompanhar-presentes": "Mensagens",
    "perfumaria-cosmeticos-canaa": "Perfumaria",
    "combos-pastel-canaa": "Pastel",
    "achadinhos": "Achadinhos"
  };

  function pageName() {
    if (/n[aã]o encontrada/i.test(document.title || "")) return "Página não encontrada";
    var parts = String(window.location.pathname || "").toLowerCase().split("/").filter(Boolean);
    for (var i = parts.length - 1; i >= 0; i--) {
      var slug = parts[i].replace(/\.html?$/, "");
      if (Object.prototype.hasOwnProperty.call(PAGES, slug)) return PAGES[slug];
    }
    var last = parts[parts.length - 1] || "";
    return !last || /^index\.html?$/.test(last) ? "Inicial" : "Outra página";
  }

  function sourceFromCode(value) {
    var code = String(value || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
    if (!code) return "";
    return SOURCES[code] || code.replace(/[_-]+/g, " ");
  }

  function sameSite(host) {
    var strip = function (h) { return String(h || "").toLowerCase().replace(/^www\./, ""); };
    return strip(host) === strip(window.location.hostname);
  }

  // Sinal forte: código no link, anúncio ou site externo de onde a visita veio.
  function strongSource() {
    var params = null;
    try { params = new URLSearchParams(window.location.search); } catch (error) {}
    var get = function (name) { return params ? params.get(name) || "" : ""; };
    var code = sourceFromCode(get("origem"));
    if (code) return code;
    if (get("gclid") || get("gbraid") || get("wbraid")) return "Google Ads";
    code = sourceFromCode(get("utm_source"));
    if (code && code !== "site") return code;

    var host = "";
    try { host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""; } catch (error) {}
    if (!host || sameSite(host)) return "";
    if (/(^|\.)google\./.test(host)) return "Google";
    if (/(^|\.)bing\.com$/.test(host)) return "Bing";
    if (/instagram\.com$/.test(host)) return "Instagram";
    if (/(facebook|fb)\.com$/.test(host)) return "Facebook";
    if (/(whatsapp\.com|wa\.me)$/.test(host)) return "WhatsApp";
    return host.replace(/^www\./, "").slice(0, 40);
  }

  // Sinal fraco: navegador interno do app. Só vale quando a aba ainda não tem origem.
  function appSource() {
    var ua = navigator.userAgent || "";
    if (/Instagram/i.test(ua)) return "Instagram";
    if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook";
    return "";
  }

  function readStored() {
    try {
      var saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.fonte && saved.entrada) return saved;
    } catch (error) {}
    return null;
  }

  var visit = (function () {
    var current = pageName();
    var stored = readStored();
    var strong = strongSource();
    var next = strong ? { fonte: strong, entrada: current }
      : stored || { fonte: appSource() || "Site direto", entrada: current };
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (error) {}
    return next;
  })();

  function originLine() {
    var page = pageName();
    var parts = [visit.fonte];
    if (visit.entrada && visit.entrada !== page) parts.push(visit.entrada);
    parts.push(page);
    return LINE_PREFIX + parts.join(SEPARATOR);
  }

  function isWhatsApp(link) {
    return /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(link || "");
  }

  // Troca só o parâmetro text; uma linha de origem anterior é substituída, nunca repetida.
  function withOrigin(link) {
    var target = new URL(link);
    var text = target.searchParams.get("text") || "Olá, Zadoni!";
    var lines = text.replace(/\r/g, "").split("\n").filter(function (line) {
      return !/^_?Origem: /.test(line.trim());
    });
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    lines.push("", originLine());
    var finalText = lines.join("\n");
    var query = [];
    var hasText = false;
    target.searchParams.forEach(function (value, key) {
      if (key === "text") hasText = true;
      query.push(encodeURIComponent(key) + "=" + encodeURIComponent(key === "text" ? finalText : value));
    });
    if (!hasText) query.unshift("text=" + encodeURIComponent(finalText));
    target.search = "?" + query.join("&");
    return target.toString();
  }

  function tagLink(event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link || !isWhatsApp(link.href)) return;
    try { link.href = withOrigin(link.href); } catch (error) {}
  }

  window.__zadoniWhatsAppOrigin = { visit: visit, line: originLine, tag: withOrigin };

  // Captura: antes do envio de conversão. Bolha na janela: depois de scripts
  // que remontam o link no próprio clique (ex.: Monte sua cesta).
  ["click", "auxclick", "contextmenu"].forEach(function (type) {
    document.addEventListener(type, tagLink, true);
    window.addEventListener(type, tagLink, false);
  });
})();

/**
 * Google Ads conversion tracking for real WhatsApp clicks.
 * Does not send href, phone, message text, or user data to Google Ads.
 */
(function () {
  var CONVERSION_DESTINATION = "AW-16938428518/zsa-CO2Px9ccEObQ74w_";

  if (window.__zadoniGoogleAdsWhatsAppTrackingInitialized) return;
  window.__zadoniGoogleAdsWhatsAppTrackingInitialized = true;

  // GA4 (G-5H81G3277H, carregado pela mesma tag Google): um evento whatsapp_click por clique,
  // com a página, o nome do card ou o texto do botão e a origem. Nunca envia o link do WhatsApp
  // nem o texto da mensagem, e não atrasa a abertura do WhatsApp (beacon, sem callback).
  function clickLabel(link) {
    var card = link.closest ? link.closest("figure, article, .produto-card, .seo-gallery-item") : null;
    var name = card && card.querySelector ? card.querySelector(".produto-nome, figcaption span, h3") : null;
    var text = (name && name.textContent) || link.getAttribute("aria-label") || link.textContent || "";
    return text.replace(/\s+/g, " ").trim().slice(0, 100);
  }

  function reportWhatsAppClick(link) {
    if (typeof window.gtag !== "function") return;
    var origem = "";
    try { origem = window.__zadoniWhatsAppOrigin.line().replace(/^Origem: /, ""); } catch (error) {}
    try {
      window.gtag("event", "whatsapp_click", {
        page_path: window.location.pathname,
        link_text: clickLabel(link),
        origem: origem.slice(0, 100),
        transport_type: "beacon"
      });
    } catch (error) {}
  }

  window.gtag_report_conversion = function gtag_report_conversion(url, openInNewTab) {
    var navigated = false;

    var navigate = function () {
      if (navigated || !url) return;
      navigated = true;

      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    };

    if (typeof window.gtag !== "function") {
      navigate();
      return false;
    }

    window.gtag("event", "conversion", {
      send_to: CONVERSION_DESTINATION,
      value: 1.0,
      currency: "BRL",
      event_callback: navigate
    });

    window.setTimeout(navigate, 800);

    return false;
  };

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;

    var href = link.href || "";
    var isWhatsApp =
      href.indexOf("wa.me/") !== -1 ||
      href.indexOf("api.whatsapp.com/") !== -1 ||
      href.indexOf("web.whatsapp.com/") !== -1;

    if (!isWhatsApp) return;

    reportWhatsAppClick(link);

    var openInNewTab = String(link.target || "").toLowerCase() === "_blank";

    if (openInNewTab) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: CONVERSION_DESTINATION,
          value: 1.0,
          currency: "BRL"
        });
      }
      return;
    }

    event.preventDefault();
    window.gtag_report_conversion(href, false);
  });
})();
