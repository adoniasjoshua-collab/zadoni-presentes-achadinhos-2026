# Relatório UX/CRO pós-implementação — 19/09/2026

Implementação local concluída. Nenhum commit, push, merge ou publicação. Alterações preexistentes preservadas.

## Alterações implementadas

- Home: quatro categorias prioritárias, oito em details nativo com links estáticos; Achadinhos após prova local.
- Catálogo: 40 presentes antes de 14 adicionais; preservados os 54 cards HTML e seus links originais. Filtros de categoria, preço inicial e busca literal; estado vazio, limpar e navegação por fragmento. Nenhuma classificação comercial inventada.
- Aniversário: 11 cestas antes dos quatro bolos; atalho contextual para cestas, destinos e rótulos antigos preservados.
- Café: 12 modelos com seleção progressiva. Depois de abrir o modelo, escolher uma faixa revela somente seu link de WhatsApp. Sem JS, details nativo conserva os três links originais. Preços, composição e URLs preservados.
- Floricultura, cestas, buquês, presentes, românticos e rosas: vitrine comercial antecipada, explicações e referências mantidas abaixo.
- Cards: uma coluna mobile, duas tablet e três desktop; imagens inteiras com contain, proporção reservada, detalhes/adicionais secundários, fontes e controles legíveis. Corrigido selo branco sobre branco na galeria de aniversário.
- Montador: foco conduzido à próxima etapa e respeito a movimento reduzido; saída estática para WhatsApp quando scripts não carregam.
- Gerador compartilha transformação idempotente de apresentação. Testado em pasta isolada; arquivos da loja e sitemap não regenerados. Versões dos apps atualizadas para evitar cache incompatível.

## Comparativo de distância até a oferta — 390 px

Coordenadas de cards não equivalem a conversão. Na página de aniversário o primeiro card anterior era bolo; agora é cesta. Café deixa de ter saída de faixa aberta por padrão; deve-se abrir o modelo e escolher a faixa.

| Página | Primeiro card antes (px) | Depois (px) | WA não recolhidos antes | Depois |
|---|---:|---:|---:|---:|
| index.html | 0 | 0 | 6 | 6 |
| presentes-canaa.html | 2451 | 987 | 58 | 58 |
| floricultura-canaa-dos-carajas/index.html | 904 | 655 | 11 | 11 |
| cestas-de-presente-canaa/index.html | 863 | 588 | 16 | 16 |
| cesta-de-aniversario-canaa/index.html | 1014 | 757 | 19 | 19 |
| cesta-cafe-da-manha-canaa/index.html | 959 | 781 | 40 | 4 |
| buques-canaa-dos-carajas/index.html | 863 | 560 | 20 | 20 |
| presentes-canaa-dos-carajas/index.html | 766 | 588 | 14 | 14 |
| presentes-romanticos-canaa/index.html | 838 | 588 | 16 | 16 |
| rosas-perfumadas-canaa/index.html | 766 | 588 | 13 | 13 |
| monte-sua-cesta/index.html | 0 | 0 | 0 | 1 |

## Proteção SEO

`seo-comparison-ux-cro-20260919.json`: 19 páginas, zero violações. Comparação exata de title, H1, metadados, canonical, schemas, breadcrumbs, hreflang, links originais, atributos de imagem, dados comerciais, sitemap, robots e redirects. Primeiro parágrafo e blocos completos de texto preservados. Ordem de seções e rótulos novos são permitidos; uma única adição de link é explicitamente validada: fallback do montador.

O validador histórico comparava ordem absoluta de todos os elementos e inicialmente reportou 1.291 diferenças de apresentação. `validate-seo-baseline.mjs` agora usa a baseline desta tarefa e o contrato semântico; `--historical` mantém a comparação histórica disponível. Baselines antigas e aprovações não foram sobrescritas. Scripts e analytics existentes mantidos; somente versões de cache dos apps locais são normalizadas no teste.

## Imagens

Inventário em `inventario-imagens-ux-cro.md` e `.json`: 574 arquivos locais, incluindo pastas de originais/backups, 171 usos HTML. Nenhum arquivo ausente, pequeno abaixo do limiar de 360 px, acima de 200 KB ou sem dimensões entre esses usos. Verificação adicional no navegador carrega todas as imagens DOM em 390 px, inclusive lazy e montador.

Nenhuma foto substituída, nenhuma fonte externa e nenhum derivado redundante gerado. Existiam WebP e variantes responsivas. CSS deixa o produto inteiro visível. A primeira foto de café (`cesta-cafe-da-manha-modelo-real-01.jpeg`) contém faixas pretas no próprio arquivo; precisa de original enquadrado melhor para eliminar essas faixas sem inventar conteúdo. Nitidez, correspondência comercial e demais enquadramentos devem ser aprovados visualmente. Resolução suficiente não comprova qualidade.

## Testes executados

- `node scripts/check-ux-cro-browser.mjs after ux-cro-delivery-20260919`: 66 cenários, resultados e capturas por largura em `ui-ux-cro-delivery-20260919/`.
- Testes funcionais: menu por Tab/Escape e retorno de foco; modais e adicionais; URL alterada com seleção e restaurada ao remover; filtros vazios/preço/limpar; preservação dos 54 nós; três faixas; foco do montador; eventos WhatsApp; imagens lazy; fallback sem JS nas 11 páginas em 390 px. Sem envio de mensagens.
- `node scripts/validate-seo-baseline.mjs` e `python scripts/validate-ux-cro.py`: contrato SEO atual.
- Todos os `scripts/validate-*.mjs`: resultados em `ux-cro-existing-validators.json`.
- `python scripts/test_seo_baseline.py`: seis testes do detector de regressão.
- Sintaxe Node dos JS alterados e `git diff --check`.
- Build: gerador executado somente em `.tmp/ux-cro-build-*`, 11 páginas geradas, zero diferença de title/metadata/canonical/schema; ordem de aniversário confirmada. Resultado em `ux-cro-build-result.json`.

| Viewport | Páginas | Falhas finais |
|---|---:|---:|
| 360 × 900 | 11 | 0 |
| 390 × 900 | 11 | 0 |
| 412 × 900 | 11 | 0 |
| 768 × 900 | 11 | 0 |
| 1024 × 900 | 11 | 0 |
| 1366 × 900 | 11 | 0 |

Métricas LCP/CLS de laboratório estão nos JSON antes/depois; são medições locais sem throttling, observadas perto do carregamento, não Core Web Vitals de campo nem garantia de performance. Não há Lighthouse instalado; o equivalente utilizado é Chromium/CDP com PerformanceObserver, inspeção visual e testes geométricos. Não foram testados Safari/iOS real, rede móvel real ou integrações de atendimento em produção.



Comparação local (66 cenários): LCP mediano 110 → 114 ms; maior CLS observado 0.016 → 0.033. Diferenças pequenas neste ambiente; validar em rede e dispositivos reais.

## Eventos e mensuração

Mantidos `click_whatsapp`, `select_category` e conversão Google Ads. `view_product` passa a observar impressão real de 25% do card, uma vez por card/carregamento nas páginas revisadas. Adicionados `view_product_list` (quando a lista entra no viewport, uma vez por lista), `select_product`, `open_product_details`, `open_personalization`, `apply_filter`, `select_price_tier`, `click_whatsapp_product` e `click_whatsapp_generic`.

Camada existente `dataLayer`, sem nova plataforma ou ID. Eventos novos não enviam telefone, mensagem, campos pessoais ou busca livre. Params incluem página/tipo, ID/nome/categoria, faixa, posição e seção conforme aplicável. `click_whatsapp` mantém payload legado; o evento segmentado o complementa. Não somar os dois como duas conversões. `select_category` é equivalente legado de filtro; não somar a `apply_filter` como ações separadas.

Google Ads configurado no repositório não demonstra coleta de sessões GA4 nem ingestão automática de objetos dataLayer. Validar conexão autorizada da camada ao analytics e DebugView/Tag Assistant antes de usar os eventos em relatórios. Não presumir que push no dataLayer já cria relatório GA4.

KPI: sessões com pelo menos um clique WhatsApp ÷ sessões da página × 100. Deduplicar por sessão e página na ferramenta de analytics; contagem bruta de eventos não é clique único. Segmentar mobile/desktop, entrada, produto, filtro e detalhes. Para conversão por produto, conectar `view_product` a `click_whatsapp_product` pelo ID na mesma sessão; `view_product_list` sozinho não comprova que cada produto foi visto.

Comparar janelas equivalentes e registrar campanhas, preços e sazonalidade: dia 7, validar coleta/duplicação; dia 14, avaliar CTR por página/dispositivo e filtros; dia 21, examinar detalhes/faixas e qualidade das conversas; dia 28, comparar conversão para pedidos, mantendo tráfego orgânico, impressões, CTR SERP e posição como guardrails. Não atribuir causalidade a pequenas amostras nem prometer aumento de vendas.

## Pendências e validação antes da publicação

- P0: validar presencialmente mensagens, nomes, faixas e adicionais no WhatsApp sem enviar pedido de teste; conferir em Android/iPhone real o fluxo café e o montador. Confirmar ingestão de analytics antes de medir conversão. Não há P0 técnico conhecido nos testes executados.
- P1: obter original melhor da primeira imagem de café; revisão humana das fotos e nitidez. Validar contraste integral com leitor de tela, Safari e conexões lentas.
- P2: taxonomia de ocasião/destinatário depende de dados comerciais; revisão de snippets ou encurtamento de mensagens depende de experimento SEO separado. Ver `recomendacoes-seo-futuras.md`.

Revisar `ux-cro-code.diff`, os arquivos listados abaixo, Home, catálogo, aniversário, café e floricultura nas capturas. Conferir navegação com voltar, filtros combinados, personalização opcional e preço final informado pela loja. Após aprovação humana, publicar arquivos estáticos modificados junto com CSS/JS novos pelo processo já existente; não é necessário regenerar sitemap. Limpar cache aplicável e repetir smoke das URLs públicas, canonical/robots/schema e analytics. Esta tarefa não executou publicação.

## Arquivos alterados

Lista de arquivos rastreados obtida do Git, seguida dos novos componentes/ferramentas. Arquivos não rastreados preexistentes não integram o diff desta tarefa.

- `assets/js/app.js`
- `buques-canaa-dos-carajas/index.html`
- `cesta-cafe-da-manha-canaa/index.html`
- `cesta-de-aniversario-canaa/index.html`
- `cestas-de-presente-canaa/index.html`
- `floricultura-canaa-dos-carajas/index.html`
- `index.html`
- `monte-sua-cesta/index.html`
- `monte-sua-cesta/js/app.js`
- `presentes-canaa-dos-carajas/index.html`
- `presentes-canaa.html`
- `presentes-romanticos-canaa/index.html`
- `rosas-perfumadas-canaa/index.html`
- `scripts/generate-seo-pages.mjs`
- `scripts/validate-cafe-gallery-budget-tiers.mjs`
- `scripts/validate-seo-baseline.mjs`

Novos: `assets/css/ux-cro.css`, `assets/js/ux-cro.js`, `scripts/apply-ux-cro-layout.mjs`, `scripts/check-ux-cro-browser.mjs`, `scripts/validate-ux-cro.py`, `scripts/inventory-ux-cro-images.py`, `scripts/report-ux-cro.py` e documentos/evidências UX/CRO em `docs/`.
