# Auditoria UX/CRO pré-implementação — 19/09/2026

Documento solicitado lido integralmente. Auditoria realizada antes da edição de produção; esta versão consolida em UTF-8 as evidências salvas naquela fase. Os números do Search Console vieram do documento do usuário e não foram verificados na conta.

## Segurança, stack e escopo

Nenhum AGENTS.md encontrado na árvore ou ancestrais consultados. README, DESIGN-SYSTEM, fluxo do montador e relatório da vitrine lidos. Repositório estático HTML/CSS/JavaScript dentro de `zadoni-catalogo`; dados em `assets/data/produtos.js`, gerador `scripts/generate-seo-pages.mjs`, CSS compartilhado `style.css`/`storefront.css`, app e Google Ads compartilhados. Montador tem módulos próprios. Publicação documentada por GitHub/Hostinger; não executada. Sem dependências instaladas ou atualizadas.

Git interno inicialmente sem arquivos rastreados modificados. Foram preservados os diretórios `docs/ui-perfumaria-live-20260915/`, `docs/ui-perfumaria-review-20260915/`, `docs/ui-storefront-live-published-20260911/` e os validadores locais de integridade SEO não rastreados. Arquivos externos ao repositório interno também preservados. Baseline exata de 19 páginas salva antes da implementação.

## Medições iniciais em 390 × 900 px

Coordenadas desde o topo, em CSS px. WhatsApp visível significa não recolhido no documento inteiro; não significa simultaneamente dentro do viewport. A contagem acima da dobra está no JSON. Home tem caminhos de categoria; montador usa componentes próprios, fora do seletor de cards da tabela.

| Página | Cards | Primeiro card y | Primeiro CTA de card y | WA não recolhidos | Ordem inicial dos blocos |
|---|---:|---:|---:|---:|---|
| index.html | 0 | 0 | 0 | 6 | 🎁 O Que Você Procura? → Entregas reais em Canaã dos Carajás → Quer Enviar um Presente Especial? → Zadoni Achadinhos: ideias para escolher presentes → Conheça a perfumaria Zadoni |
| presentes-canaa.html | 54 | 2451 | 3027 | 58 | Perfumes de bolso para presente em Canaã → Loja de presentes perto de você em Canaã → Categorias de presentes → Escolha por categoria → Entrega e atendimento em Canaã dos Carajás → Entregas reais em Canaã dos Carajás → Perguntas frequentes |
| floricultura-canaa-dos-carajas/index.html | 7 | 904 | 1316 | 11 | Flores naturais e arranjos florais para presente → Trabalhos florais e arranjos reais da Zadoni → Flores naturais, jarros e arranjos disponíveis → Perguntas frequentes → Atendimento local para montar sua surpresa |
| cestas-de-presente-canaa/index.html | 12 | 863 | 1338 | 16 | Cestas montadas para diferentes ocasiões → Cestas reais para escolher como referência → Cestas locais para pedir pelo WhatsApp → Perguntas frequentes → Atendimento local para montar sua surpresa |
| cesta-de-aniversario-canaa/index.html | 15 | 1014 | 1592 | 19 | Como escolher uma cesta para celebrar o aniversário → Bolos confeitados para aniversário → Modelos de cesta de aniversário para escolher → Perguntas frequentes → Atendimento local para montar sua surpresa |
| cesta-cafe-da-manha-canaa/index.html | 12 | 959 | 1431 | 40 | Como funciona o pedido da cesta de café → Escolha um modelo de inspiração → Perguntas frequentes → Atendimento local para montar sua surpresa |
| buques-canaa-dos-carajas/index.html | 16 | 863 | 1338 | 20 | Buquês de rosas naturais, artificiais e com chocolate → Modelos reais de buquês preparados pela Zadoni → Buquês e flores disponíveis → Perguntas frequentes → Atendimento local para montar sua surpresa |
| presentes-canaa-dos-carajas/index.html | 9 | 766 | 1366 | 14 | Opções locais para escolher e enviar um presente → Produtos locais em destaque → Entregas reais em Canaã dos Carajás → Perguntas frequentes → Atendimento local para montar sua surpresa |
| presentes-romanticos-canaa/index.html | 12 | 838 | 1249 | 16 | Surpresas para declarar carinho → Referências reais para uma surpresa romântica → Sugestões românticas da Zadoni → Perguntas frequentes → Atendimento local para montar sua surpresa |
| rosas-perfumadas-canaa/index.html | 9 | 766 | 1366 | 13 | Combinações delicadas para presentes marcantes → Rosas, flores e perfumes de bolso → Perguntas frequentes → Atendimento local para montar sua surpresa → Conheça a perfumaria Zadoni |
| monte-sua-cesta/index.html | 0 | 0 | 0 | 0 | Escolha o estilo. A Zadoni monta cada detalhe com você. → Qual modelo combina com o presente? → Escolha a faixa da montagem → Conte o essencial para a Zadoni |

## Matriz e plano refinado

| Página | Gargalo | Evidência | Severidade | Impacto esperado | Risco SEO | Ação |
|---|---|---|---|---|---|---|
| Home | 12 caminhos equivalentes | HTML e captura | P0 | Facilitar escolha inicial | Baixo | DESTACAR quatro; RECOLHER oito; manter links no HTML |
| Catálogo | 54 cards; 14 adicionais interrompem últimos buquês | Dados, HTML e DOM | P0 | Priorizar presentes | Baixo | REPOSICIONAR grupos; SIMPLIFICAR detalhes; preço e busca literal |
| Aniversário | Quatro bolos antes de 11 cestas | Ordem HTML e screenshot | P0 | Alinhar primeira oferta à intenção | Baixo | REPOSICIONAR seções inteiras |
| Café | 12 modelos com três saídas por modelo | 36 links de faixa | P1 | Reduzir decisões simultâneas | Baixo | RECOLHER escolha, depois faixa e um link ativo |
| Cestas | Referências antes de ofertas; ações competem | Cards, galeria e app.js | P1 | Acelerar escolha | Baixo | REPOSICIONAR ofertas; personalização secundária |
| Buquês | Referências e adicionais competem | Cards e app.js | P1 | Destacar compra direta | Baixo | REPOSICIONAR ofertas; detalhes opcionais |
| Floricultura | Explicação e referências antes das ofertas | HTML | P1 | Mostrar flores e jarros cedo | Baixo | REPOSICIONAR produtos sem reescrever SEO |
| Presentes local | Explicação antes da vitrine | HTML | P2 | Continuidade pós-clique | Baixo | REPOSICIONAR vitrine |
| Românticos | Referências antes da seleção comercial | HTML | P2 | Clareza na escolha | Baixo | REPOSICIONAR produtos |
| Rosas/perfumes | Explicação antes da vitrine | HTML | P2 | Mostrar oferta cedo | Baixo | REPOSICIONAR produtos |
| Monte sua cesta | Perda de foco após renderização; sem fallback de compra | app.js e HTML vazio | P2 | Resiliência e teclado | Baixo | CORRIGIR foco, movimento reduzido e saída estática |

## Hipóteses confirmadas e refinadas

- Confirmados: 12 categorias, 54 produtos, bolos antes de cestas, 36 CTAs de faixa, duas colunas estreitas no celular e `cover` cortando fotos.
- Parcialmente confirmada a competição com adicionais: componentes details/modal já existiam. MANTER esses componentes, reduzir seu peso visual.
- Achadinhos já tinha peso secundário; REPOSICIONAR seu acesso após prova local, mantendo texto e link.
- Filtros de categoria já existem. Não há taxonomia confiável de ocasião/destinatário: busca por palavras cadastradas e preço, sem inventar classificações.
- O app recriava cards estáticos ao carregar, mudando mensagens de WhatsApp. Preservar os nós originais na filtragem.
- Um clique já permite consulta direta. Café passa a modelo → faixa → WhatsApp; adicionais continuam opcionais. Montador exige modelo/faixa e oferece campos opcionais.
- Mensagens são contextuais, mas extensas. MANTER composição, parâmetros e destino; encurtamento fica para teste futuro autorizado.
- Fotos já têm derivados WebP, dimensões e lazy loading. Ajustar apresentação antes de gerar arquivos redundantes. Original melhor depende de inspeção visual, não só resolução.
- Há repetição de notas comerciais; RECOLHER mantendo texto integral, sem apagar avisos por hipótese.
- Contrastes principais existentes constam no DESIGN-SYSTEM. Não se declara conformidade WCAG integral. Testar foco, menu, modal e tamanho de toque.
- Riscos de carregamento: animação escalonada de 54 cards, reconstrução DOM e imagens cortadas. Medir LCP/CLS localmente sem confundir com dados reais de visitantes.

## Evidências e limites

Primeira execução Chromium restrita falhou em `Page.enable`; execução autorizada passou em 66 cenários: 11 páginas × 360/390/412/768/1024/1366 px, altura 900 px. Sem overflow, exceções JS ou imagem eager quebrada nesse smoke inicial. Tracking e WhatsApp bloqueados.

Capturas e medições originais: `ui-ux-cro-before-20260919-browser/`. Reconstrução somente para leitura da revisão registrada, com capturas das seis larguras e métricas laboratoriais: `ui-ux-cro-baseline-complete-20260919/`. O teste ampliado registra a falha preexistente do montador sem JS. Nenhuma mensagem enviada.
