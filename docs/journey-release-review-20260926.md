# Revisão concluída — jornada de presentes — 26/09/2026

As alterações locais do cluster e da Home foram revisadas em conjunto com o último commit `fa527bf` e com a auditoria `ux-customer-journey-audit-20260926.md`. As correções estão prontas para um commit seletivo no repositório `zadoni-catalogo`. Nenhum commit, push ou deploy foi executado.

## Correções entregues

1. Selecionar qualquer frase preserva destinatário e ocasião previamente escolhidos. Os valores sugeridos só preenchem campos vazios.
2. Guia e Mensagens oferecem conversa direta na abertura e antes do formulário. Monte sua cesta oferece contato independente do configurador, sem exigir modelo ou orçamento.
3. As 19 páginas anteriores têm entrada consistente para o guia e mensagens, inclusive Home, categorias, perfumaria, Links e 404. Achadinhos mantém sua finalidade nacional e oferece uma ponte identificada para ajuda local, sem adicionar campanha ou WhatsApp local às páginas afiliadas.
4. Mensagens mostra uma prévia e permite consultar a frase no WhatsApp sem preencher as seis preferências. O resumo completo permanece disponível.
5. Natal oferece um atalho com a ocasião sugerida. Categorias transportam contexto reconhecido por fragmento; ele não é enviado ao servidor. Preferências de seleção continuam nesta aba via sessionStorage, com opção de limpar. Mensagem livre, observações e data não são armazenadas. Sugestões nunca substituem uma ocasião já escolhida.
6. Busca sem resultados oferece guia, atendimento e botão funcional de limpar filtros.
7. A introdução explica que as sugestões serão feitas pela Zadoni no WhatsApp; o formulário prepara a conversa, sem prometer recomendação automática, estoque ou reserva.
8. Foram acrescentados destinatários, data opcional e “Ainda não decidi” para recebimento.

A navegação tradicional das diferentes áreas foi preservada. A barra de ajuda comum funciona sem JavaScript e oferece continuidade mesmo quando os menus antigos dependem de script. Uma eventual reformulação integral dos menus não faz parte desta correção.

## Evidências

- [20 validadores estáticos aprovados](journey-release-validation-20260926.json).
- Seis testes unitários do detector de regressões SEO aprovados.
- [Relatório do navegador](ui-journey-approved-20260926/results.json): 15 combinações das três páginas novas em 360, 390, 412, 768 e 1440 px; 38 verificações das 19 entradas anteriores em 390 e 1440 px; dois fluxos de resumo; sete frases; continuidade de preferências; Natal e categoria; respeito às escolhas anteriores; recuperação da busca; teclado e fallback do cluster sem JavaScript ou com script indisponível.
- Capturas de Home e Monte sua cesta em 390 px inspecionadas visualmente, além das verificações geométricas automatizadas. Os testes não substituem uma avaliação em aparelho físico.
- [Preservação SEO das 19 páginas](seo-comparison-release-20260923.json): metadados, canonical, schemas, H1, textos anteriores, imagens e links antigos preservados. A lista de adições foi ampliada apenas para os links efetivamente incluídos; snapshots históricos não foram regravados.
- Sintaxe JavaScript e `git diff --check` aprovados.

As chamadas externas de WhatsApp, Google e Meta foram bloqueadas nos testes. Não houve mensagem enviada nem conversão real. A publicação atual na Hostinger não foi verificada nesta revisão local.

## Escopo do commit

Use a [lista explícita de arquivos](journey-release-files-20260926.json). Ela reúne o cluster ainda não versionado, a integração da Home, as correções de jornada, os validadores e as evidências finais em JSON. Capturas intermediárias e relatórios históricos não são necessários ao funcionamento do site.

O índice do repositório interno já continha 1.341 arquivos preparados antes desta revisão, quase todos capturas históricas. O repositório externo também possui alterações antigas preparadas. Esses estados foram preservados. Um commit genérico do índice atual incluiria material fora desta entrega; o commit deve usar a lista explícita e ser feito dentro de `zadoni-catalogo`.

Mensagem sugerida: `fix: concluir jornada de escolha e atendimento de presentes`.
