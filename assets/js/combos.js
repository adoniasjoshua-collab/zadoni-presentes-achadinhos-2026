/* Scoped to the new combos page. All amounts are integer centavos.
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
  const section = document.getElementById('meu-pedido');
  const itemsElement = document.querySelector('[data-order-items]');
  const status = document.querySelector('[data-status]');
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
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
    const combo = data.combos.find(c => c.id === form.closest('[data-combo]').dataset.combo);
    const pastels = [...form.querySelectorAll('[data-pastel]')].map(fieldset => {
      const flavorId = fieldset.querySelector('[name^="flavor-"]').value;
      const drinkId = fieldset.querySelector('[name^="drink-"]').value;
      const drink = data.drinks.find(d => d.id === drinkId);
      return {
        flavorId, flavorName: data.flavors.find(f => f.id === flavorId)?.name || '',
        drinkId, drinkName: drink?.name || '', drinkPrice: drink?.price || 0
      };
    });
    const extras = [...form.querySelectorAll('[data-extra]')].map(row => ({
      ...data.extras.find(e => e.id === row.dataset.extra), quantity: quantity(row.querySelector('input'))
    })).filter(e => e.quantity > 0);
    return {
      comboId: combo.id, name: combo.name, size: combo.pastels, price: combo.price,
      count: quantity(form.querySelector('.combo-count input')),
      pastels, notes: form.elements.notes.value.trim(),
      extras, personalization: extras.some(e => e.id === 'caixinha') ? form.elements.personalization.value.trim() : ''
    };
  }
  const composition = item => `${plural(item.size, 'pastel', 'pastéis')} + ${plural(item.size, 'bebida', 'bebidas')}`;
  const pastelLabel = (item, p, i) => `${item.size > 1 ? `Pastel ${i + 1}: ` : 'Pastel: '}${p.flavorName || 'sabor a escolher'} + ${p.drinkName || 'bebida a escolher'}${p.drinkPrice ? ' (+' + money(p.drinkPrice) + ')' : ''}`;
  function amounts(item) {
    const drinks = item.pastels.reduce((sum, p) => sum + p.drinkPrice, 0) * item.count;
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
    return `<div class="total-line"><span>Combos (${total.count})</span><strong>${money(total.base - total.drinks)}</strong></div>${total.drinks ? `<div class="total-line"><span>Troca por suco</span><strong>${money(total.drinks)}</strong></div>` : ''}<div class="total-line"><span>Adicionais</span><strong>${money(total.extras)}</strong></div><div class="total-line"><span>${fulfillment === 'entrega' ? 'Entrega por pedido*' : 'Retirada'}</span><strong>${fulfillment === 'entrega' ? money(fee()) : 'sem taxa'}</strong></div><div class="total-line grand-total"><span>Total</span><strong>${money(total.total + fee())}</strong></div>${fulfillment === 'entrega' ? '<p class="small">*Um endereço na zona urbana de Canaã dos Carajás.</p>' : '<p class="small">Local e horário de retirada combinados no WhatsApp.</p>'}`;
  }
  function message(list) {
    const lines = ['Olá, Zadoni! Quero confirmar este pedido de combos de pastel:', ''];
    list.forEach((item, index) => {
      const a = amounts(item);
      lines.push(`${index + 1}. ${item.count}× ${item.name} (${composition(item)}) — ${money(item.price * item.count)}`);
      item.pastels.forEach((p, i) => lines.push('   ' + pastelLabel(item, p, i)));
      if (item.count > 1) lines.push('   (mesmos sabores e bebidas em cada combo)');
      if (item.notes) lines.push('Preferência de bebida: ' + item.notes);
      if (item.extras.length) {
        lines.push('Adicionais deste grupo:');
        item.extras.forEach(e => lines.push(`- ${e.quantity * item.count}× ${e.name} (${money(e.price)} por ${e.unit}) = ${money(e.quantity * item.count * e.price)}`));
      }
      if (item.personalization) lines.push('Personalização das caixinhas: ' + item.personalization);
      lines.push(`Subtotal: ${money(a.total)}`, '');
    });
    const total = totals(list);
    lines.push(`Produtos e adicionais: ${money(total.total)}`, fulfillment === 'entrega' ? `Entrega na zona urbana: ${money(fee())}` : 'Retirada: sem taxa', `TOTAL: ${money(total.total + fee())}`);
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
  function updateForm(form) {
    form.querySelectorAll('input[type="number"]').forEach(normalize);
    const item = selection(form);
    const box = item.extras.some(e => e.id === 'caixinha');
    form.querySelector('.personalization').hidden = !box;
    form.elements.personalization.disabled = !box;
    form.querySelectorAll('[data-extra]').forEach(row => {
      const e = item.extras.find(extra => extra.id === row.dataset.extra);
      row.querySelector('[data-extra-subtotal]').textContent = e ? `${e.quantity}× = ${money(e.quantity * e.price)} por combo` : '';
    });
    const extraCount = item.extras.reduce((sum, e) => sum + e.quantity, 0);
    const extraPrice = item.extras.reduce((sum, e) => sum + e.quantity * e.price, 0);
    form.querySelector('[data-extras-label]').textContent = extraCount ? `${extraCount} item(ns) · ${money(extraPrice)} por combo` : 'Opcional · escolha as quantidades';
    form.querySelector('[data-card-total]').innerHTML = totalHTML([item]);
    form.querySelector('.direct-order').href = whatsapp([item]);
    form.querySelector('[data-form-error]').textContent = '';
  }
  function validate(form) {
    updateForm(form);
    const missing = [...form.querySelectorAll('[data-pastel] select')].find(select => !select.value);
    if (missing) {
      form.querySelector('[data-form-error]').textContent = missing.name.startsWith('flavor') ? 'Escolha o sabor de cada pastel.' : 'Escolha a bebida de cada pastel.';
      missing.focus();
      return false;
    }
    return true;
  }
  function renderOrder() {
    const hasItems = order.length > 0;
    section.hidden = false;
    document.querySelector('.order-bar').hidden = !hasItems;
    document.querySelector('[data-cart-nav]').hidden = !hasItems;
    // The order bar takes the bottom corner once there is something to send.
    document.querySelector('.whatsapp-float').hidden = hasItems;
    itemsElement.innerHTML = order.map((item, index) => `<article class="order-item"><h3>${item.count}× ${esc(item.name)} <small>${composition(item)}</small></h3><ul class="pastel-list">${item.pastels.map((p, i) => `<li>${esc(pastelLabel(item, p, i))}</li>`).join('')}</ul>${item.notes ? `<p>Preferência de bebida: ${esc(item.notes)}</p>` : ''}${item.extras.length ? `<ul>${item.extras.map(e => `<li>${e.quantity * item.count}× ${esc(e.name)} — ${money(e.price * e.quantity * item.count)}</li>`).join('')}</ul>` : '<p>Sem adicionais.</p>'}${item.personalization ? `<p>Caixinhas: ${esc(item.personalization)}</p>` : ''}<strong>Subtotal: ${money(amounts(item).total)}</strong><div class="order-actions"><button type="button" data-edit="${index}" aria-label="Editar grupo ${index + 1}: ${esc(item.name)}">Editar</button><button type="button" data-remove="${index}" aria-label="Remover grupo ${index + 1}: ${esc(item.name)}">Remover</button></div></article>`).join('');
    document.querySelector('[data-order-total]').innerHTML = totalHTML(order);
    const send = document.querySelector('[data-send-order]');
    send.hidden = !hasItems;
    document.querySelector('.message-preview').hidden = !hasItems;
    if (hasItems) {
      send.href = whatsapp(order);
      document.querySelector('[data-message-preview]').textContent = message(order);
      const total = totals(order);
      document.querySelector('[data-bar-total]').textContent = `${total.count} combo(s) · ${money(total.total + fee())} ${fulfillment === 'entrega' ? 'com entrega*' : 'para retirada'}`;
    } else {
      send.removeAttribute('href');
      document.querySelector('[data-message-preview]').textContent = '';
    }
  }
  function setFulfillment(value) {
    fulfillment = value === 'retirada' ? 'retirada' : 'entrega';
    document.querySelectorAll('input[name="fulfillment"]').forEach(radio => { radio.checked = radio.value === fulfillment; });
    forms.forEach(updateForm);
    if (order.length) renderOrder();
  }
  function finishEditing() {
    editing = null;
    forms.forEach(form => {
      form.querySelector('[data-add]').textContent = 'Adicionar ao meu pedido';
      form.querySelector('.direct-order').hidden = false;
    });
  }
  document.querySelectorAll('[data-configurator]').forEach(form => {
    const id = form.closest('[data-combo]').dataset.combo;
    forms.set(id, form);
    form.addEventListener('click', event => {
      const step = event.target.closest('[data-step]');
      if (!step) return;
      const input = step.closest('.quantity').querySelector('input');
      input.value = quantity(input) + Number(step.dataset.step);
      updateForm(form);
    });
    form.addEventListener('input', () => updateForm(form));
    form.addEventListener('change', event => event.target.name === 'fulfillment' ? setFulfillment(event.target.value) : updateForm(form));
    form.querySelector('.direct-order').addEventListener('click', event => {
      if (!validate(form)) { event.preventDefault(); event.stopImmediatePropagation(); }
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate(form)) return;
      const item = selection(form);
      const replacing = editing && editing.comboId === id;
      if (replacing) order[editing.index] = item;
      else order.push(item);
      finishEditing();
      renderOrder();
      const notice = replacing ? 'Alterações salvas no pedido.' : `${item.count} combo(s) adicionado(s) ao pedido.`;
      status.textContent = notice;
      form.querySelector('[data-form-error]').textContent = notice + ' Use “Revisar pedido” para enviar tudo junto.';
      if (replacing) section.focus();
    });
    updateForm(form);
    form.hidden = false;
    form.closest('.card-content').querySelector('.fallback-order').hidden = true;
  });
  section.querySelector('.fulfillment').addEventListener('change', event => setFulfillment(event.target.value));
  setFulfillment('entrega');
  itemsElement.addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]');
    const edit = event.target.closest('[data-edit]');
    if (remove) {
      order.splice(Number(remove.dataset.remove), 1);
      finishEditing(); renderOrder(); section.focus();
      status.textContent = 'Combo removido do pedido.';
    }
    if (edit) {
      const index = Number(edit.dataset.edit);
      const item = order[index];
      finishEditing();
      const form = forms.get(item.comboId);
      form.querySelectorAll('[data-pastel]').forEach((fieldset, i) => {
        fieldset.querySelector('[name^="flavor-"]').value = item.pastels[i].flavorId;
        fieldset.querySelector('[name^="drink-"]').value = item.pastels[i].drinkId;
      });
      form.elements.notes.value = item.notes;
      form.elements.personalization.value = item.personalization;
      form.querySelector('.combo-count input').value = item.count;
      form.querySelectorAll('[data-extra]').forEach(row => {
        row.querySelector('input').value = item.extras.find(e => e.id === row.dataset.extra)?.quantity || 0;
      });
      form.querySelector('.extras').open = item.extras.length > 0;
      editing = { index, comboId: item.comboId };
      updateForm(form);
      form.querySelector('[data-add]').textContent = 'Salvar alterações no pedido';
      form.querySelector('.direct-order').hidden = true;
      form.scrollIntoView({ block: 'start', behavior: 'auto' });
      form.querySelector('[data-pastel] select').focus({ preventScroll: true });
      status.textContent = 'Edite as opções e clique em Salvar alterações no pedido.';
    }
  });
})();
