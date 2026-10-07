/* Scoped to the combos page. All amounts are integer centavos.
   No personal data is persisted or sent until the customer opens WhatsApp. */
(function () {
  'use strict';
  const data = JSON.parse(document.getElementById('combos-data').textContent);
  const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const forms = new Map();
  const order = [];
  let editing = null;
  // One choice per order: pickup is free, delivery adds the flat fee once.
  let fulfillment = 'entrega';
  const fee = () => fulfillment === 'entrega' ? data.delivery.price : 0;
  // Optional customer details, shared by every card and the order section.
  const customer = { name: '', address: '', payment: '', change: '', when: '', time: '' };
  const section = document.getElementById('meu-pedido');
  const itemsElement = document.querySelector('[data-order-items]');
  const status = document.querySelector('[data-status]');
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const isDuplo = id => data.duplo && id === data.duplo.id;
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
  function selection(form) {
    const cardId = form.closest('[data-flavor]').dataset.flavor;
    const extras = [...form.querySelectorAll('[data-extra]')].map(row => ({
      ...data.extras.find(e => e.id === row.dataset.extra), quantity: quantity(row.querySelector('input'))
    })).filter(e => e.quantity > 0);
    const common = {
      cardId, count: quantity(form.querySelector('.combo-count input')),
      notes: form.elements.notes.value.trim(),
      extras, personalization: extras.some(e => e.id === 'caixinha') ? form.elements.personalization.value.trim() : ''
    };
    if (isDuplo(cardId)) {
      const flavors = ['flavor1', 'flavor2'].map(name => data.flavors.find(f => f.id === form.elements[name].value));
      if (flavors.some(f => !f)) return null;
      return { ...common, duplo: true, flavorIds: flavors.map(f => f.id), flavorNames: flavors.map(f => f.name), price: data.duplo.price, drinkName: '1 refrigerante em lata (incluído)', drinkPrice: 0 };
    }
    const flavor = data.flavors.find(f => f.id === form.elements.flavor1.value);
    if (!flavor) return null;
    const drink = data.drinks.find(d => d.id === form.elements.drink.value) || data.drinks[0];
    return { ...common, flavorId: flavor.id, flavorName: flavor.name, price: data.price, drinkId: drink.id, drinkName: drink.price ? drink.name : `1 ${drink.name.toLowerCase()} (incluído)`, drinkPrice: drink.price };
  }
  const title = item => item.duplo
    ? `Combo Duplo (2 pastelões: ${item.flavorNames.map(n => n.toLowerCase()).join(' + ')})`
    : `Combo pastelão de ${item.flavorName.toLowerCase()}`;
  const drinkLabel = item => `${item.drinkName}${item.drinkPrice ? ' (+' + money(item.drinkPrice) + ')' : ''}`;
  function amounts(item) {
    const drinks = item.drinkPrice * item.count;
    const base = item.price * item.count + drinks;
    const extras = item.extras.reduce((sum, e) => sum + e.price * e.quantity * item.count, 0);
    return { base, drinks, extras, total: base + extras };
  }
  function totals(list) {
    return list.reduce((sum, item) => {
      const a = amounts(item);
      return { base: sum.base + a.base, drinks: sum.drinks + a.drinks, extras: sum.extras + a.extras, total: sum.total + a.total, count: sum.count + item.count };
    }, { base: 0, drinks: 0, extras: 0, total: 0, count: 0 });
  }
  function totalHTML(list) {
    const total = totals(list);
    if (!list.length) return '<p>Seu pedido está vazio. Escolha um combo acima.</p>';
    return `<div class="total-line"><span>Combos (${total.count})</span><strong>${money(total.base - total.drinks)}</strong></div>${total.drinks ? `<div class="total-line"><span>Troca por suco</span><strong>${money(total.drinks)}</strong></div>` : ''}${total.extras ? `<div class="total-line"><span>Adicionais</span><strong>${money(total.extras)}</strong></div>` : ''}<div class="total-line"><span>${fulfillment === 'entrega' ? 'Entrega' : 'Retirada'}</span><strong>${fulfillment === 'entrega' ? money(fee()) : 'sem taxa'}</strong></div><div class="total-line grand-total"><span>Total</span><strong>${money(total.total + fee())}</strong></div>`;
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
  function message(list) {
    const rule = '━━━━━━━━━━━━━━';
    const total = totals(list);
    const lines = ['Olá, Zadoni! Quero fazer este pedido:', '',
      `${fulfillment === 'entrega' ? '✅ *ENTREGA*' : '✅ *RETIRADA*'} · ${total.count} ${total.count === 1 ? 'combo' : 'combos'}`, rule, ''];
    list.forEach((item, index) => {
      const each = item.count > 1 ? ' (cada combo)' : '';
      lines.push(`*${index + 1}) ${item.count}× ${item.duplo ? 'Combo Duplo' : 'Combo Individual'}* — ${money(item.price * item.count)}`);
      if (item.duplo) item.flavorNames.forEach((name, i) => lines.push(`⭐ Pastelão ${i + 1}: ${name}${each}`));
      else lines.push(`⭐ Recheio: ${item.flavorName}${each}`);
      lines.push(`☕ Bebida: ${drinkLabel(item)}${each}`);
      item.extras.forEach(e => lines.push(`➕ ${e.quantity * item.count}× ${e.name} — ${money(e.quantity * item.count * e.price)}`));
      if (item.personalization) lines.push('✨ Caixinhas: ' + item.personalization);
      if (item.notes) lines.push('✏ Obs.: ' + item.notes);
      lines.push(`▸ Subtotal: ${money(amounts(item).total)}`, '');
    });
    lines.push(rule, '*VALORES*', `Produtos: ${money(total.total)}`,
      fulfillment === 'entrega' ? `Entrega na zona urbana: ${money(fee())}` : 'Retirada: sem taxa',
      `▶ *TOTAL: ${money(total.total + fee())}*`);
    const details = customerLines();
    if (details.length) lines.push('', '*DADOS DO CLIENTE*', ...details);
    lines.push('', fulfillment === 'entrega' ? 'Pode confirmar a disponibilidade e o horário de entrega?' : 'Pode confirmar a disponibilidade, o local e o horário de retirada?', '_Origem: página de combos de pastel_');
    return lines.join('\n');
  }
  function whatsapp(list) {
    const url = new URL('https://wa.me/' + data.phone);
    url.searchParams.set('text', message(list));
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
  function syncCustomer(source) {
    document.querySelectorAll('[data-customer]').forEach(box => {
      box.querySelectorAll('[data-field]').forEach(field => { if (field !== source) field.value = customer[field.dataset.field]; });
      box.querySelector('[data-show="address"]').hidden = fulfillment !== 'entrega';
      box.querySelector('[data-customer-title]').textContent = fulfillment === 'entrega' ? 'Dados para entrega' : 'Seus dados';
      box.querySelector('[data-show="change"]').hidden = customer.payment !== 'dinheiro';
      box.querySelector('[data-show="time"]').hidden = customer.when !== 'agendar';
    });
  }
  const pendingForm = () => [...forms.values()].find(form => form.querySelector('.options').open);
  function updateForm(form) {
    form.querySelectorAll('input[type="number"]').forEach(normalize);
    const box = Number(form.querySelector('[data-extra="caixinha"] input').value) > 0;
    form.querySelector('.personalization').hidden = !box;
    form.elements.personalization.disabled = !box;
    form.querySelectorAll('[data-extra]').forEach(row => {
      const extra = data.extras.find(e => e.id === row.dataset.extra);
      const count = quantity(row.querySelector('input'));
      row.querySelector('[data-extra-subtotal]').textContent = count ? `${count}× por combo = ${money(count * extra.price)}` : '';
    });
    const item = selection(form);
    form.querySelector('[data-card-total]').textContent = item ? `Este combo: ${money(amounts(item).total)} · entrega calculada uma vez no resumo` : 'Escolha o recheio de cada pastelão para continuar.';
    form.querySelector('[data-add]').textContent = editing?.cardId === form.closest('[data-flavor]').dataset.flavor ? 'Salvar alterações' : 'Continuar pedido';
  }
  function renderOrder() {
    const hasItems = order.length > 0;
    const pending = pendingForm();
    section.hidden = !hasItems;
    document.querySelector('.order-bar').hidden = !hasItems || summaryInView;
    document.querySelector('[data-cart-nav]').hidden = !hasItems;
    document.querySelector('.whatsapp-float').hidden = hasItems || !!pending;
    itemsElement.innerHTML = order.map((item, index) => `<article class="order-item"><h3>${item.count}× ${esc(title(item))}</h3><p>Bebida: ${esc(drinkLabel(item))}</p>${item.notes ? `<p>Observações: ${esc(item.notes)}</p>` : ''}${item.extras.length ? `<ul>${item.extras.map(e => `<li>${e.quantity * item.count}× ${esc(e.name)} — ${money(e.price * e.quantity * item.count)}</li>`).join('')}</ul>` : ''}${item.personalization ? `<p>Caixinhas: ${esc(item.personalization)}</p>` : ''}<strong>Subtotal: ${money(amounts(item).total)}</strong><div class="order-actions"><button type="button" data-edit="${index}">Editar combo</button><button type="button" data-remove="${index}">Remover</button></div></article>`).join('');
    document.querySelector('[data-order-total]').innerHTML = totalHTML(order);
    const send = document.querySelector('[data-send-order]');
    send.hidden = !hasItems || !!pending;
    document.querySelector('[data-pending-notice]').hidden = !hasItems || !pending;
    document.querySelector('.message-preview').hidden = !hasItems || !!pending;
    document.querySelector('[data-message-preview]').textContent = hasItems ? message(order) : '';
    const total = totals(order).total + fee();
    document.querySelector('[data-bar-total]').textContent = `Meu pedido · ${money(total)}`;
    const combos = order.reduce((sum, item) => sum + item.count, 0);
    document.querySelector('[data-bar-count]').textContent = `${combos} ${combos === 1 ? 'combo' : 'combos'} no pedido`;
    if (hasItems && !pending) {
      send.href = whatsapp(order);
      send.textContent = `Enviar pedido no WhatsApp · ${money(total)}`;
    } else send.removeAttribute('href');
  }
  // The bar only points to the summary, so hide it while the summary is on screen.
  let summaryInView = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
    summaryInView = entry.isIntersecting;
    renderOrder();
  }).observe(section);
  function refresh() {
    syncCustomer();
    forms.forEach(updateForm);
    renderOrder();
  }
  function closeForm(form) {
    form.querySelector('.options').open = false;
    form.reset();
    form.querySelector('[data-form-error]').textContent = '';
    if (editing?.cardId === form.closest('[data-flavor]').dataset.flavor) editing = null;
  }
  document.querySelectorAll('[data-configurator]').forEach(form => {
    const id = form.closest('[data-flavor]').dataset.flavor;
    forms.set(id, form);
    form.addEventListener('click', event => {
      const step = event.target.closest('[data-step]');
      if (step) {
        const input = step.closest('.quantity').querySelector('input');
        input.value = quantity(input) + Number(step.dataset.step);
        updateForm(form);
      }
      if (event.target.closest('[data-cancel]')) {
        closeForm(form);
        refresh();
        form.querySelector('summary').focus();
      }
    });
    form.addEventListener('input', () => { updateForm(form); form.querySelector('[data-form-error]').textContent = ''; });
    form.addEventListener('change', () => updateForm(form));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.querySelector('.options').open) return;
      updateForm(form);
      const item = selection(form);
      if (!item) {
        form.querySelector('[data-form-error]').textContent = 'Escolha o recheio de cada pastelão.';
        const missing = [...form.querySelectorAll('.flavor-choices')].find(group => !group.querySelector(':checked'));
        missing.querySelector('input').focus();
        return;
      }
      if (editing?.cardId === id) order[editing.index] = item;
      else order.push(item);
      closeForm(form);
      refresh();
      section.scrollIntoView({ block: 'start', behavior: 'auto' });
      section.focus({ preventScroll: true });
      status.textContent = 'Pedido atualizado. Confira o resumo antes de enviar.';
    });
    form.querySelector('.options').addEventListener('toggle', () => {
      if (form.querySelector('.options').open) forms.forEach(other => { if (other !== form) closeForm(other); });
      else if (editing?.cardId === id) editing = null;
      refresh();
    });
    form.hidden = false;
    form.closest('.card-content').querySelector('.fallback-order').hidden = true;
  });
  section.querySelector('.fulfillment').insertAdjacentHTML('afterend', customerHTML('pedido'));
  section.querySelector('.fulfillment').addEventListener('change', event => {
    fulfillment = event.target.value === 'retirada' ? 'retirada' : 'entrega';
    refresh();
  });
  const onCustomer = event => {
    const field = event.target.closest('[data-field]');
    if (!field) return;
    customer[field.dataset.field] = field.value.trim();
    syncCustomer(field);
    renderOrder();
  };
  document.addEventListener('input', onCustomer);
  document.addEventListener('change', onCustomer);
  itemsElement.addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]');
    const edit = event.target.closest('[data-edit]');
    if (!remove && !edit) return;
    forms.forEach(closeForm);
    if (remove) {
      order.splice(Number(remove.dataset.remove), 1);
      refresh();
      if (order.length) section.focus(); else document.querySelector('.options summary').focus();
      return;
    }
    const index = Number(edit.dataset.edit);
    const item = order[index];
    const form = forms.get(item.cardId);
    form.elements.flavor1.value = item.duplo ? item.flavorIds[0] : item.flavorId;
    if (item.duplo) form.elements.flavor2.value = item.flavorIds[1];
    else form.elements.drink.value = item.drinkId;
    form.elements.notes.value = item.notes;
    form.elements.personalization.value = item.personalization;
    form.querySelector('.combo-count input').value = item.count;
    form.querySelectorAll('[data-extra]').forEach(row => { row.querySelector('input').value = item.extras.find(e => e.id === row.dataset.extra)?.quantity || 0; });
    editing = { index, cardId: item.cardId };
    form.querySelector('.options').open = true;
    refresh();
    form.scrollIntoView({ block: 'start', behavior: 'auto' });
    form.querySelector('input:checked').focus({ preventScroll: true });
  });
  refresh();
})();
