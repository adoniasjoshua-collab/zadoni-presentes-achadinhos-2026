# Monte Sua Cesta Zadoni

Aplicação frontend estática para clientes montarem uma cesta personalizada da Zadoni Presentes, acompanharem valor estimado, capacidade do modelo, nível financeiro e enviarem o resumo para o WhatsApp.

## Como executar localmente

Abra `monte-sua-cesta/index.html` no navegador ou sirva o diretório com qualquer servidor estático.

## Estrutura

```text
monte-sua-cesta/
├── index.html
├── css/
│   ├── global.css
│   ├── componentes.css
│   ├── montagem.css
│   └── responsivo.css
├── js/
│   ├── app.js
│   ├── configuracao.js
│   ├── modelos.js
│   ├── produtos.js
│   ├── niveis.js
│   ├── storage.js
│   ├── calculos.js
│   ├── navegacao.js
│   ├── interface.js
│   ├── validacoes.js
│   ├── analytics.js
│   └── whatsapp.js
└── assets/
    ├── logo/
    ├── modelos/
    ├── produtos/
    └── icones/
```

## Onde alterar

- WhatsApp: `js/configuracao.js`, constante `WHATSAPP_NUMBER`.
- Modelos, preços base, capacidade e fotos: `js/modelos.js`.
- Produtos, preços, fotos, categorias e disponibilidade: `js/produtos.js`.
- Níveis financeiros: `js/niveis.js`.
- Cores, ocasiões e validade do carrinho: `js/configuracao.js`.
- Mensagem final do WhatsApp: `js/whatsapp.js`.

## Imagens

O MVP usa imagens reais já existentes em `../assets/optimized/products/`. As pastas internas `assets/modelos/` e `assets/produtos/` foram reservadas para substituições futuras.

## Publicação

Publique a pasta `monte-sua-cesta/` junto com os arquivos estáticos do site. URL esperada:

```text
https://zadonipresentes.com.br/monte-sua-cesta/
```

## Limitações do MVP

- Sem backend, login, pagamento, estoque em tempo real ou painel administrativo.
- Valores estimados, sempre confirmados no atendimento.
- Envio por link `wa.me`; imagens não são anexadas automaticamente.
- Montagem salva apenas no dispositivo usado e expira após sete dias.

## Próximas evoluções

- Trocar dados demonstrativos por tabela oficial de produtos.
- Adicionar fotos dedicadas para cada modelo físico.
- Criar painel simples para atualizar produtos sem editar código.
- Integrar eventos definitivos de GA4, Google Ads e Meta Pixel.
