/**
 * Base de produtos - Zadoni
 * Dados ficticios organizados para edicao rapida.
 */

const adicionaisBuques = [
  {
    id: "ferrero-rocher",
    nome: "Ferrero Rocher",
    preco: 35.00
  },
  {
    id: "caixinha-tres-ferrero",
    nome: "Caixinha com 3 Ferrero Rocher",
    preco: 22.00
  },
  {
    id: "ursinho-chaveiro",
    nome: "Ursinho de pelúcia chaveiro",
    preco: 27.00
  },
  {
    id: "cartao-personalizado",
    nome: "Cartão impresso ou escrito à mão",
    preco: 15.00
  },
  {
    id: "foto-impressa",
    nome: "Foto impressa",
    preco: 15.00,
    tipo: "quantidade",
    unidade: "foto"
  },
  {
    id: "body-splash-winpink",
    nome: "Body Splash Winpink",
    preco: 78.00
  },
  {
    id: "perfume-bolso-amakha",
    nome: "Perfume de bolso Amakha Paris 15 ml",
    preco: 47.00,
    observacao: "Fragrância a escolher"
  },
  {
    id: "perfume-hinode-100ml",
    nome: "Perfume Hinode 100 ml",
    preco: 189.00,
    observacao: "A partir de R$ 189,00"
  }
];

const adicionaisCestas = [
  {
    id: "chocolate-extra",
    nome: "Chocolate extra",
    preco: 25.00,
    observacao: "Opcao a escolher"
  },
  {
    id: "ferrero-rocher-cesta",
    nome: "Ferrero Rocher",
    preco: 35.00
  },
  {
    id: "petisco-premium",
    nome: "Petisco premium",
    preco: 28.00,
    observacao: "Salgado, castanhas ou snack"
  },
  {
    id: "bebida-especial",
    nome: "Bebida especial",
    preco: 32.00,
    observacao: "Refrigerante, suco ou similar"
  },
  {
    id: "caneca-presente",
    nome: "Caneca para presente",
    preco: 39.00
  },
  {
    id: "cartao-personalizado-cesta",
    nome: "Cartao impresso ou escrito a mao",
    preco: 15.00
  },
  {
    id: "foto-impressa-cesta",
    nome: "Foto impressa",
    preco: 15.00,
    tipo: "quantidade",
    unidade: "foto"
  },
  {
    id: "item-beleza",
    nome: "Item de beleza ou autocuidado",
    preco: 47.00,
    observacao: "Produto conforme disponibilidade"
  }
];

const produtosLocais = [
  {
    id: 1,
    nome: "Buque Romantico",
    categoria: "Flores",
    descricao: "Buque romantico com balao Te Amo, flores vermelhas e acabamento especial para surpreender.",
    preco: 189.00,
    imagem: "assets/optimized/products/buque-te-amo-romantico.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Romantico. Pode me passar mais informacoes?"
  },
  {
    id: 2,
    nome: "Buque na xicara",
    categoria: "Flores",
    descricao: "Arranjo criativo com flores em xicara decorativa, pronto para presentear.",
    preco: 119.90,
    imagem: "assets/optimized/products/buque-na-xicara-premium.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre o Buque na xicara."
  },
  {
    id: 3,
    nome: "Kit romantico com chocolates",
    categoria: "Kits",
    descricao: "Kit com itens romanticos, chocolates selecionados e acabamento especial.",
    preco: 149.90,
    imagem: "assets/optimized/products/box-amor-perfeito.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Kit romantico com chocolates."
  },
  {
    id: 6,
    nome: "Cesta Masculina Vinho Bella Vista",
    categoria: "Cestas",
    descricao: "Cesta premium com vinho, taca, chocolates e apresentacao sofisticada.",
    preco: 239.90,
    imagem: "assets/optimized/products/cesta-masculina-vinho-bella-vista.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Quero informacoes sobre a Cesta Masculina Vinho Bella Vista."
  },
  {
    id: 7,
    nome: "Cesta Masculina Azul Classica",
    categoria: "Cestas",
    descricao: "Cesta masculina com refrigerante, petiscos, caneca e acabamento em fita azul.",
    preco: 169.90,
    imagem: "assets/optimized/products/cesta-masculina-azul-classica.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Azul Classica."
  },
  {
    id: 8,
    nome: "Cesta Masculina Gourmet Dourada",
    categoria: "Cestas",
    descricao: "Composicao elegante com bebida, chocolates e acabamento dourado para presentear.",
    preco: 219.90,
    imagem: "assets/optimized/products/cesta-masculina-gourmet-dourada.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre a Cesta Masculina Gourmet Dourada."
  },
  {
    id: 9,
    nome: "Cesta Masculina Verde Artesanal",
    categoria: "Cestas",
    descricao: "Cesta artesanal com embalagem transparente, laco verde e selecao de mimos.",
    preco: 179.90,
    imagem: "assets/optimized/products/cesta-masculina-verde-artesanal.jpg",
    destaque: false,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Verde Artesanal."
  },
  {
    id: 10,
    nome: "Cesta Feminina Delicada",
    categoria: "Cestas",
    descricao: "Cesta delicada para surpreender com carinho, beleza e acabamento especial.",
    preco: 189.90,
    imagem: "assets/optimized/products/cesta-feminina-delicada.webp",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Feminina Delicada."
  },
  {
    id: 11,
    nome: "Cesta Masculina Vinho e Petiscos",
    categoria: "Cestas",
    descricao: "Cesta masculina com vinho, castanhas, doces e acabamento moderno em preto.",
    preco: 249.90,
    imagem: "assets/optimized/products/cesta-masculina-vinho-e-petiscos.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Vinho e Petiscos."
  },
  {
    id: 12,
    nome: "Box Amor Perfeito",
    categoria: "Kits",
    descricao: "Box romantico com composicao charmosa para datas especiais e declaracoes.",
    preco: 159.90,
    imagem: "assets/optimized/products/box-amor-perfeito.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Quero informacoes sobre o Box Amor Perfeito."
  },
  {
    id: 13,
    nome: "Box Girassol com Caixa",
    categoria: "Kits",
    descricao: "Presente alegre com girassol, caixa decorada e visual marcante.",
    preco: 169.00,
    imagem: "assets/optimized/products/box-girassol-com-caixa.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre o Box Girassol com Caixa."
  },
  {
    id: 15,
    nome: "Buque Declaracao de Amor",
    categoria: "Flores",
    descricao: "Buque romantico com balao Te Amo, flores vermelhas e acabamento especial para declarar amor.",
    preco: 149.00,
    imagem: "assets/optimized/products/buque-te-amo-mae.jpg",
    destaque: false,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Quero informacoes sobre o Buque Declaracao de Amor."
  },
  {
    id: 16,
    nome: "Buque Te Amo Romantico",
    categoria: "Flores",
    descricao: "Buque romantico para surpreender com uma mensagem direta e especial.",
    preco: 189.00,
    imagem: "assets/optimized/products/buque-te-amo-romantico.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Te Amo Romantico."
  },
  {
    id: 17,
    nome: "Cesta Cafe da Manha Especial",
    categoria: "Cestas",
    descricao: "Cesta de cafe da manha para presentear com praticidade e carinho.",
    preco: 199.90,
    imagem: "assets/optimized/products/cesta-cafe-da-manha-especial.webp",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre a Cesta Cafe da Manha Especial."
  },
  {
    id: 18,
    nome: "Kit Vela Presente Especial",
    categoria: "Kits",
    descricao: "Kit com vela e composicao elegante para um presente sensorial e delicado.",
    preco: 129.90,
    imagem: "assets/optimized/products/kit-vela-presente-especial.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Kit Vela Presente Especial."
  },
  {
    id: 19,
    nome: "Mimo Carinho Especial",
    categoria: "Mimos",
    descricao: "Opcao afetiva e acessivel para surpreender com carinho sem esperar uma data especial.",
    preco: 129.00,
    imagem: "assets/optimized/products/mimo-carinho-especial.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Mimo Carinho Especial."
  },
  {
    id: 20,
    nome: "Mimo Coca-Cola Criativo",
    categoria: "Mimos",
    descricao: "Mimo jovem e divertido com bebida, doces e acabamento pronto para presentear.",
    preco: 69.90,
    imagem: "assets/optimized/products/mimo-coca-cola-criativo.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Mimo Coca-Cola Criativo."
  },
  {
    id: 21,
    nome: "Mimo Ferrero Elegante",
    categoria: "Mimos",
    descricao: "Mimo com toque premium para quem quer presentear com chocolate e visual sofisticado.",
    preco: 39.00,
    imagem: "assets/optimized/products/mimo-ferrero-elegante.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Mimo Ferrero Elegante."
  },
  {
    id: 22,
    nome: "Cone Ferrero Presente Charmoso",
    categoria: "Mimos",
    descricao: "Cone presenteavel com proposta elegante, ideal para lembrancas rapidas e marcantes.",
    preco: 89.00,
    imagem: "assets/optimized/products/cone-ferrero-presente-charmoso.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Cone Ferrero Presente Charmoso."
  },
  {
    id: 23,
    nome: "Cestinha Virginia Mimo Delicado",
    categoria: "Cestas",
    descricao: "Cestinha delicada com composicao pronta para aniversarios, agradecimentos e surpresas.",
    preco: 139.00,
    imagem: "assets/optimized/products/cestinha-virginia-mimo-delicado.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cestinha Virginia Mimo Delicado."
  },
  {
    id: 24,
    nome: "Kit Ferrari Presente Premium",
    categoria: "Kits",
    descricao: "Kit masculino com presenca forte, ideal para presente sofisticado e memoravel.",
    preco: 297.00,
    imagem: "assets/optimized/products/kit-ferrari-presente-premium.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Quero informacoes sobre o Kit Ferrari Presente Premium."
  },
  {
    id: 25,
    nome: "Jarro Flores Naturais Vermelho",
    categoria: "Mimos",
    descricao: "Jarro com flores naturais em box vermelho, laco especial e mensagem afetiva para presentear com charme.",
    preco: 75.00,
    imagem: "assets/optimized/products/jarro-flores-naturais-vermelho.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Jarro Flores Naturais Vermelho."
  },
  {
    id: 26,
    nome: "Jarro Flor Natural Laco Vermelho",
    categoria: "Mimos",
    descricao: "Jarro com flor natural vermelha, embalagem delicada e laco vermelho pronto para presente.",
    preco: 89.00,
    imagem: "assets/optimized/products/jarro-flor-natural-laco-vermelho.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Jarro Flor Natural Laco Vermelho."
  },
  {
    id: 27,
    nome: "Jarro Flor Natural Laco Rosa",
    categoria: "Mimos",
    descricao: "Jarro com flor natural rosa, embalagem delicada e laco pink para um mimo cheio de carinho.",
    preco: 89.00,
    imagem: "assets/optimized/products/jarro-flor-natural-laco-rosa.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Jarro Flor Natural Laco Rosa."
  },
  {
    id: 28,
    nome: "Perfume de Bolso Asadiyy 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia masculina ambarada e marcante, inspirada no Asad. Ideal para quem gosta de perfume intenso, elegante e com presenca.",
    preco: 47.00,
    imagem: "assets/optimized/products/perfume-asadiyy-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Asadiyy 15ml. Quais fragrancias estao disponiveis?"
  },
  {
    id: 29,
    nome: "Perfume de Bolso Chic Woman 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia feminina sofisticada, inspirada no Coco Mademoiselle. Uma opcao elegante para presente romantico e uso diario.",
    preco: 47.00,
    imagem: "assets/optimized/products/perfume-chic-woman-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Chic Woman 15ml. Voce pode me passar disponibilidade?"
  },
  {
    id: 30,
    nome: "Perfume de Bolso Fortune 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia masculina amadeirada, inspirada no 1 Million. Combina presenca, estilo e praticidade para levar no bolso.",
    preco: 47.00,
    imagem: "assets/optimized/products/perfume-fortune-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Fortune 15ml. Ainda tem disponivel?"
  },
  {
    id: 31,
    nome: "Perfume de Bolso Zaya 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia feminina ambarada gourmand, inspirada no Yara. Doce, envolvente e perfeita para encontros e momentos especiais.",
    preco: 47.00,
    imagem: "assets/optimized/products/perfume-zaya-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Zaya 15ml. Pode me falar mais sobre essa fragrancia?"
  },
  {
    id: 32,
    nome: "Perfume de Bolso 521 Vip Rose 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia feminina floral frutada, inspirada no 212 Vip Rose. Leve, charmosa e marcante para presentear no Dia dos Namorados.",
    preco: 47.00,
    imagem: "assets/optimized/products/perfume-521-vip-rose-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso 521 Vip Rose 15ml. Quero saber as opcoes para presente."
  },
  {
    id: 33,
    nome: "Cesta Romantica com Vinho San Martin",
    categoria: "Cestas",
    descricao: "Cesta romantica com vinho, chocolates, Ferrero Rocher, caneca e detalhe de coracao para uma surpresa marcante.",
    preco: 249.90,
    imagem: "assets/optimized/products/cesta-romantica-vinho-san-martin.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Romantica com Vinho San Martin. Pode me passar disponibilidade?"
  },
  {
    id: 34,
    nome: "Buque Rosa Pretty Flower",
    categoria: "Flores",
    descricao: "Buque delicado em tons de rosa, com embalagem Pretty Flower Studio e visual elegante para presente romantico.",
    preco: 149.00,
    imagem: "assets/optimized/products/buque-rosa-pretty-flower.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Rosa Pretty Flower. Pode me passar mais informacoes?"
  },
  {
    id: 35,
    nome: "Buque Rosas Vermelhas Premium",
    categoria: "Flores",
    descricao: "Buque premium com rosas vermelhas, acabamento preto e visual intenso para declaracoes especiais.",
    preco: 189.00,
    imagem: "assets/optimized/products/buque-rosas-vermelhas-premium.jpg",
    destaque: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Rosas Vermelhas Premium. Quero saber disponibilidade."
  },
  {
    id: 36,
    nome: "Mimo Amor Perfeito com Trufas",
    categoria: "Mimos",
    descricao: "Mimo afetivo com trufas, pelucia, flor e embalagem Amor Perfeito para presentear com carinho.",
    preco: 119.90,
    imagem: "assets/optimized/products/mimo-amor-perfeito-trufas-pelucia.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Mimo Amor Perfeito com Trufas. Pode me passar disponibilidade?"
  }
];
