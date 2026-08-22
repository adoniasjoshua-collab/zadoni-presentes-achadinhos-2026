# Plano de ação — performance e SEO local

Data da auditoria: 2026-08-22

## Resultado da inspeção

O site tem uma base técnica saudável: HTML estático rastreável, URLs canônicas, sitemap, robots.txt, dados estruturados, imagens com dimensões, links de WhatsApp rastreados e páginas com intenções locais distintas. Os validadores existentes passaram sem erros antes da intervenção.

Os principais problemas encontrados foram:

- imagens abaixo da primeira dobra eram pré-carregadas ou marcadas como prioritárias, competindo com CSS e conteúdo inicial;
- os scripts do construtor de cestas bloqueavam a análise do HTML;
- a galeria de chocolates usava apenas JPEG original, sem `srcset` responsivo;
- links de categorias promoviam URLs com `?categoria=`, e variantes desse tipo já aparecem no índice do Google;
- páginas importantes do cluster recebiam poucos links internos;
- o navegador recebia `404` ao solicitar o favicon;
- a página de chocolates não estava coberta por todos os guardrails locais e o gerador poderia removê-la do sitemap.

## P0 — concluído nesta auditoria

- Removido o preload de imagens que ficam abaixo da primeira dobra.
- Aplicado lazy loading e baixa prioridade às imagens de produtos e galerias abaixo do hero.
- Adicionado `defer` aos scripts locais do construtor de cestas.
- Criadas variantes WebP de 480 e 720 px para as seis imagens da página de chocolates.
- Trocados links internos com `?categoria=` por landing pages canônicas ou fragmentos não rastreáveis.
- Reforçados links para entrega de presentes, presentes românticos, monte sua cesta e chocolates.
- Adicionado favicon SVG leve em todas as páginas.
- Incluída a página de chocolates na validação local e no sitemap gerado.
- Adicionada validação de performance para impedir regressões em scripts, imagens e links de filtro.

## P1 — executar após publicar

1. Publicar as alterações e testar as 11 URLs canônicas no Google Search Console.
2. Reenviar `sitemap.xml` e solicitar indexação das páginas prioritárias: home, catálogo, buquês, cestas, café da manhã, floricultura, entrega e chocolates.
3. Monitorar a consolidação das URLs antigas com `?categoria=` na canonical `presentes-canaa.html`.
4. Medir Core Web Vitals reais no Search Console e no PageSpeed Insights, priorizando mobile. Metas: LCP até 2,5 s, INP abaixo de 200 ms e CLS abaixo de 0,1.
5. Confirmar na Hostinger compressão Brotli/Gzip e cache longo para CSS, JavaScript, WebP e SVG. Só adicionar regras de servidor depois de confirmar se a hospedagem usa Apache/LiteSpeed e como o deploy trata `.htaccess`.
6. Conferir no Google Business Profile se nome, telefone, categoria, área atendida, horários e URL coincidem com o site.

## P1 — dados locais que precisam ser confirmados pelo negócio

Não publicar ou inventar endereço, CEP, coordenadas ou horários. Se houver loja aberta ao público, adicionar no site e no `LocalBusiness`:

- endereço completo e CEP;
- latitude e longitude verificadas;
- horários normais e especiais;
- categoria mais específica e correta;
- URL direta do perfil oficial do Google.

Se o negócio atender apenas por entrega ou área de serviço, manter o endereço privado e alinhar essa configuração no Google Business Profile.

## P2 — crescimento do cluster

- Usar consultas reais do Search Console e Google Ads para decidir novas páginas. Criar uma URL nova apenas quando houver intenção diferente, oferta real e conteúdo próprio.
- Prioridades candidatas, condicionadas a demanda comprovada: presentes de aniversário, presentes masculinos, presentes corporativos e entrega de flores.
- Evitar páginas por bairro sem prova de atendimento e conteúdo específico; isso aumenta risco de páginas doorway e canibalização.
- Publicar fotos reais recentes no site e no Business Profile, com descrição factual da ocasião e do produto.
- Criar rotina contínua de avaliações: pedir avaliação após a entrega e responder todas sem usar textos repetitivos.
- Buscar menções e links locais legítimos em parceiros, fornecedores, eventos e veículos de Canaã dos Carajás.

## Painel mínimo de acompanhamento

Revisar mensalmente:

- cliques, impressões, CTR e posição por página/consulta no Search Console;
- URLs indexadas, canonical escolhida pelo Google e erros de rastreamento;
- LCP, INP e CLS mobile por grupo de URLs;
- cliques de WhatsApp por landing page e produto;
- visualizações, ações e consultas do Google Business Profile;
- quantidade, nota média e frequência de novas avaliações;
- conversão de contato em pedido, separada por cluster.

## Critério para a próxima rodada técnica

Priorizar o próximo trabalho com dados de campo. Se o LCP estiver ruim, identificar o elemento LCP e os cabeçalhos de cache antes de comprimir mais arquivos. Se a indexação estiver fraca, corrigir canonical, links e conteúdo antes de criar novas páginas. Se as posições existirem mas o CTR estiver baixo, testar titles e descriptions sem trocar a intenção principal da URL.
