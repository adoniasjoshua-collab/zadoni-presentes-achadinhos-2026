(function () {
  "use strict";

  function safeHost(href) {
    try {
      return new URL(href, window.location.href).hostname;
    } catch (_error) {
      return "";
    }
  }

  function trackAffiliateClick(link) {
    const detail = {
      event: "affiliate_click",
      affiliate_partner: link.dataset.affiliatePartner || "unknown",
      item_id: link.dataset.itemId || "unknown",
      placement: link.dataset.placement || "content",
      destination_host: safeHost(link.href),
      page_path: window.location.pathname
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent("zadoni:affiliate-click", { detail }));
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[data-affiliate-link]");
    if (!link) return;
    trackAffiliateClick(link);
  });
})();
