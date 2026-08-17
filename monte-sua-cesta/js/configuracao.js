(function (w) {
  const N = w.ZadoniCesta = w.ZadoniCesta || {};

  N.config = {
    STORAGE_KEY: 'zadoni_cesta_assistida_v2',
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
    orcamentos: [
      'Até R$ 149',
      'De R$ 150 a R$ 199',
      'De R$ 200 a R$ 299',
      'R$ 300 ou mais',
      'Quero orientação da Zadoni'
    ]
  };
})(window);
