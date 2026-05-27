/**
 * Base de produtos - Zadoni
 * Dados ficticios organizados para edicao rapida.
 */

const produtosLocais = [
  {
    id: 1,
    nome: "Buque Romantico",
    categoria: "Flores",
    descricao: "Buque romantico com balao Te Amo, flores vermelhas e acabamento especial para surpreender.",
    preco: 189.00,
    imagem: "assets/img/cestas-femininas/buque-te-amo-romantico.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Buque Romantico. Pode me passar mais informacoes?"
  },
  {
    id: 2,
    nome: "Buque na xicara",
    categoria: "Flores",
    descricao: "Arranjo criativo com flores em xicara decorativa, pronto para presentear.",
    preco: 119.90,
    imagem: "assets/img/cestas-femininas/buque-na-xicara-premium.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre o Buque na xicara."
  },
  {
    id: 3,
    nome: "Kit romantico com chocolates",
    categoria: "Kits",
    descricao: "Kit com itens romanticos, chocolates selecionados e acabamento especial.",
    preco: 149.90,
    imagem: "assets/img/cestas-femininas/box-amor-perfeito.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Kit romantico com chocolates."
  },
  {
    id: 6,
    nome: "Cesta Masculina Vinho Bella Vista",
    categoria: "Cestas",
    descricao: "Cesta premium com vinho, taca, chocolates e apresentacao sofisticada.",
    preco: 239.90,
    imagem: "assets/img/cestas-masculinas/cesta-masculina-vinho-bella-vista.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Quero informacoes sobre a Cesta Masculina Vinho Bella Vista."
  },
  {
    id: 7,
    nome: "Cesta Masculina Azul Classica",
    categoria: "Cestas",
    descricao: "Cesta masculina com refrigerante, petiscos, caneca e acabamento em fita azul.",
    preco: 169.90,
    imagem: "assets/img/cestas-masculinas/cesta-masculina-azul-classica.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Azul Classica."
  },
  {
    id: 8,
    nome: "Cesta Masculina Gourmet Dourada",
    categoria: "Cestas",
    descricao: "Composicao elegante com bebida, chocolates e acabamento dourado para presentear.",
    preco: 219.90,
    imagem: "assets/img/cestas-masculinas/cesta-masculina-gourmet-dourada.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre a Cesta Masculina Gourmet Dourada."
  },
  {
    id: 9,
    nome: "Cesta Masculina Verde Artesanal",
    categoria: "Cestas",
    descricao: "Cesta artesanal com embalagem transparente, laco verde e selecao de mimos.",
    preco: 179.90,
    imagem: "assets/img/cestas-masculinas/cesta-masculina-verde-artesanal.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Verde Artesanal."
  },
  {
    id: 10,
    nome: "Cesta Feminina Delicada",
    categoria: "Cestas",
    descricao: "Cesta delicada para surpreender com carinho, beleza e acabamento especial.",
    preco: 189.90,
    imagem: "assets/img/cestas-femininas/cesta-feminina-delicada.webp",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Feminina Delicada."
  },
  {
    id: 11,
    nome: "Cesta Masculina Vinho e Petiscos",
    categoria: "Cestas",
    descricao: "Cesta masculina com vinho, castanhas, doces e acabamento moderno em preto.",
    preco: 249.90,
    imagem: "assets/img/cestas-masculinas/cesta-masculina-vinho-e-petiscos.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse na Cesta Masculina Vinho e Petiscos."
  },
  {
    id: 12,
    nome: "Box Amor Perfeito",
    categoria: "Kits",
    descricao: "Box romantico com composicao charmosa para datas especiais e declaracoes.",
    preco: 159.90,
    imagem: "assets/img/cestas-femininas/box-amor-perfeito.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Quero informacoes sobre o Box Amor Perfeito."
  },
  {
    id: 13,
    nome: "Box Girassol com Caixa",
    categoria: "Kits",
    descricao: "Presente alegre com girassol, caixa decorada e visual marcante.",
    preco: 169.00,
    imagem: "assets/img/cestas-femininas/box-girassol-com-caixa.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre o Box Girassol com Caixa."
  },
  {
    id: 15,
    nome: "Buque Declaracao de Amor",
    categoria: "Flores",
    descricao: "Buque romantico com balao Te Amo, flores vermelhas e acabamento especial para declarar amor.",
    preco: 149.00,
    imagem: "assets/img/cestas-femininas/buque-te-amo-mae.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Buque Declaracao de Amor."
  },
  {
    id: 16,
    nome: "Buque Te Amo Romantico",
    categoria: "Flores",
    descricao: "Buque romantico para surpreender com uma mensagem direta e especial.",
    preco: 189.00,
    imagem: "assets/img/cestas-femininas/buque-te-amo-romantico.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Buque Te Amo Romantico."
  },
  {
    id: 17,
    nome: "Cesta Cafe da Manha Especial",
    categoria: "Cestas",
    descricao: "Cesta de cafe da manha para presentear com praticidade e carinho.",
    preco: 199.90,
    imagem: "assets/img/cestas-femininas/cesta-cafe-da-manha-especial.webp",
    destaque: true,
    whatsappMensagem: "Ola! Gostaria de saber mais sobre a Cesta Cafe da Manha Especial."
  },
  {
    id: 18,
    nome: "Kit Vela Presente Especial",
    categoria: "Kits",
    descricao: "Kit com vela e composicao elegante para um presente sensorial e delicado.",
    preco: 129.90,
    imagem: "assets/img/cestas-femininas/kit-vela-presente-especial.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Kit Vela Presente Especial."
  },
  {
    id: 19,
    nome: "Mimo Carinho Especial",
    categoria: "Mimos",
    descricao: "Opcao afetiva e acessivel para surpreender com carinho sem esperar uma data especial.",
    preco: 59.90,
    imagem: "assets/img/mimos-rapidos/mimo-carinho-especial.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Mimo Carinho Especial."
  },
  {
    id: 20,
    nome: "Mimo Coca-Cola Criativo",
    categoria: "Mimos",
    descricao: "Mimo jovem e divertido com bebida, doces e acabamento pronto para presentear.",
    preco: 69.90,
    imagem: "assets/img/mimos-rapidos/mimo-coca-cola-criativo.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Mimo Coca-Cola Criativo."
  },
  {
    id: 21,
    nome: "Mimo Ferrero Elegante",
    categoria: "Mimos",
    descricao: "Mimo com toque premium para quem quer presentear com chocolate e visual sofisticado.",
    preco: 79.90,
    imagem: "assets/img/mimos-rapidos/mimo-ferrero-elegante.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse no Mimo Ferrero Elegante."
  },
  {
    id: 22,
    nome: "Cone Ferrero Presente Charmoso",
    categoria: "Mimos",
    descricao: "Cone presenteavel com proposta elegante, ideal para lembrancas rapidas e marcantes.",
    preco: 69.90,
    imagem: "assets/img/mimos-rapidos/cone-ferrero-presente-charmoso.jpg",
    destaque: false,
    whatsappMensagem: "Ola! Quero informacoes sobre o Cone Ferrero Presente Charmoso."
  },
  {
    id: 23,
    nome: "Cestinha Virginia Mimo Delicado",
    categoria: "Cestas",
    descricao: "Cestinha delicada com composicao pronta para aniversarios, agradecimentos e surpresas.",
    preco: 89.90,
    imagem: "assets/img/mimos-rapidos/cestinha-virginia-mimo-delicado.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Tenho interesse na Cestinha Virginia Mimo Delicado."
  },
  {
    id: 24,
    nome: "Kit Ferrari Presente Premium",
    categoria: "Kits",
    descricao: "Kit masculino com presenca forte, ideal para presente sofisticado e memoravel.",
    preco: 159.90,
    imagem: "assets/img/mimos-rapidos/kit-ferrari-presente-premium.jpg",
    destaque: true,
    whatsappMensagem: "Ola! Quero informacoes sobre o Kit Ferrari Presente Premium."
  }
];

const achadinhos = [
  {
    id: 100,
    nome: "Perfumes Hinode",
    categoria: "Perfumes",
    descricao: "Fragrancias Hinode originais, boas para uso pessoal e presentes especiais.",
    preco: 0,
    imagem: "assets/img/achadinhos/achadinhos-hinode-perfumes.jpg",
    linkAfiliado: "https://gestaolinkbr.lovable.app/r/2x06fj"
  },
  {
    id: 99,
    nome: "Utilidades Mercado Livre",
    categoria: "Utilidades",
    descricao: "Selecao de achadinhos uteis, presentes e ofertas praticas para o dia a dia.",
    preco: 0,
    imagem: "assets/img/achadinhos/achadinhos-mercado-livre-ofertas.jpg",
    linkAfiliado: "https://meli.la/1e7FrVH"
  },
  {
    id: 101,
    nome: "Ecobikes Mercado Livre",
    categoria: "Ecobikes",
    descricao: "Opcoes de mobilidade eletrica e bicicletas para quem busca praticidade.",
    preco: 0,
    imagem: "assets/img/achadinhos/ecobikes-mercado-livre-mobilidade-eletrica.jpg",
    linkAfiliado: "https://www.mercadolivre.com.br/bicicleta-eletrica-ecobikes-sport-500w-48v-aro-14-scooter/p/MLB66143453?pdp_filters=item_id%3AMLB6525972478&matt_tool=38524122#origin=share&sid=share&wid=MLB6525972478&action=copy"
  }
];
