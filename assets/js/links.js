(function () {
  "use strict";

  var choices = Array.prototype.slice.call(document.querySelectorAll("[data-choice]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
  var feedback = document.getElementById("choice-feedback");

  var labels = {
    local: "Mostrando opções com atendimento e entrega em Canaã.",
    ajuda: "Mostrando o atendimento guiado da Zadoni.",
    nacional: "Mostrando ideias dos Achadinhos para comprar online em todo o Brasil."
  };

  function track(eventName, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: eventName,
      page_type: "biolink"
    }, data || {}));
  }

  function activateChoice(choiceName, announce) {
    var activeChoice = null;
    var activePanel = null;

    choices.forEach(function (choice) {
      var isActive = choice.dataset.choice === choiceName;
      choice.setAttribute("aria-expanded", isActive ? "true" : "false");
      choice.classList.toggle("is-active", isActive);
      if (isActive) activeChoice = choice;
    });

    panels.forEach(function (panel) {
      var isActive = panel.dataset.panel === choiceName;
      panel.classList.toggle("is-active", isActive);
      if (isActive) activePanel = panel;
    });

    if (!activeChoice || !activePanel) return;

    if (feedback) feedback.textContent = labels[choiceName] || "Opções atualizadas.";

    if (announce) {
      track("bio_select_path", {
        path_selected: choiceName,
        path_label: (activeChoice.textContent || "").trim().replace(/\s+/g, " ")
      });
    }
  }

  choices.forEach(function (choice) {
    choice.addEventListener("click", function () {
      activateChoice(choice.dataset.choice, true);
    });
  });

  document.querySelectorAll("[data-bio-link]").forEach(function (link, index) {
    link.addEventListener("click", function () {
      track("bio_click_link", {
        link_id: link.dataset.bioLink,
        link_group: link.dataset.bioGroup || "nao_informado",
        link_position: index + 1,
        link_destination: link.getAttribute("href") || ""
      });
    });
  });

  var requestedPath = window.location.hash.replace("#", "");
  if (requestedPath && labels[requestedPath]) {
    activateChoice(requestedPath, false);
  }
})();
