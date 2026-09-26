# Catalogo Zadoni Presentes

Site catalogo da Zadoni Presentes, criado para apresentar produtos locais em Canaa dos Carajas, com foco em presentes, buques, kits, perfumes e cestas vendidos pela loja.

## Objetivo

O projeto tem como foco principal funcionar como um catalogo local simples, rapido e comercial para Canaa dos Carajas, permitindo que clientes vejam presentes, buques, kits, perfumes e cestas, e iniciem o atendimento pelo WhatsApp.

A estrutura tambem deixa espaco para uma futura camada de dados com Supabase e painel administrativo.

## Stack

- HTML
- CSS
- JavaScript
- GitHub
- Hostinger

## Estrutura

```text
zadoni-catalogo/
|-- index.html
|-- presentes-canaa.html
|-- assets/
|   |-- css/
|   |   `-- style.css
|   |-- data/
|   |   `-- produtos.js
|   `-- js/
|       `-- app.js
`-- README.md
```

## Como Rodar Localmente

Nao e necessario instalar dependencias.

Na pasta do projeto, execute `python -m http.server 8000` e abra `http://localhost:8000`. O servidor local permite testar navegação, rotas e formulários nas mesmas condições de caminhos do site.

## Como Publicar

1. Suba os arquivos do projeto para um repositorio no GitHub.
2. Acesse o painel da Hostinger.
3. Conecte a hospedagem ao repositorio do GitHub.
4. Configure a publicacao apontando para a pasta do projeto.
5. Publique e teste as paginas principais:
   - `index.html`
   - `presentes-canaa.html`

## Dados dos Produtos

Os produtos ficam no arquivo:

```text
assets/data/produtos.js
```

Atualmente existe um array principal:

- `produtosLocais`: produtos vendidos localmente pela Zadoni.

## Integrações e validação

O site já inclui SEO local, Google Ads e Meta Pixel. Os guias de presentes e mensagens preparam uma consulta revisável pelo cliente antes de abrir o WhatsApp.

- Validadores estáticos: executar cada `scripts/validate-*.mjs` com Node.js 24.
- Regressão SEO: `python -m unittest discover -s scripts -p test_seo_baseline.py`.
- Navegador: `node scripts/check-gift-cluster-browser.mjs nome-unico-da-revisao`. Requer Chrome local; `CHROME_PATH` permite informar seu executável. O teste bloqueia WhatsApp e rastreadores externos.
- Revisão e escopo para commit: [conclusão da jornada de presentes](docs/journey-release-review-20260926.md).

## Evoluções futuras

- Google Tag Manager
- Google Analytics
- Supabase
- Painel admin

## Observacoes

O projeto foi pensado para ser leve, facil de editar e simples de publicar. A primeira versao pode funcionar apenas com arquivos estaticos, enquanto as proximas etapas podem adicionar banco de dados, painel de cadastro e rastreamento completo de campanhas.
