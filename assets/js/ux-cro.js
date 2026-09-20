/* Progressive enhancement: original content and WhatsApp URLs remain the fallback. */
(function () {
  function init() {
    if (!document.body.dataset.uxCro || document.body.dataset.uxReady) return;
    document.body.dataset.uxReady = 'true';
    const emit = (event, data = {}) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, page_path: location.pathname, page_type: 'local_catalog', ...data });
    };
    const context = element => {
      const card = element.closest('.produto-card,.seo-gallery-item');
      return {
        product_id: card?.dataset.produtoId || card?.id || card?.querySelector('img')?.getAttribute('src')?.split('/').pop() || '',
        product_name: card?.querySelector('.produto-nome,figcaption > span')?.textContent.trim() || '',
        product_category: card?.querySelector('.produto-categoria')?.textContent.trim() || '',
        source_section: element.closest('section')?.getAttribute('aria-labelledby') || '',
        cta_position: card ? 'product' : 'generic'
      };
    };
    const grid = document.getElementById('produtos-container');
    if (grid) {
      const controls = document.createElement('details');
      controls.className = 'ux-filters';
      controls.innerHTML = '<summary>Filtrar por preço ou buscar</summary><div class="ux-filter-fields"><label>Buscar produto ou ocasião<input id="ux-search" type="search" placeholder="Ex.: aniversário, chocolate" autocomplete="off"></label><label>Preço inicial<select id="ux-price"><option value="">Todos os preços</option><option value="100">Até R$ 100</option><option value="200">Acima de R$ 100 até R$ 200</option><option value="more">Acima de R$ 200</option><option value="consulta">Sob consulta</option></select></label></div><button type="button" class="ux-clear">Limpar filtros</button>';
      grid.before(controls);
      const apply = () => window.filtrarProdutos(grid.dataset.activeCategory || 'todos');
      let timer;
      controls.querySelector('input').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(apply, 200); });
      controls.querySelector('select').addEventListener('change', apply);
      controls.querySelector('button').addEventListener('click', () => {
        clearTimeout(timer);
        controls.querySelector('input').value = '';
        controls.querySelector('select').value = '';
        window.filtrarProdutos('todos');
      });
      const count = document.getElementById('catalog-results-count');
      if (count) controls.after(count);
      document.querySelectorAll('.filtro-btn').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('ativo'))));
      window.addEventListener('hashchange', () => {
        if (location.hash.startsWith('#categoria-')) window.filtrarProdutos(decodeURIComponent(location.hash.slice(11)));
        if (location.hash.startsWith('#produto-')) {
          controls.querySelector('input').value = '';
          controls.querySelector('select').value = '';
          window.filtrarProdutos('todos');
          document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
        }
      });
    }

    const productData = new Map((window.PRODUTOS?.produtosLocais || []).map(product => [String(product.id), product]));
    const pagePriorities = (() => {
      if (location.pathname.includes('buques-canaa-dos-carajas')) return [61, 57, 52, 53, 54, 56, 55, 16, 15, 2];
      if (location.pathname.includes('floricultura-canaa-dos-carajas')) return [61, 57, 52, 53, 54, 56, 55, 16, 15, 2, 26, 27, 25];
      if (location.pathname.includes('cestas-de-presente-canaa')) return [60, 11, 6, 33, 10, 17, 8, 37, 9, 7, 23];
      if (location.pathname.includes('presentes-romanticos-canaa')) return [33, 37, 1, 16, 12, 3, 36];
      return [];
    })();
    const reorderProducts = () => {
      document.querySelectorAll('.produtos-grid').forEach(list => {
        const cards = [...list.querySelectorAll('.produto-card[data-produto-id]')];
        if (cards.length < 2 || list.dataset.uxRanked) return;
        const compareCards = (left, right) => {
          const a = productData.get(left.dataset.produtoId);
          const b = productData.get(right.dataset.produtoId);
          const aPriority = pagePriorities.indexOf(Number(a?.id));
          const bPriority = pagePriorities.indexOf(Number(b?.id));
          const priority = (aPriority < 0 ? Number.MAX_SAFE_INTEGER : aPriority) - (bPriority < 0 ? Number.MAX_SAFE_INTEGER : bPriority);
          if (priority) return priority;
          const price = Number(b?.preco || 0) - Number(a?.preco || 0);
          if (price) return price;
          return Number(Boolean(b?.destaque)) - Number(Boolean(a?.destaque));
        };
        const mainTitle = list.querySelector('[data-ux-group="gifts"]');
        const extrasTitle = list.querySelector('[data-ux-group="extras"]');
        const mainCards = cards.filter(card => card.dataset.category !== 'adicionais').sort(compareCards);
        const extraCards = cards.filter(card => card.dataset.category === 'adicionais').sort(compareCards);
        const sorted = mainTitle ? mainCards : cards.sort(compareCards);
        sorted.forEach((card, index) => {
          card.classList.toggle('ux-featured-card', index === 0);
        });
        if (mainTitle && extrasTitle) {
          mainTitle.after(...mainCards);
          extrasTitle.after(...extraCards);
        } else list.append(...sorted);
        list.dataset.uxRanked = 'true';
      });
    };
    reorderProducts();

    document.querySelectorAll('.produto-card').forEach(card => {
      const content = card.querySelector('.produto-content');
      const description = card.querySelector('.produto-descricao');
      const actions = card.querySelector('.produto-acoes');
      if (!content || !actions) return;
      const details = document.createElement('details');
      details.className = 'ux-product-details';
      const summary = document.createElement('summary');
      summary.textContent = 'Ver detalhes do produto';
      details.append(summary);
      // Retain short descriptions; move complete long copy and repeated notes intact.
      if (description && description.textContent.length > 120) details.append(description);
      content.querySelectorAll('.produto-preco-nota').forEach(node => details.append(node));
      const addons = content.querySelector('.produto-adicionais');
      const total = content.querySelector('.produto-total-estimado');
      if (addons) actions.before(addons);
      if (total) {
        total.setAttribute('aria-live', 'polite');
        total.setAttribute('aria-atomic', 'true');
        actions.before(total);
      }
      actions.querySelectorAll('.btn-secondary').forEach(link => {
        // The inline chooser already supplies the same action in one click.
        if (addons && /adicion/i.test(link.textContent)) { link.hidden = true; return; }
        details.append(link);
        link.addEventListener('click', () => { details.open = true; });
      });
      if (details.children.length > 1) {
        actions.after(details);
        details.addEventListener('toggle', () => { if (details.open) emit('open_product_details', context(card)); });
      }
      // No additional click handler: keep the original native anchor navigation.
    });

    document.querySelectorAll('.ux-model-choice').forEach((details, index) => {
      const options = [...details.querySelectorAll('.seo-gallery-budget-option')];
      if (options.length !== 3) return;
      const label = document.createElement('label');
      label.className = 'ux-tier-label';
      label.textContent = 'Escolha a faixa de montagem';
      const select = document.createElement('select');
      select.id = 'ux-tier-' + index;
      select.add(new Option('Selecione uma faixa', ''));
      options.forEach((link, i) => select.add(new Option(link.textContent.trim().replace(/\s+/g, ' '), String(i))));
      label.append(select);
      details.querySelector('.seo-gallery-budget-options').before(label);
      options.forEach(link => { link.hidden = true; });
      select.addEventListener('change', () => {
        options.forEach((link, i) => { link.hidden = select.value !== String(i); });
        const selected = select.value === '' ? null : options[Number(select.value)];
        if (selected) emit('select_price_tier', { ...context(details), price_tier: selected.dataset.budgetTier });
      });
      details.addEventListener('toggle', () => {
        if (details.open) emit('select_product', context(details));
      });
    });

    document.addEventListener('toggle', event => {
      if (event.target.matches('.produto-adicionais') && event.target.open) emit('open_personalization', context(event.target));
    }, true);
    document.addEventListener('click', event => {
      const element = event.target.closest('a,button');
      if (!element) return;
      if (element.matches('.produto-imagem-link,.produto-nome a') && !element.matches('a[href*="wa.me/"]')) emit('select_product', context(element));
      if (element.matches('.btn-adicionais-modelo')) emit('open_personalization', context(element));
      if (element.matches('a[href*="wa.me/"]')) {
        const data = context(element);
        // Existing app owns click_whatsapp; emit only the complementary segment event.
        emit(data.cta_position === 'product' ? 'click_whatsapp_product' : 'click_whatsapp_generic', { ...data, price_tier: element.dataset.budgetTier || '' });
        if (data.cta_position === 'product') emit('select_product', data);
      }
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        emit('view_product_list', { source_section: entry.target.closest('section')?.getAttribute('aria-labelledby') || '' });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0 });
    document.querySelectorAll('.produtos-grid,.seo-gallery-grid,.natural-bouquet-highlights').forEach(list => observer.observe(list));
    const productObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        emit('view_product', context(entry.target));
        productObserver.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.produto-card,.seo-gallery-item').forEach(card => productObserver.observe(card));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
