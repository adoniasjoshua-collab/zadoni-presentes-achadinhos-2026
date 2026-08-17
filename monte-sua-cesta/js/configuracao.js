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
        preco: 18900,
        precoLabel: 'A partir de R$ 189',
        selo: 'Essencial',
        descricao: 'Composição mais enxuta, delicada e bem apresentada para presentear com carinho.'
      },
      {
        id: 'intermediaria',
        nome: 'Intermediária',
        preco: 27000,
        precoLabel: 'A partir de R$ 270',
        selo: 'Mais escolhida',
        destaque: true,
        descricao: 'Mais variedade de itens e acabamento especial, equilibrando presença e investimento.'
      },
      {
        id: 'premium',
        nome: 'Premium',
        preco: 30000,
        precoLabel: 'A partir de R$ 300',
        selo: 'Mais completa',
        descricao: 'Montagem ampla e sofisticada, com mais impacto visual e possibilidades de personalização.'
      }
    ]
  };
})(window);
