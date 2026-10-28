/* Scoped to the combos page. All amounts are integer centavos.
   No personal data is persisted or sent until the customer opens WhatsApp. */
(function () {
  'use strict';
  const data = JSON.parse(document.getElementById('combos-data').textContent);
  const form = document.querySelector('[data-order-form]');
  if (!form) return;
  const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const section = document.getElementById('meu-pedido');
  const send = form.querySelector('[data-send-order]');
  const error = form.querySelector('[data-form-error]');
  // One choice per order: pickup is free, delivery adds the flat fee once.
  let fulfillment = 'entrega';
  const fee = () => fulfillment === 'entrega' ? data.delivery.price : 0;
  // Optional customer details shown in the order form.
  const customer = { name: '', address: '', payment: '', change: '', when: '', time: '' };
  const pastelLabel = n => `${n} ${n === 1 ? 'pastelão' : 'pastelões'}`;
  function quantity(input) {
    const parsed = Number(input.value);
    return Math.min(Number(input.max), Math.max(Number(input.min), Number.isFinite(parsed) ? Math.floor(parsed) : Number(input.min)));
  }
  function normalize(input) {
    input.value = quantity(input);
    const group = input.closest('.quantity');
    group.querySelector('[data-step="-1"]').disabled = Number(input.value) <= Number(input.min);
    group.querySelector('[data-step="1"]').disabled = Number(input.value) >= Number(input.max);
  }
  // Every pair of pastels, whatever the fillings, costs the duo price; an odd one costs the single price.
  const pastelPrice = n => Math.floor(n / 2) * data.duplo.price + (n % 2) * data.price;
  function priceRule(n) {
    const pairs = Math.floor(n / 2);
    return [pairs ? `${pairs} ${pairs === 1 ? 'dupla' : 'duplas'} × ${money(data.duplo.price)}` : '', n % 2 ? `1 avulso × ${money(data.price)}` : ''].filter(Boolean).join(' + ');
  }
  function state() {
    const flavors = data.flavors.map(f => ({ ...f, quantity: quantity(form.querySelector(`[data-flavor-qty="${f.id}"] input`)) })).filter(f => f.quantity > 0);
    const extras = data.extras.map(e => ({ ...e, quantity: quantity(form.querySelector(`[data-extra="${e.id}"] input`)) })).filter(e => e.quantity > 0);
    const count = flavors.reduce((sum, f) => sum + f.quantity, 0);
    const pastels = pastelPrice(count);
    const extrasTotal = extras.reduce((sum, e) => sum + e.price * e.quantity, 0);
    return {
      flavors, extras, count, pastels, extrasTotal, total: pastels + extrasTotal,
      notes: form.elements.notes.value.trim(),
      personalization: extras.some(e => e.id === 'caixinha') ? form.elements.personalization.value.trim() : ''
    };
  }
  function totalHTML(s) {
    if (!s.count) return '<p>Escolha a quantidade de pelo menos um recheio.</p>';
    return `<div class="total-line"><span>${pastelLabel(s.count)} <small>(${priceRule(s.count)})</small></span><strong>${money(s.pastels)}</strong></div>${s.extrasTotal ? `<div class="total-line"><span>Bebidas e adicionais</span><strong>${money(s.extrasTotal)}</strong></div>` : ''}<div class="total-line"><span>${fulfillment === 'entrega' ? 'Entrega' : 'Retirada'}</span><strong>${fulfillment === 'entrega' ? money(fee()) : 'sem taxa'}</strong></div><div class="total-line grand-total"><span>Total</span><strong>${money(s.total + fee())}</strong></div>`;
  }
  // Message read by the attendant: only Basic Multilingual Plane symbols: 4-byte emojis arrive as � when WhatsApp opens wa.me links.
  function customerLines() {
    const lines = [];
    if (customer.name) lines.push('▸ Nome: ' + customer.name);
    if (fulfillment === 'entrega' && customer.address) lines.push('▸ Endereço: ' + customer.address);
    const payment = (data.payments || []).find(p => p.id === customer.payment);
    if (payment) lines.push('▸ Pagamento: ' + payment.name + (payment.id === 'dinheiro' && customer.change ? ` (troco para ${customer.change})` : ''));
    if (customer.when === 'agora') lines.push('⏰ Horário: o quanto antes');
    if (customer.when === 'agendar') lines.push('⏰ Horário: ' + (customer.time ? `agendar para ${customer.time}` : 'quero agendar (combino por aqui)'));
    return lines;
  }
  function message(s) {
    const rule = '━━━━━━━━━━━━━━';
    const lines = ['Olá, Zadoni! Quero fazer este pedido:', '',
      `${fulfillment === 'entrega' ? '✅ *ENTREGA*' : '✅ *RETIRADA*'} · ${pastelLabel(s.count)}`, rule, '', '*PASTELÕES*'];
    s.flavors.forEach(f => lines.push(`⭐ ${f.quantity}× ${f.name}`));
    lines.push(`▸ ${priceRule(s.count)} = ${money(s.pastels)}`);
    if (s.extras.length) {
      lines.push('', '*BEBIDAS E ADICIONAIS*');
      s.extras.forEach(e => lines.push(`➕ ${e.quantity}× ${e.name} — ${money(e.quantity * e.price)}`));
    }
    if (s.personalization) lines.push('✨ Caixinhas: ' + s.personalization);
    if (s.notes) lines.push('✏ Obs.: ' + s.notes);
    lines.push('', rule, '*VALORES*', `Produtos: ${money(s.total)}`,
      fulfillment === 'entrega' ? `Entrega na zona urbana: ${money(fee())}` : 'Retirada: sem taxa',
      `▶ *TOTAL: ${money(s.total + fee())}*`);
    const details = customerLines();
    if (details.length) lines.push('', '*DADOS DO CLIENTE*', ...details);
    lines.push('', fulfillment === 'entrega' ? 'Pode confirmar a disponibilidade e o horário de entrega?' : 'Pode confirmar a disponibilidade, o local e o horário de retirada?', '_Origem: página do pastelão_');
    return lines.join('\n');
  }
  function whatsapp(s) {
    const url = new URL('https://wa.me/' + data.phone);
    url.searchParams.set('text', message(s));
    url.searchParams.set('utm_source', 'site');
    url.searchParams.set('utm_medium', 'whatsapp');
    url.searchParams.set('utm_campaign', 'seo_local');
    url.searchParams.set('utm_content', 'combos_pastel');
    return url.href;
  }
  function customerHTML(prefix) {
    const payments = (data.payments || []).map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
    return `<fieldset class="customer" data-customer><legend><span data-customer-title>Dados para entrega</span> <small>(ou informe no WhatsApp)</small></legend>`
      + `<div data-show="address"><label for="${prefix}-endereco">Endereço ou bairro da entrega</label><input id="${prefix}-endereco" data-field="address" maxlength="160" autocomplete="street-address" placeholder="Rua, número e bairro"></div>`
      + `<details class="customer-options"><summary>Nome, pagamento e horário (opcional)</summary><label for="${prefix}-nome">Nome</label><input id="${prefix}-nome" data-field="name" maxlength="60" autocomplete="name"><label for="${prefix}-pagamento">Forma de pagamento</label><select id="${prefix}-pagamento" data-field="payment"><option value="">Escolher depois</option>${payments}</select>`
      + `<div data-show="change" hidden><label for="${prefix}-troco">Troco para quanto?</label><input id="${prefix}-troco" data-field="change" maxlength="20" inputmode="decimal" placeholder="Ex.: R$ 50"></div>`
      + `<label for="${prefix}-quando">Quando?</label><select id="${prefix}-quando" data-field="when"><option value="">Escolher depois</option><option value="agora">O quanto antes</option><option value="agendar">Agendar horário</option></select>`
      + `<div data-show="time" hidden><label for="${prefix}-hora">Horário desejado</label><input id="${prefix}-hora" data-field="time" type="time" min="07:00" max="23:00"></div>`
      + '<p class="small">Aceitamos Pix, dinheiro e cartão de crédito pelo link de pagamento InfinityPay.</p></details></fieldset>';
  }
  function syncCustomer() {
    const box = form.querySelector('[data-customer]');
    box.querySelector('[data-show="address"]').hidden = fulfillment !== 'entrega';
    box.querySelector('[data-customer-title]').textContent = fulfillment === 'entrega' ? 'Dados para entrega' : 'Seus dados';
    box.querySelector('[data-show="change"]').hidden = customer.payment !== 'dinheiro';
    box.querySelector('[data-show="time"]').hidden = customer.when !== 'agendar';
  }
  // The bar only points to the order form, so hide it while the form is on screen.
  let formInView = false;
  function render() {
    form.querySelectorAll('input[type="number"]').forEach(normalize);
    const box = quantity(form.querySelector('[data-extra="caixinha"] input')) > 0;
    form.querySelector('.personalization').hidden = !box;
    form.elements.personalization.disabled = !box;
    form.querySelectorAll('[data-extra]').forEach(row => {
      const extra = data.extras.find(e => e.id === row.dataset.extra);
      const count = quantity(row.querySelector('input'));
      row.querySelector('[data-extra-subtotal]').textContent = count ? `${count}× = ${money(count * extra.price)}` : '';
    });
    syncCustomer();
    const s = state();
    form.querySelector('[data-order-total]').innerHTML = totalHTML(s);
    form.querySelector('.message-preview').hidden = !s.count;
    form.querySelector('[data-message-preview]').textContent = s.count ? message(s) : '';
    if (s.count) {
      send.href = whatsapp(s);
      send.textContent = `Enviar pedido no WhatsApp · ${money(s.total + fee())}`;
      send.removeAttribute('aria-disabled');
      error.textContent = '';
    } else {
      send.removeAttribute('href');
      send.setAttribute('aria-disabled', 'true');
      send.textContent = 'Enviar pedido no WhatsApp';
    }
    document.querySelector('.order-bar').hidden = !s.count || formInView;
    document.querySelector('[data-bar-total]').textContent = `Meu pedido · ${money(s.total + fee())}`;
    document.querySelector('[data-bar-count]').textContent = `${pastelLabel(s.count)} no pedido`;
    document.querySelector('.whatsapp-float').hidden = s.count > 0;
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
    formInView = entry.isIntersecting;
    render();
  }).observe(form);
  form.addEventListener('click', event => {
    const step = event.target.closest('[data-step]');
    if (!step) return;
    const input = step.closest('.quantity').querySelector('input');
    input.value = quantity(input) + Number(step.dataset.step);
    render();
  });
  form.addEventListener('input', event => {
    const field = event.target.closest('[data-field]');
    if (field) customer[field.dataset.field] = field.value.trim();
    render();
  });
  form.addEventListener('change', event => {
    if (event.target.name === 'fulfillment') fulfillment = event.target.value === 'retirada' ? 'retirada' : 'entrega';
    const field = event.target.closest('[data-field]');
    if (field) customer[field.dataset.field] = field.value.trim();
    render();
  });
  form.addEventListener('submit', event => event.preventDefault());
  send.addEventListener('click', event => {
    if (state().count) return;
    event.preventDefault();
    error.textContent = 'Escolha a quantidade de pelo menos um recheio.';
    form.querySelector('[data-flavor-qty] [data-step="1"]').focus();
  });
  form.querySelector('.fulfillment').insertAdjacentHTML('afterend', customerHTML('pedido'));
  form.hidden = false;
  section.querySelector('.fallback-order').hidden = true;
  render();
})();
