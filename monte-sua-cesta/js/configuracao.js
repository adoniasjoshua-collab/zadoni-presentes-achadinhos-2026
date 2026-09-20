(function (w) {
  const N = w.ZadoniCesta = w.ZadoniCesta || {};

  N.config = {
    STORAGE_KEY: 'zadoni_cesta_assistida_v3',
    WHATSAPP_NUMBER: '5594992993138',
    PAGE_URL: 'https://zadonipresentes.com.br/monte-sua-cesta/',
    EXPIRATION_MS: 7 * 24 * 60 * 60 * 1000,
    OBSERVACOES_MAX: 300,
    ocasioes: [
      'Aniversário',
      'Romântico',
      'Café da manhã',
      'Agradecimento',
      'Pedido de desculpas',
      'Conquista',
      'Dia dos Pais',
      'Dia das Mães',
      'Outra ocasião'
    ],
    niveisMontagem: [
      {
        id: 'basica',
        nome: 'Básica',
        preco: 22000,
        precoLabel: 'A partir de R$ 220',
        selo: 'Essencial',
        descricao: 'Sugestão para um gesto de carinho com uma montagem delicada e bem apresentada.',
        imagem: '../assets/optimized/products/responsive/cesta-feminina-delicada-720-720.webp',
        imagemAlt: 'Cesta delicada para a faixa Básica'
      },
      {
        id: 'intermediaria',
        nome: 'Intermediária',
        preco: 27000,
        precoLabel: 'A partir de R$ 270',
        selo: 'Versão intermediária',
        destaque: true,
        descricao: 'Sugestão equilibrada para aniversários e momentos especiais, com mais variedade de itens.',
        imagem: '../assets/optimized/products/responsive/cesta-cafe-da-manha-especial-720-720.webp',
        imagemAlt: 'Cesta completa para a faixa Intermediária'
      },
      {
        id: 'premium',
        nome: 'Premium',
        preco: 30000,
        precoLabel: 'A partir de R$ 300',
        selo: 'Mais completa',
        descricao: 'Sugestão de maior impacto, com montagem ampla, sofisticada e mais possibilidades de personalização.',
        imagem: '../assets/optimized/products/responsive/cesta-masculina-gourmet-dourada-720-720.webp',
        imagemAlt: 'Cesta gourmet premium com acabamento dourado'
      }
    ]
  };
})(window);
