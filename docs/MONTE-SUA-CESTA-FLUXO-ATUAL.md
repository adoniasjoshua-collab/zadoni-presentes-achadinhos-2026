# Monte sua Cesta — fluxo real auditado em 09/09/2026

A página carrega configuração, modelos, storage, analytics, whatsapp, interface e app. O arquivo legado `js/produtos.js` existe, mas não é carregado pelo HTML atual. Não tratar seus preços como uma oferta ativa de montagem item a item.

1. Cliente escolhe um modelo ou pede ajuda para escolher.
2. Seleciona uma faixa: Básica, Intermediária ou Premium, com os valores atuais preservados.
3. Pode informar ocasião, data desejada e observações. Os campos são opcionais.
4. Visualiza modelo e faixa selecionados.
5. Abre WhatsApp com o resumo. Composição, disponibilidade, entrega e total são confirmados no atendimento.

As escolhas são guardadas em localStorage com prazo configurado de sete dias. Não há checkout de pagamento, estoque em tempo real ou seleção ativa de todos os itens da base legada. Os eventos atuais incluem seleção de modelo/faixa e clique WhatsApp da cesta assistida.

## Melhorias incrementais propostas, sem reconstrução

- Preservar o foco de teclado após renderização de uma escolha (o app substitui `innerHTML`).
- Respeitar movimento reduzido também nos `scrollIntoView` com `behavior: smooth` explícito.
- Verificar legibilidade, resumo e acesso ao CTA em 360–430 px.
- Confirmar recebimento dos eventos já existentes antes de ampliar medição.
- Revisar feedback de seleção mantendo as três etapas e os dados comerciais atuais.

Essas melhorias são propostas para o sprint do montador. Nesta rodada só será neutralizado o selo autorizado, sem reconstruir o fluxo.
