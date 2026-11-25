/* Criador de cartão da página de mensagens.
   Nada do que a pessoa digita é gravado no navegador (sem localStorage, sessionStorage ou cookie)
   nem vai para a URL da página. */
(function () {
  'use strict';
  const form = document.querySelector('[data-cartao-form]');
  if (!form) return;
  const preview = document.querySelector('[data-cartao-preview]');
  const outPara = preview.querySelector('[data-cartao-para]');
  const outFrase = preview.querySelector('[data-cartao-frase]');
  const outDe = preview.querySelector('[data-cartao-de]');
  const field = name => form.elements.namedItem(name);

  // Estilos por ocasião, com as variáveis de cor do tema do site.
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const estilos = {
    'Romântico': { fundo: '--z-vinho', texto: '#ffffff', destaque: '--z-ouro' },
    'Aniversário': { fundo: '--z-ouro-claro', texto: '--z-vinho-escuro', destaque: '--z-rosa' },
    'Pedido de desculpas': { fundo: '--z-creme', texto: '--z-texto', destaque: '--z-texto-leve' },
    'Natal': { fundo: '--z-vinho-escuro', texto: '--z-creme', destaque: '--z-ouro' },
    'Agradecimento': { fundo: '--z-blush', texto: '--z-vinho', destaque: '--z-rosa-escuro' },
    'Outra ocasião': { fundo: '--z-blush', texto: '--z-vinho', destaque: '--z-rosa-escuro' }
  };
  const cor = v => (v.startsWith('--') ? css(v) : v) || '#5a1f3f';
  function estiloAtual() {
    const e = estilos[field('cartao-ocasiao').value] || estilos['Outra ocasião'];
    return { fundo: cor(e.fundo), texto: cor(e.texto), destaque: cor(e.destaque) };
  }

  function dados() {
    return {
      ocasiao: field('cartao-ocasiao').value,
      frase: field('cartao-frase').value.trim(),
      para: field('cartao-para').value.trim(),
      de: field('cartao-de').value.trim()
    };
  }
  function assinatura(d) { return d.de ? 'Com carinho, ' + d.de : 'Com carinho'; }

  function render() {
    const d = dados(), e = estiloAtual();
    preview.style.background = e.fundo;
    preview.style.color = e.texto;
    preview.style.borderColor = e.destaque;
    outPara.textContent = d.para ? 'Para ' + d.para : 'Para quem vai receber';
    outFrase.textContent = d.frase || 'Escolha ou escreva a sua frase.';
    outDe.textContent = assinatura(d);
  }

  field('cartao-sugestao').addEventListener('change', function () {
    if (this.value) field('cartao-frase').value = this.value;
    render();
  });
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', event => event.preventDefault());

  // Baixar cartão: PNG 1080 x 1350 desenhado no canvas, só no aparelho da pessoa.
  function quebrar(ctx, texto, largura) {
    const linhas = [];
    texto.split('\n').forEach(par => {
      let linha = '';
      par.split(/\s+/).forEach(palavra => {
        const teste = linha ? linha + ' ' + palavra : palavra;
        if (ctx.measureText(teste).width > largura && linha) { linhas.push(linha); linha = palavra; }
        else linha = teste;
      });
      linhas.push(linha);
    });
    return linhas;
  }
  document.querySelector('[data-cartao-baixar]').addEventListener('click', function () {
    const d = dados(), e = estiloAtual();
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = e.fundo; ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = e.destaque; ctx.lineWidth = 6; ctx.strokeRect(60, 60, 960, 1230);
    ctx.lineWidth = 2; ctx.strokeRect(84, 84, 912, 1182);
    ctx.fillStyle = e.texto; ctx.textAlign = 'center';
    ctx.font = 'italic 52px Georgia, "Times New Roman", serif';
    ctx.fillText(d.para ? 'Para ' + d.para : '', 540, 260);
    ctx.font = '58px Georgia, "Times New Roman", serif';
    const linhas = quebrar(ctx, d.frase || '', 800);
    const altura = 78, inicio = 675 - (linhas.length - 1) * altura / 2;
    linhas.forEach((l, i) => ctx.fillText(l, 540, inicio + i * altura));
    ctx.font = 'italic 46px Georgia, "Times New Roman", serif';
    ctx.fillText(assinatura(d), 540, 1080);
    ctx.fillStyle = e.destaque; ctx.font = '28px Georgia, "Times New Roman", serif';
    ctx.fillText('Zadoni Presentes · Canaã dos Carajás', 540, 1220);
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'cartao-zadoni.png';
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  });

  render();
  form.hidden = false;
  preview.hidden = false;
})();
