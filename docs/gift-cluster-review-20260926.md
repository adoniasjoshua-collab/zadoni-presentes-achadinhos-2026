# Cluster de presentes — revisão de 26/09/2026

**Atualização posterior:** o acesso pela Home foi implementado por solicitação do usuário. Consulte [a revisão do fluxo da Home](home-cluster-review-20260926.md). As observações abaixo sobre ausência de entrada descrevem a primeira entrega e foram resolvidas nessa atualização.

Implementadas três páginas estáticas para Natal, orientação de escolha e mensagens de cartão. O guia e a página de mensagens incluem o formulário “Encontre o Presente Certo 💝”, com revisão do resumo antes de abrir o WhatsApp. Nenhum commit, push ou deploy realizado.

## Arquivos da implementação

Criados:

- `presentes-de-natal-canaa-dos-carajas/index.html`
- `guias-de-presentes/index.html`
- `mensagens-para-acompanhar-presentes/index.html`
- `assets/css/gift-guides.css` — estilos exclusivos do cluster, usando os tokens e o layout visual existente.
- `assets/js/gift-guides.js` — formulário, seleção de mensagem, validação e resumo.
- `scripts/validate-gift-cluster.mjs` — metadados, links, arquivos, fragmentos, schemas, FAQ, sitemap e integrações.
- `scripts/check-gift-cluster-browser.mjs` — verificação real no Chrome local via CDP, sem dependências npm adicionais; aceita um rótulo de relatório como argumento.

Alterados:

- `sitemap.xml` — exatamente três novas entradas canônicas, após resposta HTTP 200 no servidor local.
- `scripts/validate-ux-cro.py` — permite somente as três novas páginas e suas entradas exatas no sitemap. Continua comparando todas as páginas antigas e os arquivos protegidos com o snapshot histórico. Trata também ausência de página protegida sem interromper o relatório.

Evidências:

- `docs/gift-cluster-validation-20260926.json`: resultado dos 20 validadores.
- `docs/gift-cluster-preservation-20260926.json`: comparação de hashes das páginas protegidas e relação dos arquivos existentes alterados.
- `docs/ui-gift-cluster-verified-20260926/`: 15 capturas de tela e `results.json` da revisão final.
- `docs/seo-comparison-release-20260923.json`: relatório regenerado pelo validador existente; 19 páginas anteriores aprovadas.
- Este documento. Diretórios `ui-gift-cluster-review-20260926` e `ui-gift-cluster-final-20260926` contêm evidências intermediárias; a pasta `verified` é a referência final.

Arquivos de trabalho em `.tmp/` não são necessários para publicar as páginas.

## Metadados e intenções

| URL | Title | H1 |
| --- | --- | --- |
| `/presentes-de-natal-canaa-dos-carajas/` | Presentes de Natal em Canaã dos Carajás \| Zadoni | Presentes de Natal em Canaã dos Carajás |
| `/guias-de-presentes/` | Guia para Escolher o Presente Certo \| Zadoni Presentes | Guia para Escolher o Presente Certo |
| `/mensagens-para-acompanhar-presentes/` | Mensagens para Cartão de Presente \| Zadoni Presentes | Mensagens para Cartão de Presente |

Meta descriptions:

- Natal: “Ideias de presentes de Natal em Canaã dos Carajás: cestas, flores, chocolates e personalizados. Consulte opções e reservas com a Zadoni pelo WhatsApp.”
- Guia: “Escolha um presente por relacionamento, ocasião, estilo e investimento. Prepare seu resumo e peça sugestões à Zadoni em Canaã dos Carajás.”
- Mensagens: “Mensagens curtas para cartões de aniversário, Natal, amor e agradecimento. Escolha sua frase e converse com a Zadoni sobre o presente.”

Cada canonical é absoluto, no domínio `https://zadonipresentes.com.br`, com o respectivo caminho acima e barra final. Open Graph e Twitter Cards próprios. Um H1 por página. Breadcrumb visível e schemas `WebPage`, `BreadcrumbList` e `FAQPage`, com perguntas e respostas presentes no HTML. Nenhum novo schema `Product`.

## Mapa de links

- Natal → cestas de presente, café da manhã, presentes românticos, rosas perfumadas, monte sua cesta, guia e mensagens.
- Guia → catálogo `/presentes-canaa.html`, guia existente de namorada, presentes românticos, cesta de aniversário, buquês, cestas de presente, Natal e mensagens.
- Mensagens → guia, Natal, presentes românticos, cesta de aniversário e catálogo local.
- Navegação do cluster e links de continuação conectam as três páginas em ambas as direções.
- O guia de namorada está identificado como referência nacional com lojas parceiras. O atendimento local continua encaminhado à Zadoni.

Não foram adicionados links nas páginas antigas: elas foram preservadas integralmente, conforme o escopo. Um futuro ponto de entrada em menu ou página existente deve ser decidido separadamente na revisão humana. O sitemap e os links entre as páginas novas já estão preparados; não há afirmação de indexação ou posicionamento.

## Formulário e WhatsApp

As duas versões contêm destinatário, ocasião, estilo, faixa de investimento, mensagem, recebimento e observações opcionais. A página de mensagens permite escolher qualquer uma das sete frases diretamente nos cartões; a seleção preenche a frase, a ocasião e o destinatário quando aplicável.

O cliente pode escrever uma mensagem própria. As faixas de investimento são preferências, sem oferta ou garantia de produto. O botão “Preparar meu resumo” valida os campos e mostra “Resumo para a Zadoni”; “Enviar resumo pelo WhatsApp” abre o endereço existente com o texto codificado. Alterar uma resposta invalida o resumo anterior. Textos do usuário são exibidos com `textContent`, sem interpretação de HTML.

Número e padrão de link reutilizados do projeto: `5594992993138`, parâmetros UTM e `data-track="whatsapp"`. Os scripts existentes `app.js` e `google-ads-whatsapp.js` e os snippets Google/Meta são reutilizados sem alteração. Não há evento novo que envie as respostas do formulário à análise de tráfego. Não há armazenamento persistente das respostas.

O conteúdo, a navegação, as perguntas frequentes e os links diretos de WhatsApp estão no HTML. O formulário aparece somente quando seu script termina de inicializar. Sem JavaScript ou se esse script falhar, permanece o atendimento direto pelo WhatsApp.

## Validações executadas

- **20/20** scripts `validate-*.mjs` passaram, incluindo o novo validador.
- **6/6** testes de `python -m unittest discover -s scripts -p test_seo_baseline.py` passaram.
- **15/15** combinações de página e largura passaram: 360, 390, 412, 768 e 1440 px.
- **2/2** fluxos de resumo passaram: campos obrigatórios, mensagem personalizada, acentos, emojis, `&`, `+`, `#`, `?`, observações com marcação HTML, alteração de respostas e recuperação após erro.
- **7/7** sugestões de cartão selecionáveis e com foco devolvido ao formulário.
- Teclado: skip link acessível, foco visível e foco no título do resumo após validação.
- JavaScript desabilitado nas três páginas: conteúdo, navegação e CTA funcionais. Falha isolada do script do formulário também testada.
- Clique de envio simulado com navegação cancelada: um evento de conversão Google Ads; conteúdo privado das observações não apareceu nesse evento.
- Requisições de WhatsApp, Google e Meta bloqueadas no navegador de teste. Nenhuma mensagem enviada e nenhuma conversão real disparada pelos testes.
- `git diff --check` dos arquivos existentes alterados sem erros de whitespace.

O primeiro teste de preservação rejeitou as novas rotas, como esperado pela regra anterior de lista fechada. A regra foi ajustada especificamente para este cluster; não foram atualizados os snapshots históricos para mascarar alterações em páginas existentes.

## Checklist mobile e visual

- [x] Sem rolagem horizontal nas cinco larguras verificadas.
- [x] Botões, seletores, campos e controles de FAQ com altura mínima de 44 px.
- [x] Campos com rótulos associados; observações e mensagem personalizada com limites de tamanho.
- [x] Formulário em uma coluna no celular e duas no desktop.
- [x] Contraste revisto em navegação, breadcrumbs, botões, selo local e rodapé.
- [x] Imagens WebP existentes, dimensões intrínsecas corretas, `alt` e carregamento tardio abaixo da dobra.
- [x] Conteúdo e FAQ disponíveis sem depender de JavaScript.
- [x] Revisão visual das capturas mobile e desktop; sem alterações nos estilos globais.

## Preservação e diff resumido

Comparados **739 arquivos existentes** no início da tarefa, excluindo `.git`, `.tmp`, `docs` e caches Python. Apenas `sitemap.xml` e `scripts/validate-ux-cro.py` mudaram nesse conjunto. As **13 páginas protegidas pelo pedido são idênticas byte a byte** ao estado inicial. Os 19 documentos anteriores também passaram na comparação semântica do projeto.

Preservados: HTML antigo, URLs, titles, descriptions, H1, canonicals, schemas, conteúdo, links, imagens, catálogo, configuração de WhatsApp, scripts globais, CSS global e `robots.txt`. Alterações que já existiam no repositório não foram revertidas ou incluídas em commit.

Diff nos arquivos existentes de implementação: sitemap **+3 linhas**; validador **+23/-2 linhas**. Acrescentados três documentos HTML, um CSS, um JavaScript e dois scripts de validação. Nenhuma página-filha vazia foi criada.

## Revisão humana antes do commit

1. Servir a pasta `zadoni-catalogo` localmente e revisar as três rotas, fotos, textos e navegação.
2. Revisar o resumo de WhatsApp em um celular real; confirmar composição, personalização, cartão, retirada e condições comerciais com a equipe.
3. Decidir onde criar futuramente um link de entrada para o cluster sem violar a proteção das páginas existentes.
4. Selecionar somente os arquivos deste escopo para um eventual commit, considerando as muitas alterações anteriores já presentes no repositório.
5. Depois de uma publicação autorizada, verificar HTTP 200 das três URLs no domínio real, canonicals, sitemap e inspeção de URL no Search Console. A validação HTTP desta tarefa foi **local**, não em produção.

Comandos para reproduzir:

```powershell
python -m http.server 8765 --bind 127.0.0.1
# Em outro terminal, na mesma pasta:
node scripts/validate-gift-cluster.mjs
python -m unittest discover -s scripts -p test_seo_baseline.py
Get-ChildItem scripts/validate-*.mjs | ForEach-Object { node $_.FullName }
node scripts/check-gift-cluster-browser.mjs gift-cluster-nova-revisao
```

O teste de navegador usa Chrome no caminho padrão do Windows ou a variável `CHROME_PATH`. Escolha um rótulo novo para preservar capturas de revisões anteriores.
