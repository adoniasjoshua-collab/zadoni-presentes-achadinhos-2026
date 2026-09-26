/* Progressive enhancement; WhatsApp and its click tracking come from the existing site. */
(function () {
  'use strict';
  const form = document.querySelector('[data-gift-form]');
  if (!form) return;
  const result = document.querySelector('[data-gift-summary]');
  const preview = result.querySelector('pre');
  const send = result.querySelector('[data-gift-send]');
  const baseURL = new URL(send.href);
  const status = document.querySelector('[data-gift-status]');
  const message = form.elements.namedItem('message');
  const custom = form.elements.namedItem('custom-message');
  const customField = custom.closest('.gift-field');
  const quickPreview = form.querySelector('[data-message-preview]');
  const storageKey = 'zadoni-gift-preferences-v1';
  const savedFields = ['recipient', 'occasion', 'style', 'budget', 'fulfillment', 'message'];
  const contexts = {
    'catalogo': 'Catálogo local', 'buques-canaa-dos-carajas': 'Buquês',
    'cestas-de-presente-canaa': 'Cestas de presente', 'cesta-de-aniversario-canaa': 'Cestas de aniversário',
    'cesta-cafe-da-manha-canaa': 'Café da manhã', 'floricultura-canaa-dos-carajas': 'Flores',
    'presentes-canaa-dos-carajas': 'Presentes locais', 'presentes-romanticos-canaa': 'Presentes românticos',
    'rosas-perfumadas-canaa': 'Rosas perfumadas', 'revenda-chocolates-canaa': 'Chocolates',
    'perfumaria-cosmeticos-canaa': 'Perfumaria', 'monte-sua-cesta': 'Cesta personalizada'
  };
  let category = '';
  function savePreferences() {
    const values = { category };
    savedFields.forEach(name => { values[name] = form.elements.namedItem(name).value; });
    try { sessionStorage.setItem(storageKey, JSON.stringify(values)); } catch (_) { /* Storage is optional. */ }
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    savedFields.forEach(name => {
      const field = form.elements.namedItem(name);
      if ([...field.options].some(option => option.value === saved[name])) field.value = saved[name];
    });
    if (Object.values(contexts).includes(saved.category)) category = saved.category;
  } catch (_) { /* Invalid or unavailable storage must not block the form. */ }
  const params = new URLSearchParams(location.search);
  const fragment = new URLSearchParams(location.hash.slice(1));
  if (contexts[fragment.get('contexto')]) category = contexts[fragment.get('contexto')];
  if (params.get('ocasiao') === 'natal' && !form.elements.namedItem('occasion').value) {
    form.elements.namedItem('occasion').value = 'Natal';
  }
  const contextNote = document.createElement('p');
  contextNote.textContent = category ? 'Você veio de: ' + category + '. As preferências abaixo podem ser alteradas.' : '';
  contextNote.hidden = !category;
  form.prepend(contextNote);

  function selectedMessage() {
    return message.value === 'Escrever minha mensagem' ? custom.value.trim() : message.value;
  }

  function refreshMessage() {
    const useCustom = message.value === 'Escrever minha mensagem';
    customField.hidden = !useCustom;
    custom.disabled = !useCustom;
    custom.required = useCustom;
    custom.setCustomValidity('');
    if (quickPreview) {
      const text = selectedMessage();
      quickPreview.hidden = !text;
      quickPreview.querySelector('p').textContent = text;
      const url = new URL(baseURL.href);
      url.searchParams.set('text', 'Olá, Zadoni! Gostaria de consultar um cartão com esta mensagem:\n\n' + text + '\n\nPodem me orientar sobre o presente e a disponibilidade?');
      quickPreview.querySelector('a').href = url.href;
    }
  }

  function summarize() {
    const data = new FormData(form);
    const chosen = data.get('message') === 'Escrever minha mensagem'
      ? String(data.get('custom-message') || '').trim() : data.get('message');
    return 'Olá, Zadoni! Quero ajuda para escolher um presente.\n\n' + [
      '🎁 Para: ' + data.get('recipient'),
      '✨ Ocasião: ' + data.get('occasion'),
      '🎨 Estilo: ' + data.get('style'),
      '💰 Faixa desejada: ' + data.get('budget'),
      '💌 Mensagem escolhida: “' + chosen + '”',
      '📍 Entrega ou retirada: ' + data.get('fulfillment'),
      '📅 Data desejada: ' + (data.get('desired-date') || 'A combinar'),
      '🔎 Categoria de interesse: ' + (category || 'Quero sugestões'),
      '📝 Observação: ' + (String(data.get('notes') || '').trim() || 'Não informada')
    ].join('\n');
  }

  function invalidate() {
    result.hidden = true;
    send.href = baseURL.href;
    status.textContent = '';
    refreshMessage();
    savePreferences();
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (message.value === 'Escrever minha mensagem' && !custom.value.trim()) {
      custom.setCustomValidity('Escreva sua mensagem ou escolha uma das sugestões.');
      custom.reportValidity();
      return;
    }
    const text = summarize();
    const url = new URL(baseURL.href);
    url.searchParams.set('text', text);
    preview.textContent = text;
    send.href = url.href;
    result.hidden = false;
    status.textContent = 'Resumo pronto. Confira os detalhes antes de abrir o WhatsApp.';
    result.querySelector('h3').focus();
  });
  custom.addEventListener('input', function () { custom.setCustomValidity(''); });
  document.querySelectorAll('[data-use-message]').forEach(function (button) {
    button.addEventListener('click', function () {
      message.value = button.dataset.useMessage;
      invalidate();
      if (button.dataset.messageRecipient && !form.elements.namedItem('recipient').value) form.elements.namedItem('recipient').value = button.dataset.messageRecipient;
      if (button.dataset.messageOccasion && !form.elements.namedItem('occasion').value) form.elements.namedItem('occasion').value = button.dataset.messageOccasion;
      savePreferences();
      status.textContent = 'Mensagem selecionada. Suas escolhas anteriores foram mantidas. Confira a prévia ou complete as preferências.';
      form.scrollIntoView({ block: 'start', behavior: 'auto' });
      form.elements.namedItem('recipient').focus({ preventScroll: true });
    });
    button.hidden = false;
  });
  form.addEventListener('reset', function () {
    // Native reset updates controls after this event has completed.
    setTimeout(function () {
      category = '';
      contextNote.hidden = true;
      custom.setCustomValidity('');
      invalidate();
      try { sessionStorage.removeItem(storageKey); } catch (_) { /* Optional storage. */ }
      status.textContent = 'Preferências limpas.';
    }, 0);
  });
  refreshMessage();
  savePreferences();
  form.hidden = false;
})();
