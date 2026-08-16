(function (w) {
  const N = w.ZadoniCesta;
  const c = N.config;

  function msg(m) {
    const calc = N.calculos;
    const mo = calc.obterModelo(m.modelo);
    const t = calc.totaisDetalhados(m);
    const p = m.personalizacao;
    const itens = m.itens.map(i => {
      const pr = calc.obterProduto(i.produtoId);
      return pr ? `${i.quantidade}x ${pr.nome}` : '';
    }).filter(Boolean).join('\n');

    return [
      'Olá, Zadoni Presentes! Montei uma cesta pelo site.',
      '',
      'MODELO ESCOLHIDO',
      mo ? mo.nome : 'Não informado',
      '',
      'ITENS ESCOLHIDOS',
      itens || 'Nenhum produto selecionado',
      '',
      'PERSONALIZAÇÃO',
      `Ocasião: ${p.ocasiao || 'Não informado'}`,
      `Cor: ${p.cor || 'Não informado'}`,
      `Destinatário: ${p.destinatario || 'Não informado'}`,
      `Mensagem: ${p.mensagem || 'Não informado'}`,
      `Data desejada: ${p.dataEntrega || 'Não informado'}`,
      `Bairro: ${p.bairro || 'Não informado'}`,
      `Observações: ${p.observacoes || 'Não informado'}`,
      '',
      'RESUMO',
      `Total estimado dos produtos/modelo: ${calc.formatarMoeda(t.total)}`,
      'Entrega: a confirmar',
      `Nível alcançado: Cesta ${t.nivel.nome}`,
      '',
      'MODELO VISUAL',
      mo ? mo.urlPublica : c.PAGE_URL,
      '',
      'ORIGEM: monte_sua_cesta',
      'Este resumo é uma simulação de orçamento. Itens, marcas, quantidades, personalização, entrega e valor final dependem de disponibilidade e confirmação da Zadoni.',
      'Gostaria de negociar e confirmar quais itens estão disponíveis, possíveis substituições e o valor final para fechar o pedido.'
    ].join('\n');
  }

  function url(m) {
    const p = new URLSearchParams({
      text: msg(m),
      utm_source: 'site',
      utm_medium: 'whatsapp',
      utm_campaign: 'monte_sua_cesta',
      utm_content: 'orcamento_montado'
    });
    return `https://wa.me/${c.WHATSAPP_NUMBER}?${p.toString()}`;
  }

  async function compartilhar(m) {
    const mo = N.calculos.obterModelo(m.modelo);
    if (!mo) return { ok: false, mensagem: 'Escolha um modelo antes de compartilhar.' };
    if (navigator.share) {
      await navigator.share({ title: mo.nome, text: `Modelo escolhido: ${mo.nome}`, url: mo.urlPublica });
      return { ok: true, mensagem: 'Imagem do modelo compartilhada.' };
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(mo.urlPublica);
      return { ok: true, mensagem: 'Link da imagem copiado.' };
    }
    return { ok: false, mensagem: mo.urlPublica };
  }

  N.whatsapp = {
    gerarMensagemWhatsApp: msg,
    criarUrlWhatsApp: url,
    compartilharModelo: compartilhar
  };
})(window);
