(function (w) {
  const N = w.ZadoniCesta;
  const c = N.config;

  function obterModelo(id) {
    return N.modelos.find(modelo => modelo.id === id) || null;
  }

  function mensagem(estado) {
    const modelo = obterModelo(estado.modelo);
    const nivel = c.niveisMontagem.find(item => item.id === estado.nivel);
    const p = estado.preferencias;
    const escolha = estado.modelo === 'ajuda-zadoni'
      ? 'Quero ajuda da Zadoni para escolher o melhor modelo'
      : modelo ? modelo.nome : 'Ainda não escolhi';

    return [
      'Olá, Zadoni Presentes! Quero montar uma cesta personalizada com a ajuda de vocês.',
      '',
      'MONTAGEM ESCOLHIDA',
      `Modelo: ${escolha}`,
      `Versão: ${nivel ? nivel.nome : 'Não escolhida'}`,
      `Orçamento de referência: ${nivel ? nivel.precoLabel : 'Não informado'}`,
      `Proposta: ${nivel ? nivel.descricao : 'Quero orientação da Zadoni'}`,
      '',
      'PREFERÊNCIAS',
      `Ocasião: ${p.ocasiao || 'Não informada'}`,
      `Data desejada: ${p.dataEntrega || 'Não informada'}`,
      `Itens, cores ou observações: ${p.observacoes || 'Quero sugestões da Zadoni'}`,
      '',
      'MODELO VISUAL',
      modelo ? modelo.urlPublica : c.PAGE_URL,
      '',
      'ORIGEM: escolha_assistida_de_cesta',
      'Entendo que itens, marcas, disponibilidade, entrega e valor final serão confirmados no atendimento.'
    ].join('\n');
  }

  function criarUrl(estado) {
    const parametros = new URLSearchParams({
      text: mensagem(estado),
      utm_source: 'site',
      utm_medium: 'whatsapp',
      utm_campaign: 'cesta_personalizada',
      utm_content: estado.modelo || 'ajuda_escolha'
    });
    return `https://wa.me/${c.WHATSAPP_NUMBER}?${parametros.toString()}`;
  }

  N.whatsapp = { gerarMensagem: mensagem, criarUrl };
})(window);
