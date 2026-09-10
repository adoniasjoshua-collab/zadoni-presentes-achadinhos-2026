# Revisão mobile — 10/09/2026

## Diagnóstico confirmado em produção

A publicação anterior estava correta: 18 páginas e cinco arquivos essenciais conferidos contra o código local, sem diferenças. O comportamento relatado não era causado por um deploy incompleto. O JavaScript mantinha os carrosséis antigos em nove páginas comerciais e os ativava também quando uma categoria era selecionada no catálogo.

As nove páginas eram buquês, café da manhã, aniversário, cestas de presente, floricultura, entrega de presentes, românticos, chocolates e rosas/perfumes. O teste anterior de 112 combinações priorizava header, teclado e overflow da página; não reprovava rolagem horizontal dentro da vitrine. Essa lacuna foi corrigida.

Evidência anterior: `deploy-inspection-before-20260910.json` e `ui-live-mobile-before-20260910/`.

## Correções

- Removida a inicialização de carrosséis de produtos/galerias e seus controles.
- Removido o transporte de buquês artificiais para dentro da galeria mobile: permanecem na grade original, com todos os produtos e informações.
- Catálogo mobile em duas colunas, incluindo resultados dos filtros; imagens e espaçamentos mais compactos.
- Galerias com rolagem vertical: uma coluna no celular estreito, duas entre 540 e 767 px; composição desktop existente preservada.
- Home com o mesmo H1, texto e links, mas hero compacto em vinho e categorias mobile em duas colunas.
- Novas versões de CSS/JS em todos os consumidores e templates, evitando mistura de arquivos antigos e novos em publicação futura.

SEO e dados comerciais: nenhum novo desvio do baseline original. As 14 exceções continuam sendo exclusivamente os registros da troca de selo autorizada em 09/09. Preços, disponibilidade, títulos, H1, canonicals, schemas, FAQ, sitemap, robots, links e URLs das imagens não foram modificados.

O JavaScript global ficou 10.649 bytes menor, comparando texto com finais de linha normalizados; o CSS ficou 98 bytes menor. Esses valores são de fonte, não tempo de carregamento nem Core Web Vitals.

## Testes antes de publicar

- 16 validadores existentes: aprovados.
- 5 testes do comparador SEO: aprovados.
- 144 combinações de página/largura: aprovadas, zero falhas. Larguras: 360, 390, 430, 540, 640, 768, 1024, 1280 e 1440 px, em 16 páginas que usam o CSS global.
- Verificados filtros, ausência de carrossel, overflow, menu, Tab/Escape, resize, alvos de toque e modal de adicionais.
- Selecionar adicional altera a mensagem WhatsApp; desmarcar restaura o link anterior. Nenhuma mensagem foi enviada.
- Capturas de home, catálogo e galerias inspecionadas visualmente, em `ui-vertical-final-20260910/`.

Snapshot complementar antes desta rodada: `seo-before-mobile-2026-09-10.json`. Comparação contra o baseline original: `seo-comparison-mobile-20260910.json`. O original nunca foi sobrescrito.

## Verificação da publicação

`scripts/check-deployed-seo.py --output <novo-arquivo.json>` verifica as 18 páginas publicadas e os cinco arquivos essenciais. `UI_LIVE=1` no script de navegador executa a inspeção diretamente no domínio, bloqueando tracking e WhatsApp. Os resultados desta seção serão confirmados após o envio da correção; os resultados locais acima não substituem essa etapa.

Limites: testes em Chromium emulado, sem validação em aparelho Safari/iPhone físico. O montador e a página de links mantêm suas experiências próprias. Não houve reconstrução do montador ou mudança de conteúdo comercial. A medição de conversão e Core Web Vitals de campo permanece uma etapa separada.
