(function (w, d) {
  const N = w.ZadoniCesta;
  let estado = N.storage.carregar() || N.storage.criar();

  function renderizar() {
    N.interface.renderizar(estado);
  }

  function salvar() {
    N.storage.salvar(estado);
  }

  function selecionarModelo(id) {
    if (!N.modelos.some(modelo => modelo.id === id)) return;
    estado.modelo = id;
    salvar();
    N.analytics.registrarEvento('selecionou_modelo_assistido', { modelo_id: id });
    renderizar();
    d.getElementById('preferencias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function pedirAjuda() {
    estado.modelo = 'ajuda-zadoni';
    salvar();
    N.analytics.registrarEvento('pediu_ajuda_modelo');
    renderizar();
    d.getElementById('preferencias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function atualizarCampo(campo, valor) {
    if (!(campo in estado.preferencias)) return;
    const limite = campo === 'observacoes' ? N.config.OBSERVACOES_MAX : 100;
    estado.preferencias[campo] = String(valor || '').replace(/[<>]/g, '').slice(0, limite);
    salvar();
    const botao = d.getElementById('whatsappButton');
    if (botao && estado.modelo) botao.href = N.whatsapp.criarUrl(estado);
  }

  function limpar() {
    N.storage.limpar();
    estado = N.storage.criar();
    renderizar();
    N.interface.mostrarToast('Escolhas removidas.');
    w.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function tratarClique(evento) {
    const alvo = evento.target.closest('[data-action]');
    if (!alvo) return;
    const acao = alvo.dataset.action;

    if (acao === 'selecionar-modelo') selecionarModelo(alvo.dataset.modelo);
    if (acao === 'pedir-ajuda') pedirAjuda();
    if (acao === 'enviar-whatsapp') {
      if (!estado.modelo) {
        evento.preventDefault();
        N.interface.mostrarToast('Escolha um modelo ou peça ajuda da Zadoni.');
        d.getElementById('modelos-title')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      alvo.href = N.whatsapp.criarUrl(estado);
      N.analytics.registrarEvento('clicou_whatsapp_cesta_assistida', {
        modelo_id: estado.modelo,
        ocasiao: estado.preferencias.ocasiao || 'nao_informada',
        orcamento: estado.preferencias.orcamento || 'nao_informado'
      });
    }
  }

  function iniciar() {
    d.addEventListener('click', tratarClique);
    d.addEventListener('input', evento => {
      if (evento.target.name) atualizarCampo(evento.target.name, evento.target.value);
    });
    d.addEventListener('change', evento => {
      if (evento.target.name) atualizarCampo(evento.target.name, evento.target.value);
    });
    d.getElementById('resetButton')?.addEventListener('click', limpar);
    renderizar();
  }

  d.addEventListener('DOMContentLoaded', iniciar);
})(window, document);
