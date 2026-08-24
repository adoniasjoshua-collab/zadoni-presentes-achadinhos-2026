(function (root) {
  "use strict";

  const data = {
    siteName: "Zadoni Achadinhos",
    siteUrl: "https://zadonipresentes.com.br",
    disclosure: "Este conteúdo pode incluir links de afiliados. Se você comprar por um desses links, a Zadoni poderá receber uma comissão, sem custo adicional obrigatório para você. A seleção editorial considera utilidade, ocasião e perfil de quem recebe; posições não são vendidas e preços, estoque, frete e condições devem ser conferidos na loja parceira.",
    hub: {
      title: "Zadoni Achadinhos: Ideias de Presentes para Todo o Brasil",
      metaTitle: "Zadoni Achadinhos | Ideias de Presentes para Todo o Brasil",
      description: "Guias nacionais da Zadoni com ideias de presentes por pessoa, ocasião, estilo e orçamento para ajudar você a escolher com mais segurança.",
      intro: "Guias editoriais para transformar uma dúvida ampla em uma escolha mais consciente, considerando a pessoa, a ocasião, o uso e o orçamento total.",
      faq: [
        {
          question: "Como os presentes dos guias são selecionados?",
          answer: "A curadoria considera utilidade, adequação ao perfil de quem recebe, contexto da ocasião, possibilidade de personalização e clareza das informações disponíveis."
        },
        {
          question: "Os preços e a disponibilidade são garantidos?",
          answer: "Não. Preços, estoque, frete, prazo e condições podem mudar e devem ser confirmados diretamente na loja parceira antes da compra."
        },
        {
          question: "A Zadoni pode receber comissão pelos links?",
          answer: "Alguns links podem ser de afiliados. Quando isso ocorrer, eles serão identificados e a Zadoni poderá receber uma comissão pela compra."
        }
      ]
    },
    guides: [
      {
        slug: "presentes-para-namorada",
        label: "Para namorada",
        metaTitle: "Presentes para Namorada: Guia de Escolha | Zadoni Achadinhos",
        description: "Ideias de presentes para namorada com critérios por estilo, momento do relacionamento, personalização e orçamento.",
        h1: "Presentes para Namorada: Como Escolher uma Ideia com Significado",
        intro: "Um bom presente para a namorada combina atenção aos detalhes, momento do relacionamento e algo que faça sentido na rotina ou na história do casal.",
        howToChoose: [
          "Comece pelo que ela demonstra gostar no dia a dia: experiências, autocuidado, decoração, tecnologia, leitura, moda ou lembranças afetivas. A observação costuma ser mais útil do que procurar um presente considerado universal.",
          "Depois, ajuste a escolha ao estágio do relacionamento e à ocasião. Um item muito íntimo pode ser inadequado no começo, enquanto uma lembrança genérica pode parecer distante em uma data importante."
        ],
        criteria: [
          "Relação com os interesses e a rotina dela",
          "Nível de intimidade adequado ao relacionamento",
          "Possibilidade de incluir uma mensagem pessoal",
          "Qualidade percebida além do tamanho do presente"
        ],
        recommendations: [
          {
            id: "experiencia-a-dois",
            title: "Uma experiência para aproveitar juntos",
            description: "Pode ser um passeio planejado, uma oficina, uma refeição especial ou uma atividade ligada a um interesse compartilhado.",
            fit: "Boa escolha para quem valoriza tempo de qualidade e memórias.",
            budget: "Adapte local, duração e complementos ao limite total disponível.",
            offers: []
          },
          {
            id: "kit-autocuidado",
            title: "Kit de autocuidado montado com intenção",
            description: "Em vez de reunir itens aleatórios, escolha uma rotina coerente, como banho relaxante, cuidados com cabelo ou uma noite de descanso.",
            fit: "Funciona melhor quando você conhece preferências, fragrâncias e possíveis sensibilidades.",
            budget: "Priorize poucos itens compatíveis entre si em vez de volume.",
            offers: []
          },
          {
            id: "presente-personalizado",
            title: "Presente personalizado com uma referência do casal",
            description: "Uma foto, data, frase curta ou lugar importante pode transformar um objeto simples em uma lembrança particular.",
            fit: "Indicado quando a personalização tem significado real e não expõe algo que ela prefira manter privado.",
            budget: "Reserve tempo para produção e revisão da personalização antes de comprar.",
            offers: []
          },
          {
            id: "item-hobby",
            title: "Algo útil para um hobby que ela já pratica",
            description: "Acessórios para leitura, atividade física, arte, música, jardinagem ou organização podem demonstrar atenção genuína.",
            fit: "Confirme compatibilidade, tamanho e nível de experiência para não comprar uma versão inadequada.",
            budget: "Compare durabilidade e utilidade, não apenas o menor preço anunciado.",
            offers: []
          }
        ],
        budgetTitle: "Como definir o orçamento sem deixar o presente impessoal",
        budgetCopy: "Defina primeiro o valor total, incluindo embalagem, personalização e eventual frete. Dentro desse limite, escolha o elemento principal e use uma carta ou gesto planejado para acrescentar significado sem depender de um item mais caro.",
        related: ["presentes-criativos", "presentes-de-aniversario"],
        faq: [
          {
            question: "Como escolher um presente para namorada sem saber exatamente o que ela quer?",
            answer: "Observe interesses recorrentes, necessidades mencionadas e experiências de que ela gosta. Quando houver dúvida sobre tamanho, cor ou fragrância, prefira opções com troca clara ou experiências flexíveis."
          },
          {
            question: "Presente útil pode ser romântico?",
            answer: "Sim. A intenção aparece na adequação ao perfil dela, na apresentação e na mensagem que acompanha o presente, não apenas no tipo de produto."
          },
          {
            question: "É melhor dar um item ou uma experiência?",
            answer: "Depende do perfil de quem recebe. Experiências favorecem tempo compartilhado; itens podem ser melhores quando atendem um interesse concreto ou guardam valor afetivo."
          }
        ]
      },
      {
        slug: "presentes-criativos",
        label: "Presentes criativos",
        metaTitle: "Presentes Criativos: Ideias e Critérios | Zadoni Achadinhos",
        description: "Guia de presentes criativos com ideias úteis, personalizáveis e adequadas a diferentes perfis e ocasiões.",
        h1: "Presentes Criativos: Ideias que Fogem do Óbvio com Utilidade",
        intro: "Criatividade não depende de um objeto extravagante. Uma boa escolha cria conexão ao combinar contexto, surpresa e utilidade para quem recebe.",
        howToChoose: [
          "Procure uma ligação clara entre a ideia e a pessoa. Um presente se torna criativo quando resolve algo de maneira interessante, recupera uma memória ou apresenta uma experiência compatível com os gostos de quem recebe.",
          "Evite novidades que só funcionam na foto. Antes de escolher, considere facilidade de uso, espaço necessário, manutenção, compatibilidade e se o item continuará relevante depois da ocasião."
        ],
        criteria: [
          "Originalidade com propósito",
          "Utilidade depois da primeira impressão",
          "Compatibilidade com hábitos e espaço disponível",
          "Personalização que não comprometa troca ou uso"
        ],
        recommendations: [
          {
            id: "mapa-memorias",
            title: "Mapa ou álbum de memórias construído por etapas",
            description: "Organize fotos, pequenos textos e lugares importantes em uma narrativa, deixando espaço para novos momentos.",
            fit: "Adequado para casais, amizades e familiares com histórias compartilhadas.",
            budget: "A qualidade da seleção e dos textos importa mais que a quantidade de páginas.",
            offers: []
          },
          {
            id: "kit-projeto",
            title: "Kit para começar um pequeno projeto",
            description: "Reúna os itens essenciais para fotografia, desenho, culinária, cultivo, escrita ou outra atividade que a pessoa queira experimentar.",
            fit: "Escolha uma introdução acessível, evitando equipamentos avançados sem necessidade.",
            budget: "Defina um núcleo funcional e deixe acessórios opcionais para depois.",
            offers: []
          },
          {
            id: "objeto-transformavel",
            title: "Objeto versátil para rotina ou ambiente",
            description: "Organizadores modulares, iluminação ajustável e acessórios multifuncionais podem surpreender sem perder utilidade.",
            fit: "Verifique medidas, alimentação elétrica e materiais antes de decidir.",
            budget: "Compare especificações e garantia, não apenas aparência.",
            offers: []
          },
          {
            id: "experiencia-tematica",
            title: "Experiência temática preparada em casa",
            description: "Uma sessão de cinema, degustação, noite de jogos ou jantar temático pode reunir convite, ambientação e atividade em uma mesma ideia.",
            fit: "Funciona quando o tema respeita preferências e restrições de todos os participantes.",
            budget: "Concentre o gasto nos elementos que realmente sustentam a experiência.",
            offers: []
          }
        ],
        budgetTitle: "Criatividade dentro de um orçamento realista",
        budgetCopy: "Separe o orçamento entre item principal, materiais complementares e entrega. Uma ideia simples, bem executada e adequada à pessoa tende a ser mais marcante do que vários objetos sem relação entre si.",
        related: ["presentes-para-namorada", "presentes-de-aniversario"],
        faq: [
          {
            question: "O que faz um presente ser realmente criativo?",
            answer: "É a combinação de adequação à pessoa, intenção e uma forma menos automática de apresentar ou usar a ideia. Ser diferente, por si só, não garante uma boa escolha."
          },
          {
            question: "Como evitar comprar um presente criativo que não será usado?",
            answer: "Verifique hábitos, espaço, compatibilidade e manutenção. Dê preferência a ideias que se encaixem em algo que a pessoa já faz ou deseja começar."
          },
          {
            question: "Personalização sempre melhora o presente?",
            answer: "Não. Ela funciona quando acrescenta significado. Também pode dificultar trocas, por isso dados como nome, data, tamanho e grafia devem ser revisados."
          }
        ]
      },
      {
        slug: "presentes-de-aniversario",
        label: "Presentes de aniversário",
        metaTitle: "Presentes de Aniversário: Guia por Perfil | Zadoni Achadinhos",
        description: "Ideias de presentes de aniversário organizadas por perfil, relação, utilidade e orçamento para escolher sem depender de listas genéricas.",
        h1: "Presentes de Aniversário: Um Guia para Escolher pelo Perfil",
        intro: "O aniversário dá contexto à escolha, mas é o perfil da pessoa que define se o presente será útil, afetivo, divertido ou memorável.",
        howToChoose: [
          "Considere a proximidade da relação, a fase de vida e o tipo de celebração. Presentes para um colega, um familiar e um parceiro podem ter limites e expectativas diferentes.",
          "Use pistas recentes: algo que a pessoa quer aprender, um item que precisa substituir, uma atividade que passou a praticar ou uma preferência que aparece com frequência."
        ],
        criteria: [
          "Adequação ao grau de proximidade",
          "Utilidade ou significado para a fase atual",
          "Facilidade de troca quando houver tamanho ou preferência",
          "Prazo seguro para compra e personalização"
        ],
        recommendations: [
          {
            id: "presente-de-uso-diario",
            title: "Uma melhoria para algo usado todos os dias",
            description: "Acessórios de trabalho, organização, leitura, cozinha ou bem-estar podem ter impacto recorrente quando resolvem uma necessidade real.",
            fit: "Observe primeiro o que a pessoa já usa e evite duplicar funções.",
            budget: "Considere resistência, garantia e custo de reposição de consumíveis.",
            offers: []
          },
          {
            id: "experiencia-flexivel",
            title: "Experiência com data ou formato flexível",
            description: "Ingressos, cursos curtos, passeios e refeições podem funcionar bem quando permitem combinar o melhor momento depois.",
            fit: "Confira validade, regras de agendamento e acessibilidade para quem receberá.",
            budget: "Inclua deslocamento e custos adicionais no cálculo total.",
            offers: []
          },
          {
            id: "presente-para-hobby",
            title: "Complemento para um interesse já conhecido",
            description: "Um livro específico, material de prática ou acessório compatível demonstra atenção sem exigir que a pessoa comece um hobby do zero.",
            fit: "Confirme modelo, edição, tamanho e nível técnico antes da compra.",
            budget: "Prefira um complemento confiável a um conjunto grande de qualidade incerta.",
            offers: []
          },
          {
            id: "lembranca-coletiva",
            title: "Lembrança construída com pessoas próximas",
            description: "Mensagens, fotos ou pequenos registros de várias pessoas podem formar um presente afetivo e adequado a aniversários marcantes.",
            fit: "Peça autorização antes de usar imagens sensíveis ou publicar o material.",
            budget: "Planejamento e curadoria podem substituir uma produção cara.",
            offers: []
          }
        ],
        budgetTitle: "Orçamento de aniversário sem comparação desconfortável",
        budgetCopy: "Escolha um teto compatível com sua relação e sua realidade financeira. Considere o custo final, incluindo embalagem, frete, deslocamento e personalização, sem tentar igualar o valor gasto por outras pessoas.",
        related: ["presentes-criativos", "presentes-para-namorada"],
        faq: [
          {
            question: "Como escolher presente de aniversário para quem já tem de tudo?",
            answer: "Priorize experiências, consumíveis bem escolhidos, melhorias de itens usados com frequência ou uma lembrança construída a partir de histórias compartilhadas."
          },
          {
            question: "Vale perguntar diretamente o que a pessoa quer?",
            answer: "Sim. Perguntar pode evitar desperdício. Para manter alguma surpresa, peça uma lista curta ou descubra categorias, tamanhos e preferências em vez de um item exato."
          },
          {
            question: "Como escolher quando não conheço bem a pessoa?",
            answer: "Prefira opções neutras, úteis e fáceis de trocar. Evite itens íntimos, fragrâncias marcantes e personalizações permanentes sem conhecer as preferências."
          }
        ]
      }
    ]
  };

  root.ACHADINHOS_DATA = Object.freeze(data);
})(typeof globalThis !== "undefined" ? globalThis : window);
