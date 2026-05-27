# Catalogo Zadoni Presentes

Site catalogo da Zadoni Presentes, criado para apresentar produtos locais em Canaa dos Carajas e preparar a evolucao futura para achadinhos Brasil, rastreamento de conversoes e integracao com Supabase.

## Objetivo

O projeto tem como foco principal funcionar como um catalogo local simples, rapido e comercial para Canaa dos Carajas, permitindo que clientes vejam presentes, buques, kits, perfumes e cestas, e iniciem o atendimento pelo WhatsApp.

A estrutura tambem deixa espaco para uma expansao nacional com achadinhos afiliados, alem de uma futura camada de dados com Supabase e painel administrativo.

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
|-- achadinhos.html
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

Abra o arquivo `index.html` diretamente no navegador.

## Como Publicar

1. Suba os arquivos do projeto para um repositorio no GitHub.
2. Acesse o painel da Hostinger.
3. Conecte a hospedagem ao repositorio do GitHub.
4. Configure a publicacao apontando para a pasta do projeto.
5. Publique e teste as paginas principais:
   - `index.html`
   - `presentes-canaa.html`
   - `achadinhos.html`

## Dados dos Produtos

Os produtos ficam no arquivo:

```text
assets/data/produtos.js
```

Atualmente existem dois arrays principais:

- `produtosLocais`: produtos vendidos localmente pela Zadoni.
- `achadinhos`: produtos afiliados ou de curadoria nacional.

## Checklist Futuro

- Google Tag Manager
- Meta Pixel
- Google Analytics
- Supabase
- Painel admin
- SEO local

## Observacoes

O projeto foi pensado para ser leve, facil de editar e simples de publicar. A primeira versao pode funcionar apenas com arquivos estaticos, enquanto as proximas etapas podem adicionar banco de dados, painel de cadastro e rastreamento completo de campanhas.
