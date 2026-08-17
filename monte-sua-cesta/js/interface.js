(function (w, d) {
  const N = w.ZadoniCesta;
  const app = d.getElementById('app');
  const toast = d.getElementById('toast');

  function escapar(valor) {
    return String(valor || '').replace(/[&<>"']/g, caractere => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[caractere]));
  }

  function imagem(src, alt, lazy) {
    return `<img class="photo" src="${src}" alt="${escapar(alt)}" loading="${lazy ? 'lazy' : 'eager'}" decoding="async">`;
  }

  function mostrarToast(texto) {
    toast.textContent = texto;
    toast.classList.add('show');
    clearTimeout(mostrarToast.tempo);
    mostrarToast.tempo = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function opcoes(valores, selecionado, placeholder) {
    return `<option value="">${placeholder}</option>${valores.map(valor => `<option value="${escapar(valor)}" ${selecionado === valor ? 'selected' : ''}>${escapar(valor)}</option>`).join('')}`;
  }

  function dataMinima() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  function cardModelo(modelo, selecionado, indice) {
    const ativo = selecionado === modelo.id;
    return `<article class="card model-card ${ativo ? 'selected' : ''}">
      <span class="badge">Escolhido</span>
      ${imagem(modelo.imagem, modelo.nome, indice > 0)}
      <div class="body">
        <span class="pill">${escapar(modelo.perfil)}</span>
        <h3>${escapar(modelo.nome)}</h3>
        <p>${escapar(modelo.descricao)}</p>
        <strong class="custom-quote">Orçamento personalizado</strong>
        <button class="primary" type="button" data-action="selecionar-modelo" data-modelo="${modelo.id}" aria-pressed="${ativo}">${ativo ? 'Modelo escolhido' : 'Quero este modelo'}</button>
      </div>
    </article>`;
  }

  function renderizar(estado) {
    const p = estado.preferencias;
    const precisaAjuda = estado.modelo === 'ajuda-zadoni';
    const modelo = N.modelos.find(item => item.id === estado.modelo);
    const escolha = precisaAjuda ? 'Ajuda da Zadoni para escolher' : modelo ? modelo.nome : 'Nenhum modelo escolhido';
    const podeEnviar = Boolean(estado.modelo);

    app.innerHTML = `<article class="hero assisted-hero">
      <div class="title">
        <span class="eyebrow">Atendimento personalizado</span>
        <h2>Escolha o estilo. A Zadoni monta cada detalhe com você.</h2>
        <p>Veja os modelos disponíveis, conte um pouco sobre o presente e receba sugestões personalizadas pelo WhatsApp.</p>
      </div>
      <div class="benefits">
        <div class="benefit"><span>1</span><strong>Escolha um modelo</strong></div>
        <div class="benefit"><span>2</span><strong>Informe ocasião e orçamento</strong></div>
        <div class="benefit"><span>3</span><strong>Receba sugestões da Zadoni</strong></div>
        <div class="benefit"><span>4</span><strong>Confirme tudo pelo WhatsApp</strong></div>
      </div>
    </article>

    <section class="flow-section" aria-labelledby="modelos-title">
      <div class="section-heading">
        <span class="step-number">1</span>
        <div><h2 id="modelos-title">Qual modelo combina com o presente?</h2><p>As fotos mostram o estilo da montagem. Produtos e acabamento serão definidos no atendimento.</p></div>
      </div>
      <div class="models">${N.modelos.map((item, indice) => cardModelo(item, estado.modelo, indice)).join('')}</div>
      <div class="help-choice ${precisaAjuda ? 'selected' : ''}">
        <div><strong>Não sabe qual modelo escolher?</strong><p>Conte a ocasião e o orçamento. A Zadoni indica a melhor opção.</p></div>
        <button class="secondary" type="button" data-action="pedir-ajuda" aria-pressed="${precisaAjuda}">${precisaAjuda ? 'Ajuda selecionada' : 'Quero ajuda para escolher'}</button>
      </div>
    </section>

    <section id="preferencias" class="flow-section" aria-labelledby="preferencias-title">
      <div class="section-heading">
        <span class="step-number">2</span>
        <div><h2 id="preferencias-title">Conte o essencial para a Zadoni</h2><p>Todos os campos são opcionais, mas ajudam a preparar sugestões mais adequadas.</p></div>
      </div>
      <div class="notice ${podeEnviar ? 'success' : 'warning'}"><strong>Escolha atual:</strong> ${escapar(escolha)}.</div>
      <form id="briefingForm" class="grid form" novalidate>
        <div class="field"><label for="ocasiao">Ocasião</label><select id="ocasiao" name="ocasiao">${opcoes(N.config.ocasioes, p.ocasiao, 'Selecione a ocasião')}</select></div>
        <div class="field"><label for="orcamento">Faixa de orçamento</label><select id="orcamento" name="orcamento">${opcoes(N.config.orcamentos, p.orcamento, 'Selecione uma faixa')}</select></div>
        <div class="field"><label for="dataEntrega">Data desejada</label><input id="dataEntrega" name="dataEntrega" type="date" min="${dataMinima()}" value="${escapar(p.dataEntrega)}"></div>
        <div class="field wide"><label for="observacoes">Preferências e observações</label><textarea id="observacoes" name="observacoes" maxlength="${N.config.OBSERVACOES_MAX}" placeholder="Ex.: gosta de chocolate, prefere tons de rosa, sem bebida alcoólica...">${escapar(p.observacoes)}</textarea><p class="help">Não precisa escolher cada produto agora; a Zadoni ajuda nessa etapa.</p></div>
      </form>
      <div class="assisted-cta">
        <div><strong>Pronto para montar com a Zadoni?</strong><p>Disponibilidade, composição, entrega e valor final serão confirmados no WhatsApp.</p></div>
        <a id="whatsappButton" class="whatsapp" href="${podeEnviar ? N.whatsapp.criarUrl(estado) : '#modelos-title'}" target="${podeEnviar ? '_blank' : '_self'}" rel="noopener noreferrer" aria-disabled="${podeEnviar ? 'false' : 'true'}" data-action="enviar-whatsapp">Montar com ajuda da Zadoni</a>
      </div>
    </section>

    <p class="trust-note"><a href="https://g.page/r/CXqQulFWWhbDEAE/review" target="_blank" rel="noopener noreferrer">Veja as avaliações da Zadoni no Google</a></p>`;
  }

  N.interface = { renderizar, mostrarToast };
})(window, document);
