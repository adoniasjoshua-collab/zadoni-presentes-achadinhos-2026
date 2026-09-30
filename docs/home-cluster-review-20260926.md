# Acesso ao cluster pela Home

Implementado a pedido do usuário após a revisão do fluxo. Esta atualização resolve a ausência de entrada apontada no relatório inicial do cluster.

## Fluxo entregue

Home → bloco “Precisa de ajuda para escolher?”, imediatamente após as categorias:

- Encontrar o presente certo → `/guias-de-presentes/` → formulário e resumo para WhatsApp.
- Escolher uma mensagem → `/mensagens-para-acompanhar-presentes/` → frase e detalhes do presente.
- Planejar um presente de Natal → `/presentes-de-natal-canaa-dos-carajas/` → ideias e consulta de reserva.

O rodapé inclui os três destinos. O novo guia está identificado como “atendimento local”, separado do link existente dos Achadinhos. O menu principal e todos os links anteriores foram mantidos.

## Arquivos

- `index.html`: três cartões, três links no rodapé e referência ao CSS exclusivo.
- `assets/css/home-gift-guides.css`: novo; uma coluna no celular, três a partir de 768 px, foco visível e margem de rolagem para o cabeçalho fixo.
- `docs/seo-approved-additions-20260926.json`: acrescentadas somente as seis novas ocorrências de links da Home à lista explícita de adições aceitas. Snapshots históricos intactos.
- `docs/home-cluster-validation-20260926.json`: resultados dos validadores.
- `docs/ui-home-cluster-entry-verified-20260926/`: capturas e resultados finais do navegador.
- `docs/seo-comparison-release-20260923.json`: regenerado pelo validador existente.

## Verificação

- 20/20 validadores e 6/6 testes de regressão aprovados.
- Cinco larguras verificadas: 360, 390, 412, 768 e 1440 px, sem rolagem horizontal.
- Três cliques de origem na Home abriram os destinos corretos; HTTP 200 local.
- Acessos presentes sem JavaScript; sequência de teclado e foco visível verificados.
- Metadados, canonical, schemas, imagens, breadcrumbs e links anteriores da Home preservados.
- As 13 páginas protegidas permaneceram idênticas byte a byte ao início desta atualização.
- Nenhuma mensagem enviada; requisições externas de rastreamento bloqueadas durante os testes de navegador.

Sem commit, push ou deploy. Para visualizar, sirva `zadoni-catalogo` localmente e abra a Home. No domínio público, o bloco só aparecerá após uma publicação autorizada.
