/**
 * Base ativa de produtos - Zadoni.
 * Nomes e observacoes devem informar unidade, porcao ou variacao de estoque.
 */

const adicionaisBuques = [
  {
    id: "ferrero-rocher",
    nome: "Ferrero Rocher - caixa com 4 unidades",
    preco: 39.00,
    imagem: "monte-sua-cesta/assets/produtos/ferrero-rocher-caixa-4.webp"
  },
  {
    id: "ursinho-chaveiro",
    nome: "Ursinho de pelúcia chaveiro - 1 unidade",
    preco: 29.00,
    imagem: "monte-sua-cesta/assets/produtos/chaveiro-ursinho.webp"
  },
  {
    id: "cartao-personalizado",
    nome: "Cartão personalizado - 1 unidade",
    preco: 15.00,
    observacao: "Mensagem enviada pelo cliente no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/carta-personalizada.webp"
  },
  {
    id: "foto-impressa",
    nome: "Foto impressa",
    preco: 15.00,
    tipo: "quantidade",
    unidade: "foto",
    observacao: "Arquivo enviado pelo cliente no WhatsApp"
  },
  {
    id: "body-splash-winpink",
    nome: "Body Splash Winpink - 1 unidade",
    preco: 97.00,
    observacao: "Fragrância e embalagem confirmadas no WhatsApp"
  },
  {
    id: "perfume-bolso-amakha",
    nome: "Perfume de bolso Amakha Paris 15 ml",
    preco: 50.00,
    observacao: "Fragrância escolhida conforme estoque",
    imagem: "assets/optimized/products/perfume-521-vip-rose-amakha-15ml.jpg"
  },
  {
    id: "perfume-hinode-100ml",
    nome: "Perfume Hinode 100 ml - 1 unidade",
    preco: 189.00,
    observacao: "A partir de R$ 189; fragrância e valor final confirmados no WhatsApp"
  }
];

const adicionaisCestas = [
  {
    id: "ferrero-rocher-cesta",
    nome: "Ferrero Rocher - caixa com 4 unidades",
    preco: 39.00,
    imagem: "monte-sua-cesta/assets/produtos/ferrero-rocher-caixa-4.webp"
  },
  {
    id: "ferrero-rocher-12-cesta",
    nome: "Ferrero Rocher - caixa com 12 unidades",
    preco: 69.00,
    imagem: "monte-sua-cesta/assets/produtos/ferrero-rocher-caixa-12.webp"
  },
  {
    id: "barrinha-cacau-show-cesta",
    nome: "Barrinha Cacau Show - 1 unidade",
    preco: 10.00,
    observacao: "Sabor escolhido conforme disponibilidade",
    imagem: "monte-sua-cesta/assets/produtos/barrinha-cacau-show.webp"
  },
  {
    id: "nutella-cesta",
    nome: "Nutella para cesta - 1 pote",
    preco: 35.00,
    observacao: "Tamanho da embalagem confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/nutella.webp"
  },
  {
    id: "mini-bolo-cesta",
    nome: "Mini bolo decorado - 1 unidade",
    preco: 80.00,
    observacao: "Sabor e acabamento confirmados no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/mini-bolo-aniversario.webp"
  },
  {
    id: "salgados-variados-cesta",
    nome: "Porção de salgados variados",
    preco: 69.00,
    observacao: "Quantidade da porção confirmada no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/salgados-variados.webp"
  },
  {
    id: "suco-uva-aurora-cesta",
    nome: "Suco de uva Aurora - 1 garrafa pequena",
    preco: 15.00,
    imagem: "monte-sua-cesta/assets/produtos/suco-uva-aurora.webp"
  },
  {
    id: "caneca-presente",
    nome: "Caneca para presente - 1 unidade",
    preco: 39.00,
    observacao: "Modelo e cor confirmados no WhatsApp"
  },
  {
    id: "cartao-personalizado-cesta",
    nome: "Cartão personalizado - 1 unidade",
    preco: 15.00,
    observacao: "Mensagem enviada pelo cliente no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/carta-personalizada.webp"
  },
  {
    id: "foto-impressa-cesta",
    nome: "Foto impressa",
    preco: 15.00,
    tipo: "quantidade",
    unidade: "foto",
    observacao: "Arquivo enviado pelo cliente no WhatsApp"
  },
  {
    id: "item-beleza",
    nome: "Item de beleza ou autocuidado - 1 unidade",
    preco: 47.00,
    observacao: "Produto específico escolhido com a Zadoni no WhatsApp"
  }
];

const adicionaisCafeManha = [
  {
    id: "pao-frances-cafe",
    nome: "Porção de pães franceses",
    preco: 15.00,
    observacao: "Quantidade da porção confirmada no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/pao-frances.webp"
  },
  {
    id: "mini-croissant-cafe",
    nome: "Porção de mini croissants",
    preco: 18.00,
    observacao: "Quantidade da porção confirmada no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/mini-croissant.webp"
  },
  {
    id: "bolo-simples-cafe",
    nome: "Bolo simples - 1 unidade",
    preco: 49.00,
    observacao: "Tamanho e sabor confirmados no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/bolo-simples-cafe.webp"
  },
  {
    id: "geleia-cafe",
    nome: "Geleia de frutas vermelhas - 1 pote",
    preco: 32.00,
    observacao: "Marca e peso confirmados no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/geleia-frutas-vermelhas.webp"
  },
  {
    id: "requeijao-cafe",
    nome: "Requeijão tradicional - 1 pote",
    preco: 25.00,
    observacao: "Marca e peso confirmados no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/requeijao-vigor.webp"
  },
  {
    id: "queijo-cafe",
    nome: "Porção de queijo fatiado",
    preco: 22.00,
    observacao: "Peso da porção confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/queijo-fatiado.webp"
  },
  {
    id: "achocolatado-cafe",
    nome: "Achocolatado Nescau pronto para beber - 1 unidade",
    preco: 15.00,
    observacao: "Volume confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/achocolatado-nescau.webp"
  },
  {
    id: "leite-cafe",
    nome: "Leite Piracanjuba integral - 1 unidade",
    preco: 24.00,
    observacao: "Volume confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/leite-piracanjuba.webp"
  },
  {
    id: "iogurte-cafe",
    nome: "Iogurte Vigor morango - 1 unidade",
    preco: 18.00,
    observacao: "Volume confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/iogurte-morango.webp"
  },
  {
    id: "biscoito-cafe",
    nome: "Biscoito Bauducco Fini - 1 pacote",
    preco: 16.00,
    observacao: "Sabor confirmado no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/biscoito-bauducco.webp"
  },
  {
    id: "mini-bolo-cafe",
    nome: "Mini bolo decorado - 1 unidade",
    preco: 80.00,
    observacao: "Sabor e acabamento confirmados no WhatsApp",
    imagem: "monte-sua-cesta/assets/produtos/mini-bolo-aniversario.webp"
  },
  {
    id: "rosa-branca-cafe",
    nome: "Rosa branca - 1 unidade",
    preco: 29.00,
    imagem: "monte-sua-cesta/assets/produtos/rosa-branca.webp"
  }
];

// Cestas de cafe podem receber tanto complementos matinais quanto os
// adicionais gerais de cesta. O mini bolo aparece uma unica vez.
const adicionaisCestasCafe = [
  ...adicionaisCafeManha,
  ...adicionaisCestas.filter((adicional) => adicional.id !== "mini-bolo-cesta")
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
    preco: 229.00,
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
    preco: 227.00,
    imagem: "assets/optimized/products/cesta-cafe-da-manha-especial.webp",
    destaque: true,
    adicionaisOpcionais: adicionaisCafeManha,
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
    preco: 79.00,
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
    preco: 50.00,
    imagem: "assets/optimized/products/perfume-asadiyy-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Asadiyy 15ml. Quais fragrancias estao disponiveis?"
  },
  {
    id: 29,
    nome: "Perfume de Bolso Chic Woman 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia feminina sofisticada, inspirada no Coco Mademoiselle. Uma opcao elegante para presente romantico e uso diario.",
    preco: 50.00,
    imagem: "assets/optimized/products/perfume-chic-woman-amakha-15ml.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Perfume de Bolso Chic Woman 15ml. Voce pode me passar disponibilidade?"
  },
  {
    id: 30,
    nome: "Perfume de Bolso Fortune 15ml",
    categoria: "Perfumes",
    descricao: "Fragrancia masculina amadeirada, inspirada no 1 Million. Combina presenca, estilo e praticidade para levar no bolso.",
    preco: 50.00,
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
    descricao: "Fragrancia feminina floral frutada, inspirada no 212 Vip Rose. Leve, charmosa e marcante para complementar presentes romanticos.",
    preco: 50.00,
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
  },
  {
    id: 37,
    nome: "Cesta Romantica na Bandeja",
    categoria: "Cestas",
    descricao: "Cesta romantica em bandeja com rosas, chocolate, mimo especial e composicao consultada conforme disponibilidade e personalizacao.",
    preco: 199.90,
    imagem: "assets/optimized/products/cesta-na-bandeja.webp",
    destaque: true,
    observacaoPreco: "Modelo para inspiracao. O valor final pode variar conforme itens escolhidos, disponibilidade, tamanho da montagem e personalizacao.",
    adicionaisOpcionais: adicionaisCestas,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Romantica na Bandeja. Pode me passar disponibilidade e opcoes de personalizacao?"
  },
  {
    id: 38,
    nome: "Mini bolo decorado - 1 unidade",
    categoria: "Adicionais",
    descricao: "Mini bolo decorado para enviar junto com cesta, buquê ou mimo especial. Valor estimado conforme modelo e disponibilidade.",
    preco: 80.00,
    imagem: "monte-sua-cesta/assets/produtos/mini-bolo-aniversario.webp",
    destaque: true,
    observacaoPreco: "Valor estimado. O acabamento e sabor são confirmados no atendimento.",
    whatsappMensagem: "Ola! Tenho interesse em um Mini bolo de aniversario para complementar um presente."
  },
  {
    id: 39,
    nome: "Porção de salgados variados",
    categoria: "Adicionais",
    descricao: "Porção de salgados variados para compor cesta de lanche, aniversário ou café especial.",
    preco: 69.00,
    imagem: "monte-sua-cesta/assets/produtos/salgados-variados.webp",
    destaque: false,
    observacaoPreco: "O valor corresponde a uma porção. A quantidade e a disponibilidade são confirmadas no WhatsApp.",
    whatsappMensagem: "Ola! Tenho interesse em salgados variados para complementar uma cesta."
  },
  {
    id: 40,
    nome: "Nutella para cesta - 1 pote",
    categoria: "Adicionais",
    descricao: "Creme de avelã Nutella para deixar a composição mais premium e afetiva.",
    preco: 35.00,
    imagem: "monte-sua-cesta/assets/produtos/nutella.webp",
    destaque: true,
    observacaoPreco: "O tamanho da embalagem é confirmado no WhatsApp.",
    whatsappMensagem: "Ola! Quero adicionar Nutella em uma cesta da Zadoni."
  },
  {
    id: 41,
    nome: "Bolo simples para cesta - 1 unidade",
    categoria: "Adicionais",
    descricao: "Bolo simples para cesta de café da manhã ou lanche personalizado.",
    preco: 49.00,
    imagem: "monte-sua-cesta/assets/produtos/bolo-simples-cafe.webp",
    destaque: false,
    observacaoPreco: "O tamanho, o sabor e a disponibilidade são confirmados no WhatsApp.",
    whatsappMensagem: "Ola! Tenho interesse em um bolo simples para montar uma cesta."
  },
  {
    id: 42,
    nome: "Bolo confeitado especial",
    categoria: "Adicionais",
    descricao: "Bolo confeitado de 2 kg para composição premium de aniversário, romance ou surpresa especial.",
    preco: 210.00,
    imagem: "monte-sua-cesta/assets/produtos/bolo-bailarina-chocolate.webp",
    destaque: true,
    observacaoPreco: "Valor para bolo de 2 kg. Modelo e disponibilidade são confirmados pelo WhatsApp.",
    whatsappMensagem: "Ola! Quero consultar um bolo confeitado para complementar um presente."
  },
  {
    id: 43,
    nome: "Suco de uva Aurora - 1 garrafa pequena",
    categoria: "Adicionais",
    descricao: "Garrafa menor de suco de uva Aurora para compor cestas especiais, opções masculinas, românticas ou de café.",
    preco: 15.00,
    imagem: "monte-sua-cesta/assets/produtos/suco-uva-aurora.webp",
    destaque: false,
    whatsappMensagem: "Ola! Quero adicionar Suco de uva Aurora em uma cesta."
  },
  {
    id: 44,
    nome: "Rosa branca avulsa - 1 unidade",
    categoria: "Adicionais",
    descricao: "Rosa branca para incluir em cesta, buquê, bandeja ou surpresa personalizada.",
    preco: 29.00,
    imagem: "monte-sua-cesta/assets/produtos/rosa-branca.webp",
    destaque: false,
    whatsappMensagem: "Ola! Tenho interesse em adicionar rosa branca a um presente."
  },
  {
    id: 46,
    nome: "Ferrero Rocher - caixa com 4 unidades",
    categoria: "Adicionais",
    descricao: "Caixa fechada com 4 bombons Ferrero Rocher para complementar cesta, buquê ou mimo.",
    preco: 39.00,
    imagem: "monte-sua-cesta/assets/produtos/ferrero-rocher-caixa-4.webp",
    destaque: true,
    whatsappMensagem: "Ola! Quero adicionar uma caixa com 4 Ferrero Rocher ao meu presente."
  },
  {
    id: 48,
    nome: "Ursinho de pelúcia chaveiro - 1 unidade",
    categoria: "Adicionais",
    descricao: "Ursinho de pelúcia em formato de chaveiro para complementar cesta, buquê ou mimo.",
    preco: 29.00,
    imagem: "monte-sua-cesta/assets/produtos/chaveiro-ursinho.webp",
    destaque: false,
    observacaoPreco: "O modelo e a cor são confirmados conforme o estoque.",
    whatsappMensagem: "Ola! Quero adicionar um ursinho de pelucia chaveiro ao meu presente."
  },
  {
    id: 49,
    nome: "Cartão personalizado - 1 unidade",
    categoria: "Adicionais",
    descricao: "Cartão impresso ou escrito à mão com a mensagem enviada pelo cliente.",
    preco: 15.00,
    imagem: "monte-sua-cesta/assets/produtos/carta-personalizada.webp",
    destaque: false,
    observacaoPreco: "A mensagem é enviada pelo cliente durante o atendimento no WhatsApp.",
    whatsappMensagem: "Ola! Quero adicionar um cartao personalizado ao meu presente."
  },
  {
    id: 50,
    nome: "Ferrero Rocher - caixa com 12 unidades",
    categoria: "Adicionais",
    descricao: "Caixa fechada com 12 bombons Ferrero Rocher para complementar cesta, buquê ou mimo especial.",
    preco: 69.00,
    imagem: "monte-sua-cesta/assets/produtos/ferrero-rocher-caixa-12.webp",
    destaque: true,
    whatsappMensagem: "Ola! Quero adicionar uma caixa com 12 Ferrero Rocher ao meu presente."
  },
  {
    id: 51,
    nome: "Barrinha Cacau Show - 1 unidade",
    categoria: "Adicionais",
    descricao: "Uma barrinha Cacau Show para acrescentar à cesta ou ao presente.",
    preco: 10.00,
    imagem: "monte-sua-cesta/assets/produtos/barrinha-cacau-show.webp",
    destaque: true,
    observacaoPreco: "O sabor é escolhido conforme disponibilidade no atendimento.",
    whatsappMensagem: "Ola! Quero adicionar uma barrinha Cacau Show ao meu presente."
  },
  {
    id: 52,
    nome: "Buquê Rosas Rubi Perfumadas",
    categoria: "Flores",
    descricao: "Buquê de rosas artificiais vermelhas de ótima qualidade, com embalagem marsala, acabamento dourado e flores perfumadas com fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-rosas-rubi-perfumadas.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Rosas Rubi Perfumadas e quero escolher adicionais."
  },
  {
    id: 53,
    nome: "Buquê Girassóis Marsala Perfumado",
    categoria: "Flores",
    descricao: "Buquê de girassóis artificiais de ótima qualidade, com embalagem marsala, laço vermelho e flores perfumadas com fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-girassois-marsala-perfumado.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Girassois Marsala Perfumado e quero escolher adicionais."
  },
  {
    id: 54,
    nome: "Buquê Rosas Clássico Branco e Dourado",
    categoria: "Flores",
    descricao: "Buquê de rosas artificiais vermelhas de ótima qualidade, com embalagem branca, bordas douradas, laço vermelho e fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-rosas-classico-branco-dourado.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Rosas Classico Branco e Dourado e quero escolher adicionais."
  },
  {
    id: 55,
    nome: "Buquê Jardim Azul Perfumado",
    categoria: "Flores",
    descricao: "Buquê de flores artificiais de ótima qualidade em tons azul, branco e vinho, com acabamento dourado, cartão e perfumação com fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-jardim-azul-perfumado.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo, a mensagem do cartão e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Jardim Azul Perfumado e quero escolher adicionais."
  },
  {
    id: 56,
    nome: "Buquê Rosas Cherry Perfumadas",
    categoria: "Flores",
    descricao: "Buquê de rosas e flores artificiais de ótima qualidade em tons de rosa, com detalhe Cherry, acabamento dourado e perfumação com fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-rosas-cherry-perfumado.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo, o detalhe Cherry e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Rosas Cherry Perfumadas e quero escolher adicionais."
  },
  {
    id: 57,
    nome: "Buquê Girassóis Noir Perfumado",
    categoria: "Flores",
    descricao: "Buquê de girassóis artificiais de ótima qualidade, com embalagem preta, acabamento dourado, laço vermelho e fragrância de grife.",
    preco: 95.00,
    imagem: "assets/optimized/products/buque-girassois-noir-perfumado.jpg",
    destaque: false,
    observacaoPreco: "A partir de R$ 95,00. O valor final pode variar para R$ 110,00, R$ 120,00 ou mais, conforme o modelo e os adicionais escolhidos.",
    exibirAdicionaisNaCategoria: true,
    adicionaisOpcionais: adicionaisBuques,
    whatsappMensagem: "Ola! Tenho interesse no Buque Girassois Noir Perfumado e quero escolher adicionais."
  },
  {
    id: 58,
    nome: "Mini bolo de chocolate com morangos",
    categoria: "Adicionais",
    descricao: "Mini bolo confeitado de chocolate com morangos para aniversário, cesta personalizada ou surpresa especial.",
    preco: 80.00,
    imagem: "monte-sua-cesta/assets/produtos/bolo-chocolate-morango-aniversario.webp",
    destaque: false,
    observacaoPreco: "Valor estimado. O tamanho, o sabor, a decoração e a disponibilidade são confirmados no WhatsApp.",
    whatsappMensagem: "Ola! Quero consultar o mini bolo de chocolate com morangos para um aniversario."
  },
  {
    id: 59,
    nome: "Bolo confeitado feminino - 2 kg",
    categoria: "Adicionais",
    descricao: "Bolo confeitado feminino de 2 kg para aniversário, composição premium ou surpresa personalizada.",
    preco: 210.00,
    imagem: "monte-sua-cesta/assets/produtos/bolo-confeitado-feminino.webp",
    destaque: false,
    observacaoPreco: "Valor para bolo de 2 kg. O tema, as cores, o sabor e a disponibilidade são confirmados no WhatsApp.",
    whatsappMensagem: "Ola! Quero consultar o bolo confeitado feminino de 2 kg para um aniversario."
  }
];

// Mantem a personalizacao coerente em todas as vitrines. Cestas de cafe usam
// a lista combinada; demais cestas, kits e mimos usam os adicionais gerais.
produtosLocais.forEach((produto) => {
  const categoria = String(produto.categoria || "").toLowerCase();
  const nome = String(produto.nome || "").toLowerCase();

  if (categoria === "cestas" && nome.includes("cafe")) {
    produto.adicionaisOpcionais = adicionaisCestasCafe;
  } else if (["cestas", "kits", "mimos"].includes(categoria)) {
    produto.adicionaisOpcionais = adicionaisCestas;
  }
});
