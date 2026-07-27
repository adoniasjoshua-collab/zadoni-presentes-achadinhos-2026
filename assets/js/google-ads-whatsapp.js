/**
 * Google Ads conversion tracking for real WhatsApp clicks.
 * Does not send href, phone, message text, or user data to Google Ads.
 */
(function () {
  var CONVERSION_DESTINATION = "AW-16938428518/zsa-CO2Px9ccEObQ74w_";

  if (window.__zadoniGoogleAdsWhatsAppTrackingInitialized) return;
  window.__zadoniGoogleAdsWhatsAppTrackingInitialized = true;

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
