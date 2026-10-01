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
      const flavors = ['flavor1', 'flavor2'].map(name => data.flavors.find(f => f.id === form.elements[name].value) || data.flavors[0]);
      // The duo has no drink included: a can is an extra, not an "extra can".
      common.extras = extras.map(e => e.id === 'refrigerante-extra' ? { ...e, name: 'Refrigerante em lata' } : e);
      return { ...common, duplo: true, flavorIds: flavors.map(f => f.id), flavorNames: flavors.map(f => f.name), price: data.duplo.price, drinkPrice: 0 };
    }
    const flavor = data.flavors.find(f => f.id === cardId);
    const drink = data.drinks.find(d => d.id === form.elements.drink.value) || data.drinks[0];
    return { ...common, flavorName: flavor.name, price: data.price, drinkId: drink.id, drinkName: drink.name, drinkPrice: drink.price };
  }
  const title = item => item.duplo
    ? `Combo Duplo (2 pastéis: ${item.flavorNames.map(n => n.toLowerCase()).join(' + ')})`
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
  function customerLines() {
    const lines = [];
    if (customer.name) lines.push('Nome: ' + customer.name);
    if (fulfillment === 'entrega' && customer.address) lines.push('Endereço da entrega: ' + customer.address);
    const payment = (data.payments || []).find(p => p.id === customer.payment);
    if (payment) lines.push('Pagamento: ' + payment.name + (payment.id === 'dinheiro' && customer.change ? ` (troco para ${customer.change})` : ''));
    if (customer.when === 'agora') lines.push('Horário: o quanto antes');
    if (customer.when === 'agendar') lines.push('Horário: ' + (customer.time ? `agendar para ${customer.time}` : 'quero agendar (combino por aqui)'));
    return lines;
  }
  function message(list) {
    const lines = ['Olá, Zadoni! Quero confirmar este pedido:', ''];
    list.forEach((item, index) => {
      const a = amounts(item);
      lines.push(`${index + 1}. ${item.count}× ${title(item)} — ${money(item.price * item.count)}`);
      if (!item.duplo) lines.push(`   Bebida: ${drinkLabel(item)}${item.count > 1 ? ' em cada combo' : ''}`);
      if (item.notes) lines.push('   Preferência de bebida: ' + item.notes);
      if (item.extras.length) {
        lines.push('   Adicionais:');
        item.extras.forEach(e => lines.push(`   - ${e.quantity * item.count}× ${e.name} (${money(e.price)} por ${e.unit}) = ${money(e.quantity * item.count * e.price)}`));
      }
      if (item.personalization) lines.push('   Personalização das caixinhas: ' + item.personalization);
      lines.push(`   Subtotal: ${money(a.total)}`, '');
    });
    const total = totals(list);
    lines.push(`Produtos: ${money(total.total)}`, fulfillment === 'entrega' ? `Entrega na zona urbana: ${money(fee())}` : 'Retirada: sem taxa', `TOTAL: ${money(total.total + fee())}`);
    const details = customerLines();
    if (details.length) lines.push('', ...details);
    lines.push('', fulfillment === 'entrega' ? 'Pode confirmar a disponibilidade e o horário de entrega?' : 'Pode confirmar a disponibilidade, o local e o horário de retirada?', 'Origem: página de combos de pastel — Zadoni');
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
    return `<fieldset class="customer" data-customer><legend>Seus dados <small>(opcional, agiliza a confirmação)</small></legend>`
      + `<label for="${prefix}-nome">Nome</label><input id="${prefix}-nome" data-field="name" maxlength="60" autocomplete="name">`
      + `<div data-show="address"><label for="${prefix}-endereco">Endereço ou bairro da entrega</label><input id="${prefix}-endereco" data-field="address" maxlength="160" autocomplete="street-address" placeholder="Rua, número e bairro"></div>`
      + `<label for="${prefix}-pagamento">Forma de pagamento</label><select id="${prefix}-pagamento" data-field="payment"><option value="">Escolher depois</option>${payments}</select>`
      + `<div data-show="change" hidden><label for="${prefix}-troco">Troco para quanto?</label><input id="${prefix}-troco" data-field="change" maxlength="20" inputmode="decimal" placeholder="Ex.: R$ 50"></div>`
      + `<label for="${prefix}-quando">Quando?</label><select id="${prefix}-quando" data-field="when"><option value="">Escolher depois</option><option value="agora">O quanto antes</option><option value="agendar">Agendar horário</option></select>`
      + `<div data-show="time" hidden><label for="${prefix}-hora">Horário desejado</label><input id="${prefix}-hora" data-field="time" type="time" min="07:00" max="23:00"></div>`
      + '<p class="small">Aceitamos Pix, dinheiro e cartão de crédito pelo link de pagamento InfinityPay.</p></fieldset>';
  }
  function syncCustomer(source) {
    document.querySelectorAll('[data-customer]').forEach(box => {
      box.querySelectorAll('[data-field]').forEach(field => { if (field !== source) field.value = customer[field.dataset.field]; });
      box.querySelector('[data-show="address"]').hidden = fulfillment !== 'entrega';
      box.querySelector('[data-show="change"]').hidden = customer.payment !== 'dinheiro';
      box.querySelector('[data-show="time"]').hidden = customer.when !== 'agendar';
    });
  }
  // What the card's own send button sends: the order so far plus this card's choice.
  function cardList(form, item) {
    const list = order.slice();
    // Just added with "Juntar" and untouched since: it is already in the order.
    if (form.dataset.added && !editing) return list;
    if (editing && editing.cardId === item.cardId) list[editing.index] = item;
    else list.push(item);
    return list;
  }
  function updateForm(form) {
    form.querySelectorAll('input[type="number"]').forEach(normalize);
    const item = selection(form);
    const box = item.extras.some(e => e.id === 'caixinha');
    form.querySelector('.personalization').hidden = !box;
    form.elements.personalization.disabled = !box;
    form.querySelectorAll('[data-extra]').forEach(row => {
      const e = item.extras.find(extra => extra.id === row.dataset.extra);
      row.querySelector('[data-extra-subtotal]').textContent = e ? `${e.quantity}× = ${money(e.quantity * e.price)}` : '';
    });
    form.querySelector('[data-card-total]').innerHTML = totalHTML([item]);
    const list = cardList(form, item);
    const total = totals(list);
    const whole = list.length > 1 || (form.dataset.added && list.length === 1);
    const send = form.querySelector('[data-card-send]');
    send.href = whatsapp(list);
    send.textContent = whole
      ? `Enviar pedido completo (${total.count} ${total.count > 1 ? 'combos' : 'combo'}) · ${money(total.total + fee())}`
      : `Enviar no WhatsApp · ${money(total.total + fee())}`;
    form.querySelector('[data-form-error]').textContent = '';
  }
  function renderOrder() {
    const hasItems = order.length > 0;
    section.hidden = false;
    document.querySelector('.order-bar').hidden = !hasItems;
    document.querySelector('[data-cart-nav]').hidden = !hasItems;
    // The order bar takes the bottom corner once there is something to send.
    document.querySelector('.whatsapp-float').hidden = hasItems;
    itemsElement.innerHTML = order.map((item, index) => `<article class="order-item"><h3>${item.count}× ${esc(title(item))}</h3>${item.duplo ? '' : `<p>Bebida: ${esc(drinkLabel(item))}</p>`}${item.notes ? `<p>Preferência: ${esc(item.notes)}</p>` : ''}${item.extras.length ? `<ul>${item.extras.map(e => `<li>${e.quantity * item.count}× ${esc(e.name)} — ${money(e.price * e.quantity * item.count)}</li>`).join('')}</ul>` : ''}${item.personalization ? `<p>Caixinhas: ${esc(item.personalization)}</p>` : ''}<strong>Subtotal: ${money(amounts(item).total)}</strong><div class="order-actions"><button type="button" data-edit="${index}" aria-label="Editar ${esc(title(item))}">Editar</button><button type="button" data-remove="${index}" aria-label="Remover ${esc(title(item))}">Remover</button></div></article>`).join('');
    document.querySelector('[data-order-total]').innerHTML = totalHTML(order);
    const send = document.querySelector('[data-send-order]');
    const barSend = document.querySelector('[data-bar-send]');
    send.hidden = !hasItems;
    document.querySelector('.message-preview').hidden = !hasItems;
    section.querySelector('[data-customer]').hidden = !hasItems;
    if (hasItems) {
      send.href = barSend.href = whatsapp(order);
      document.querySelector('[data-message-preview]').textContent = message(order);
      const total = totals(order);
      document.querySelector('[data-bar-total]').textContent = `Meu pedido (${total.count}) · ${money(total.total + fee())}`;
    } else {
      send.removeAttribute('href');
      barSend.removeAttribute('href');
      document.querySelector('[data-message-preview]').textContent = '';
    }
  }
  function refresh() {
    syncCustomer();
    forms.forEach(updateForm);
    // The order section stays hidden until the first combo is added.
    if (order.length || !section.hidden) renderOrder();
  }
  function setFulfillment(value) {
    fulfillment = value === 'retirada' ? 'retirada' : 'entrega';
    document.querySelectorAll('input[name="fulfillment"]').forEach(radio => { radio.checked = radio.value === fulfillment; });
    refresh();
  }
  function finishEditing() {
    editing = null;
    forms.forEach(form => { form.querySelector('[data-add]').textContent = '+ Juntar com outro combo no mesmo pedido'; });
  }
  document.querySelectorAll('[data-configurator]').forEach(form => {
    const id = form.closest('[data-flavor]').dataset.flavor;
    forms.set(id, form);
    form.querySelector('[data-card-total]').insertAdjacentHTML('beforebegin', customerHTML(id));
    form.addEventListener('click', event => {
      const step = event.target.closest('[data-step]');
      if (!step) return;
      const input = step.closest('.quantity').querySelector('input');
      input.value = quantity(input) + Number(step.dataset.step);
      delete form.dataset.added;
      updateForm(form);
    });
    form.addEventListener('input', event => {
      if (event.target.closest('[data-customer]')) return;
      if (event.target.name !== 'fulfillment') delete form.dataset.added;
      updateForm(form);
    });
    form.addEventListener('change', event => {
      if (event.target.closest('[data-customer]')) return;
      if (event.target.name !== 'fulfillment') delete form.dataset.added;
      if (event.target.name === 'fulfillment') setFulfillment(event.target.value); else updateForm(form);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      updateForm(form);
      const item = selection(form);
      const replacing = editing && editing.cardId === id;
      if (replacing) order[editing.index] = item;
      else order.push(item);
      form.dataset.added = '1';
      finishEditing();
      refresh();
      const notice = replacing ? 'Alterações salvas no pedido.' : `${item.count} combo(s) adicionado(s) ao pedido.`;
      status.textContent = notice;
      form.querySelector('[data-form-error]').textContent = notice + ' Escolha outro combo ou envie tudo pela barra “Meu pedido”.';
      if (replacing) section.focus();
    });
    form.hidden = false;
    form.closest('.card-content').querySelector('.fallback-order').hidden = true;
  });
  section.querySelector('.fulfillment').insertAdjacentHTML('afterend', customerHTML('pedido'));
  section.querySelector('.fulfillment').addEventListener('change', event => setFulfillment(event.target.value));
  const onCustomer = event => {
    const field = event.target.closest('[data-field]');
    if (!field) return;
    customer[field.dataset.field] = field.value.trim();
    syncCustomer(field);
    forms.forEach(updateForm);
    if (order.length) renderOrder();
  };
  document.addEventListener('input', onCustomer);
  document.addEventListener('change', onCustomer);
  setFulfillment('entrega');
  itemsElement.addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]');
    const edit = event.target.closest('[data-edit]');
    if (remove) {
      order.splice(Number(remove.dataset.remove), 1);
      forms.forEach(f => { delete f.dataset.added; });
      finishEditing(); refresh(); section.focus();
      status.textContent = 'Combo removido do pedido.';
    }
    if (edit) {
      const index = Number(edit.dataset.edit);
      const item = order[index];
      finishEditing();
      const form = forms.get(item.cardId);
      delete form.dataset.added;
      if (item.duplo) {
        form.elements.flavor1.value = item.flavorIds[0];
        form.elements.flavor2.value = item.flavorIds[1];
      } else {
        form.elements.drink.value = item.drinkId;
      }
      form.elements.notes.value = item.notes;
      form.elements.personalization.value = item.personalization;
      form.querySelector('.combo-count input').value = item.count;
      form.querySelectorAll('[data-extra]').forEach(row => {
        row.querySelector('input').value = item.extras.find(e => e.id === row.dataset.extra)?.quantity || 0;
      });
      form.querySelector('.options').open = true;
      editing = { index, cardId: item.cardId };
      updateForm(form);
      form.querySelector('[data-add]').textContent = 'Salvar alterações no pedido';
      form.scrollIntoView({ block: 'start', behavior: 'auto' });
      form.querySelector('.options select').focus({ preventScroll: true });
      status.textContent = 'Edite as opções e clique em Salvar alterações no pedido.';
    }
  });
})();
