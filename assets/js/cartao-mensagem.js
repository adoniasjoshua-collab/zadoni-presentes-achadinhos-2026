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

  // Pedido anônimo: o campo "De" some e o nome de quem envia não vai para o cartão nem para o resumo.
  const anonimo = field('cartao-anonimo');
  const campoDe = field('cartao-de').closest('.gift-field');
  const avisoAnonimo = document.querySelector('[data-cartao-anonimo-aviso]');
  function dados() {
    return {
      ocasiao: field('cartao-ocasiao').value,
      frase: field('cartao-frase').value.trim(),
      para: field('cartao-para').value.trim(),
      de: anonimo.checked ? '' : field('cartao-de').value.trim(),
      anonimo: anonimo.checked
    };
  }
  function assinatura(d) { return d.de ? 'Com carinho, ' + d.de : 'Com carinho'; }

  // Resumo do pedido: os nomes e a frase vão só no texto do WhatsApp (encodeURIComponent).
  // Sem emojis fora do BMP: no wa.me eles chegam como "�" no WhatsApp.
  const resumo = document.querySelector('[data-cartao-resumo]');
  const resumoTexto = resumo.querySelector('[data-cartao-texto]');
  const enviar = resumo.querySelector('[data-cartao-enviar]');
  const UTM = '&utm_source=site&utm_medium=whatsapp&utm_campaign=seo_local&utm_content=cartao_pedido';
  // A mensagem só é impressa junto com um presente: sem presente escolhido, o botão de envio fica oculto.
  const semPresente = resumo.querySelector('[data-cartao-sem-presente]');
  // Os 6 mais pedidos trazem nome, preço e foto (data-*); as categorias levam só ao link da página.
  const fotoPresente = form.querySelector('[data-cartao-presente-foto]');
  function presente() {
    const sel = field('cartao-presente');
    const opt = sel.options[sel.selectedIndex];
    if (!sel.value) return 'não escolhido';
    const link = new URL(sel.value, 'https://zadonipresentes.com.br/mensagens-para-acompanhar-presentes/').href;
    if (opt.dataset.nome) return opt.dataset.nome + ' · ' + opt.dataset.preco + ' (' + link + ')';
    return opt.textContent + ' (' + link + ')';
  }
  function mostrarFoto() {
    const opt = field('cartao-presente').selectedOptions[0];
    const temFoto = Boolean(opt && opt.dataset.foto);
    fotoPresente.style.display = temFoto ? 'flex' : 'none';
    if (!temFoto) return;
    const img = fotoPresente.querySelector('img');
    if (img.getAttribute('src') !== opt.dataset.foto) img.src = opt.dataset.foto;
    img.alt = opt.dataset.nome;
    fotoPresente.querySelector('span').textContent = opt.dataset.nome + ' · ' + opt.dataset.preco;
  }
  function textoPedido(d) {
    const linhas = [
      '▸ Ocasião: ' + d.ocasiao,
      '▸ Frase do cartão: “' + (d.frase || 'quero ajuda para escolher') + '”',
      '▸ De: ' + (d.anonimo ? '(anônimo)' : (d.de || 'não informado')),
      '▸ Para: ' + (d.para || 'não informado'),
      '▸ Presente: ' + presente(),
      '▸ Cartão impresso: taxa de R$ 10,00, vai junto com o presente',
      '▸ Entrega: ' + field('cartao-entrega').value
    ];
    if (d.anonimo) {
      linhas.push('', 'PEDIDO ANÔNIMO: não colocar o nome de quem envia no cartão nem na entrega. De: (anônimo) / Para: ' + (d.para || 'não informado'));
    }
    return 'Olá, Zadoni! Quero um presente com cartão.\n\n' + linhas.join('\n') + '\n\nPodem confirmar o pedido e o valor?';
  }

  function render() {
    const d = dados(), e = estiloAtual();
    campoDe.hidden = d.anonimo;
    avisoAnonimo.hidden = !d.anonimo;
    const texto = textoPedido(d);
    resumoTexto.textContent = texto;
    enviar.href = 'https://wa.me/5594992993138?text=' + encodeURIComponent(texto) + UTM;
    mostrarFoto();
    const temPresente = Boolean(field('cartao-presente').value);
    enviar.style.display = temPresente ? '' : 'none';
    semPresente.style.display = temPresente ? 'none' : '';
    preview.style.background = e.fundo;
    preview.style.color = e.texto;
    preview.style.borderColor = e.destaque;
    outPara.textContent = d.para ? 'Para ' + d.para : 'Para quem vai receber';
    outFrase.textContent = d.frase || 'Escolha ou escreva a sua frase.';
    outDe.textContent = assinatura(d);
  }

  // Frases sugeridas por ocasião (as da própria página; desculpas ganhou duas novas, sem prometer
  // que a mensagem resolve o conflito). O campo é remontado a cada troca de ocasião, porque o
  // iPhone ignora <option hidden>. O texto que a pessoa já escreveu nunca é apagado.
  const FRASES = {
    'Romântico': [
      'Você faz os dias comuns virarem boas lembranças. Este carinho é para você.',
      'Entre tantos planos, meu preferido continua sendo dividir a vida com você.',
      'Gosto do nosso jeito de rir, conversar e cuidar um do outro.',
      'Com você, até os dias simples ficam especiais.',
      'Meu lugar favorito é ao seu lado.',
      'Você deixa a minha vida mais leve e mais bonita.',
      'Tantos anos depois, você ainda é a minha melhor escolha.',
      'Cada dia ao seu lado é um presente. Te amo.'
    ],
    'Aniversário': [
      'Que seu novo ano tenha espaço para os sonhos e para as pequenas alegrias.',
      'Que o seu novo ano venha cheio de motivos para sorrir.',
      'Hoje o dia é seu: aproveite cada pedacinho dele.',
      'Parabéns! Que nunca falte gente boa e mesa cheia ao seu redor.',
      'Mãe, feliz aniversário! O mundo fica melhor com você nele.',
      'Pai, feliz aniversário! Seu exemplo me guia todos os dias.',
      'Feliz aniversário! Que bom comemorar mais um ano da nossa amizade.',
      'Parabéns pelo seu dia! Que o novo ano traga muitas conquistas.'
    ],
    'Pedido de desculpas': [
      'Sinto muito pelo que fiz. Quero te ouvir e cuidar melhor das minhas atitudes.',
      'Errei e reconheço. Quero conversar com calma e fazer diferente.',
      'Você é importante para mim. Me desculpe pelo que eu fiz.',
      'Eu errei com você. Quero cuidar melhor de nós dois.',
      'Nossa amizade vale mais que qualquer discussão. Me desculpe.',
      'Família é para sempre. Me desculpe pelo que eu disse.'
    ],
    'Natal': [
      'Neste Natal, deixo aqui um carinho e o desejo de bons momentos juntos.',
      'Que o Natal encha a sua casa de paz e de abraços.',
      'Que a nossa mesa continue cheia de risadas, abraços e histórias para contar. Feliz Natal, família!',
      'Mãe, seu cuidado é o melhor presente que eu já ganhei. Feliz Natal!',
      'Meu Natal fica mais bonito com você por perto. Que venham muitos outros juntos.',
      'Amizade como a sua é presente o ano inteiro. Feliz Natal e um ano novo cheio de alegrias!',
      'Sua parceria deixou o ano mais leve. Que o Natal traga descanso e boas conquistas.',
      'Mesmo longe, você está nos meus pensamentos. Este presente vai com um abraço apertado de Natal.',
      'Vó e vô, o Natal tem o cheiro e o gosto da casa de vocês. Amo vocês!',
      'Amigo secreto revelado: escolhi este presente pensando em você. Feliz Natal!'
    ],
    'Agradecimento': [
      'Seu cuidado fez diferença para mim. Este presente é meu jeito de agradecer.',
      'Um presente pequeno para quem faz uma diferença enorme.',
      'Que bom ter você por perto nos dias bons e nos difíceis.',
      'Professora, gratidão por ensinar com tanto carinho e paciência.',
      'Seu apoio deixou o meu ano mais leve. Gratidão, de coração.',
      'Mãe, gratidão por tudo o que você faz, todos os dias.',
      'Você esteve comigo quando eu mais precisei. Nunca vou esquecer.'
    ],
    'Outra ocasião': [
      'Mãe, cada abraço seu é um presente.',
      'Tudo de bom em mim começou com você.',
      'Seu amor é a minha casa, em qualquer lugar.',
      'Amizade como a sua a gente guarda para a vida toda.',
      'Que bom ter você por perto nos dias bons e nos difíceis.',
      'Um presente pequeno para quem faz uma diferença enorme.',
      'Não precisa de data especial: lembrei de você e quis te fazer sorrir.',
      'Só passando para dizer que você é importante para mim.'
    ]
  };
  function montarSugestoes() {
    const ocasiao = field('cartao-ocasiao').value;
    const lista = FRASES[ocasiao] || FRASES['Outra ocasião'];
    const sel = field('cartao-sugestao');
    const atual = sel.value;
    sel.textContent = '';
    sel.append(new Option('Escolha uma das ' + lista.length + ' frases ou escreva a sua', ''));
    lista.forEach(frase => sel.append(new Option(frase, frase)));
    sel.value = lista.includes(atual) ? atual : '';
  }
  field('cartao-ocasiao').addEventListener('change', montarSugestoes);

  // Caminho principal da página: tocar numa frase (botões "Usar no cartão") preenche o criador.
  // Captura no document para o clique não chegar ao quiz (gift-guides.js), que usa os mesmos botões.
  const status = document.querySelector('[data-cartao-status]');
  const ocasiaoDoQuiz = { 'Surpresa romântica': 'Romântico', 'Aniversário': 'Aniversário', 'Natal': 'Natal',
    'Agradecimento': 'Agradecimento', 'Pedido de desculpas': 'Pedido de desculpas' };
  document.addEventListener('click', function (event) {
    const botao = event.target.closest ? event.target.closest('[data-cartao-usar], [data-use-message]') : null;
    if (!botao) return;
    event.stopPropagation();
    event.preventDefault();
    const frase = botao.dataset.cartaoUsar || botao.dataset.useMessage || '';
    const ocasiao = botao.dataset.cartaoOcasiao || ocasiaoDoQuiz[botao.dataset.messageOccasion] || '';
    field('cartao-frase').value = frase;
    if (ocasiao && [...field('cartao-ocasiao').options].some(o => o.value === ocasiao)) field('cartao-ocasiao').value = ocasiao;
    montarSugestoes();
    const sugestao = field('cartao-sugestao');
    sugestao.value = [...sugestao.options].some(o => o.value === frase) ? frase : '';
    render();
    if (status) status.textContent = 'Frase escolhida. Agora coloque os nomes e escolha o presente.';
    // Foco antes da rolagem: um focus() depois de scrollIntoView cancela a rolagem suave do site.
    field('cartao-para').focus({ preventScroll: true });
    document.getElementById('criar-cartao').scrollIntoView({ block: 'start' });
  }, true);

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

  montarSugestoes();
  render();
  form.hidden = false;
  preview.hidden = false;
  resumo.hidden = false;
})();
