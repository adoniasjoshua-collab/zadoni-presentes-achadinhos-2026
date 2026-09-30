# Auditoria SEO · Zadoni Presentes

Data: 30/09/2026 · Base: Search Console (28 dias vs. 28 anteriores) e repositório `zadoni-catalogo`.
Branch de trabalho: `seo/otimizacao-out-2026`.

## 1. Stack e hospedagem

- **Site:** HTML estático escrito à mão, com JavaScript próprio (`assets/js`). Existem geradores em `scripts/`, mas eles não reproduzem mais o HTML publicado e não devem ser rodados.
- **Hospedagem:** Hostinger, servidor LiteSpeed. Um push na branch `main` do GitHub publica o site em cerca de 15 segundos.
- **Regras de servidor:** o redirecionamento HTTP → HTTPS e o cache de 7 dias para imagens, CSS e JS ficam no servidor, fora do repositório. O repositório não tem `.htaccess`, `_redirects`, `netlify.toml` nem `vercel.json`.
- **Consequência para redirecionamentos:** o servidor aceita 301 real, mas ele deve ser criado no hPanel, em Redirecionamentos. Publicar um `.htaccess` pelo Git pode sobrescrever o arquivo que já existe no servidor e desligar o HTTPS.
- **CI:** o GitHub Actions falha por bloqueio de cobrança da conta, antes de rodar qualquer passo. A validação é feita localmente com `scripts/validate-*`.

## 2. Inventário das páginas do sitemap

Estado da branch depois das mudanças da Fase 1. Todas as imagens têm `alt`, e as fotos de produto já usam WebP 4:5 com `width`, `height` e `loading` definidos desde 29/09.

| Página | Title (car.) | Description (car.) | H1 | Canonical própria | Dados estruturados | Palavras | Imagens sem alt | Links WhatsApp (com mensagem) | Título mudou em |
|---|---|---|---|---|---|---|---|---|---|
| / | Zadoni &#124; Loja de Presentes e Floricultura em Canaã (50) | 138 | 1 | sim | LocalBusiness, Organization | 580 | 0 | 7 (5) | 2026-08-17 |
| /presentes-canaa.html | Loja de Presentes em Canaã dos Carajás &#124; Buquês e Cestas (56) | 133 | 1 | sim | LocalBusiness, Product, FAQPage, BreadcrumbList, Organization | 2417 | 0 | 60 (59) | 2026-09-30 |
| /buques-canaa-dos-carajas/ | Buquê de Flores em Canaã dos Carajás &#124; Rosas e Presentes (56) | 146 | 1 | sim | LocalBusiness, Product, FAQPage, BreadcrumbList, Organization | 1663 | 0 | 33 (32) | 2026-09-30 |
| /cestas-de-presente-canaa/ | Cestas de Presente em Canaã dos Carajás &#124; Com Entrega (53) | 142 | 1 | sim | LocalBusiness, Product, FAQPage, BreadcrumbList, Organization | 1267 | 0 | 36 (35) | 2026-09-30 |
| /cesta-de-aniversario-canaa/ | Cesta de Aniversário em Canaã dos Carajás &#124; Com Entrega (55) | 138 | 1 | sim | Product, FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 1058 | 0 | 23 (22) | 2026-09-30 |
| /floricultura-canaa-dos-carajas/ | Floricultura em Canaã dos Carajás &#124; Buquês com Entrega (54) | 146 | 1 | sim | Product, FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 1320 | 0 | 27 (26) | 2026-09-30 |
| /cesta-cafe-da-manha-canaa/ | Cesta de Café da Manhã em Canaã dos Carajás &#124; Zadoni (52) | 140 | 1 | sim | FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 674 | 0 | 18 (17) | 2026-08-05 |
| /monte-sua-cesta/ | Monte Sua Cesta em Canaã dos Carajás &#124; Zadoni (45) | 145 | 1 | sim | Organization, WebPage | 16 | 0 | 2 (2) | 2026-08-17 |
| /presentes-romanticos-canaa/ | Presentes Românticos em Canaã dos Carajás &#124; Zadoni (50) | 128 | 1 | sim | LocalBusiness, Product, FAQPage, BreadcrumbList, Organization | 488 | 0 | 17 (16) | 2026-08-17 |
| /rosas-perfumadas-canaa/ | Rosas Perfumadas em Canaã dos Carajás &#124; Buquês (46) | 126 | 1 | sim | LocalBusiness, Product, FAQPage, BreadcrumbList, Organization | 1030 | 0 | 22 (21) | 2026-09-30 |
| /revenda-chocolates-canaa/ | Revenda de Chocolates em Canaã dos Carajás &#124; Zadoni (51) | 141 | 1 | sim | BreadcrumbList, Organization, WebPage | 397 | 0 | 9 (9) | 2026-08-21 |
| /achadinhos/ | Zadoni Achadinhos &#124; Ideias de Presentes para Todo o Brasil (58) | 137 | 1 | sim | FAQPage, BreadcrumbList, Organization, ItemList, CollectionPage, WebPage | 344 | 0 | 0 (0) | 2026-08-24 |
| /achadinhos/presentes-para-namorada/ | Presentes para Namorada: Guia de Escolha &#124; Zadoni Achadinhos (60) | 114 | 1 | sim | FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 699 | 0 | 0 (0) | 2026-08-24 |
| /achadinhos/presentes-criativos/ | Presentes Criativos: Ideias e Critérios &#124; Zadoni Achadinhos (59) | 105 | 1 | sim | FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 649 | 0 | 0 (0) | 2026-08-24 |
| /achadinhos/presentes-de-aniversario/ | Presentes de Aniversário: Guia por Perfil &#124; Zadoni Achadinhos (61) | 137 | 1 | sim | FAQPage, BreadcrumbList, Organization, ItemList, WebPage | 1388 | 0 | 0 (0) | 2026-08-24 |
| /perfumaria-cosmeticos-canaa/ | Perfumaria em Canaã dos Carajás &#124; Zadoni (40) | 153 | 1 | sim | LocalBusiness, BreadcrumbList, ItemList, CollectionPage | 947 | 0 | 15 (15) | 2026-09-15 |
| /guias-de-presentes/ | Guia para Escolher o Presente Certo &#124; Zadoni Presentes (54) | 138 | 1 | sim | FAQPage, BreadcrumbList, WebPage | 914 | 0 | 5 (5) | 2026-09-26 |
| /mensagens-para-acompanhar-presentes/ | Mensagens para Cartão de Presente &#124; Zadoni Presentes (52) | 134 | 1 | sim | FAQPage, BreadcrumbList, WebPage | 848 | 0 | 6 (6) | 2026-09-26 |
| /presentes-de-natal-canaa-dos-carajas/ | Presentes de Natal em Canaã dos Carajás &#124; Zadoni (48) | 150 | 1 | sim | FAQPage, BreadcrumbList, WebPage | 477 | 0 | 2 (2) | 2026-09-26 |
| /combos-pastel-canaa/ | Combos de Pastel em Canaã dos Carajás &#124; Zadoni (46) | 192 | 1 | sim | BreadcrumbList, ItemList, CollectionPage | 760 | 0 | 8 (8) | 2026-09-28 |

Observações:
- A descrição de `/combos-pastel-canaa/` tem 192 caracteres, acima do limite de 155. O Google deve cortá-la.
- Os títulos de 3 páginas de Achadinhos têm de 59 a 61 caracteres. Estão fora do escopo local.

## 3. Regra das 3 semanas

| Página | Último título | Pode mudar a partir de |
|---|---|---|
| Perfumaria | 15/09/2026 | **06/10/2026** |
| Guias, mensagens e Natal | 26/09/2026 | 17/10/2026 |
| Combos de pastel | 28/09/2026 | 19/10/2026 |
| Demais páginas locais | 17/08 a 25/08/2026 | já liberadas |

As 7 páginas alteradas em 30/09 só voltam a poder mudar de título a partir de **21/10/2026**.

## 4. Duplicidades de "presentes"

- `/presentes-canaa` sem `.html` responde **404**. Não é uma cópia no ar. As 3 impressões antigas vieram de algum link externo ou de uma versão anterior. Um 301 para `/presentes-canaa.html` recupera esse sinal.
- `/presentes-canaa-dos-carajas/` era uma página própria: "Entrega de Presentes em Canaã dos Carajás", com 611 palavras e 11 produtos, todos repetidos do catálogo. O catálogo `/presentes-canaa.html` tem 2.417 palavras e 55 produtos. As duas disputavam "presentes em Canaã". A menor teve 0 cliques e caiu de 93 para 64 impressões.
- **Decisão aplicada na branch:** consolidar na página oficial. A página não foi apagada. A canonical dela aponta para `/presentes-canaa.html`, ela saiu do sitemap, e os links "Entrega de presentes" levam à seção de entrega do catálogo. **Falta o 301 no hPanel.**

## 5. Sitemap e robots

- `robots.txt` libera todo o site e aponta para o sitemap. Não precisa mudar.
- O sitemap tinha 21 URLs, todas oficiais, sem `<lastmod>`. Agora tem 20 URLs, sem a página consolidada, e cada uma com `<lastmod>` igual à data real do último commit do arquivo.

## 6. Página inicial

- **Title atual (50):** `Zadoni | Loja de Presentes e Floricultura em Canaã`
- **Description atual (138):** `Zadoni Presentes: loja de presentes e floricultura em Canaã dos Carajás com buquês, flores, cestas de café da manhã e mimos pelo WhatsApp.`
- **Hipótese para a queda de CTR de 10,7% para 4,8%:**
  1. O título abre com "Zadoni", uma marca que quase ninguém busca, com 2 impressões no mês. No celular, "Canaã dos Carajás" aparece truncado.
  2. As impressões subiram de 450 para 790 em buscas mais genéricas e mais baixas na página. Isso reduz a média de cliques mesmo sem piora real.
  3. Para buscas como "floricultura" e "perto de mim", o mapa com as lojas ocupa o topo e absorve parte dos cliques.
- **Não alterada:** duas opções aguardam a escolha do dono. Estão no relatório de entrega.

## 7. `/monte-sua-cesta/`

Título, descrição, canonical e robots não mudam desde 17/08. As mudanças de setembro foram de interface. O HTML entregue ao Google tem só **16 palavras**, porque o montador é gerado por JavaScript. Com volumes de 27 e 5 impressões, a hipótese é oscilação somada a pouco conteúdo indexável. Pela lista de preservação, a recomendação é **acrescentar** um bloco de texto estático, com perguntas frequentes e como funciona, sem mexer no título.

## 8. Endereço antigo

A busca por "Hospital das Bombas", "Av. Liberdade", "Liberdade, 409" e "Asdrúbal" nas páginas publicadas encontrou **nenhuma ocorrência**. O site não tinha endereço de rua: o rodapé e os 8 blocos `LocalBusiness` traziam só "Canaã dos Carajás - PA". Não havia nada a substituir, então o endereço oficial foi **acrescentado**:
- nos 8 blocos `LocalBusiness`, que usam o mesmo `@id`, com `streetAddress` e `postalCode` 68350-067;
- nos rodapés de 11 páginas locais, com link "Como chegar".

Achadinhos e combos de pastel ficaram de fora. Nos combos, o dono decidiu em 28/09 não publicar endereço de retirada.

## 9. Mudanças priorizadas

| # | Mudança | Impacto | Esforço | Risco | Estado |
|---|---|---|---|---|---|
| 1 | Endereço completo no schema e nos rodapés | Alto (busca local) | Baixo | Baixo | Feito na branch |
| 2 | Novos títulos e descrições de 7 páginas | Alto (CTR) | Baixo | Médio | Feito na branch |
| 3 | Consolidar presentes-canaa-dos-carajas | Médio | Baixo | Baixo | Feito na branch, falta 301 |
| 4 | Sitemap com lastmod | Baixo | Baixo | Baixo | Feito na branch |
| 5 | Título da inicial | Alto | Baixo | Alto | Aguarda escolha |
| 6 | Título da perfumaria | Médio | Baixo | Baixo | A partir de 06/10, falta definir a marca |
| 7 | Conteúdo ampliado de buquês (Fase 3) | Alto | Médio | Baixo | Depois de 21/10 |
| 8 | Texto estático em monte-sua-cesta | Médio | Médio | Baixo | Proposto |
| 9 | Descrição de combos com 192 caracteres | Baixo | Baixo | Baixo | Em 19/10 |
| 10 | Tipo `Florist` no schema da loja | Baixo | Baixo | Médio | Proposto |

**Fases 2 e 5 já estão quase prontas:** o site já tem mensagem pronta no WhatsApp por produto, com página de origem, botão flutuante, chamada na primeira tela, WebP, dimensões e carregamento sob demanda. Os cliques no WhatsApp já disparam a tag de conversão do Google Ads (AW-16938428518) e o Meta Pixel. Não há Google Analytics 4 nem Tag Manager.
