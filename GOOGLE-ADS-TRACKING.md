# Google Ads WhatsApp Tracking

## Escopo

Implementacao exclusiva da Tag Google Ads e da conversao de clique real em WhatsApp para o site publico da Zadoni Presentes.

- Google Ads tag ID: `AW-16938428518`
- Destino da conversao: `AW-16938428518/zsa-CO2Px9ccEObQ74w_`
- Valor enviado: `1.0`
- Moeda enviada: `BRL`
- Conversoes otimizadas: nao implementadas nesta tarefa

## Arquivos Alterados

- `index.html`
- `404.html`
- `presentes-canaa.html`
- `presentes-canaa-dos-carajas/index.html`
- `buques-canaa-dos-carajas/index.html`
- `cestas-de-presente-canaa/index.html`
- `presentes-romanticos-canaa/index.html`
- `rosas-perfumadas-canaa/index.html`
- `assets/js/google-ads-whatsapp.js`
- `scripts/generate-seo-pages.mjs`
- `scripts/validate-google-ads-tracking.mjs`
- `GOOGLE-ADS-TRACKING.md`

## Paginas Cobertas

- `https://zadonipresentes.com.br/`
- `https://zadonipresentes.com.br/presentes-canaa.html`
- `https://zadonipresentes.com.br/presentes-canaa-dos-carajas/`
- `https://zadonipresentes.com.br/buques-canaa-dos-carajas/`
- `https://zadonipresentes.com.br/cestas-de-presente-canaa/`
- `https://zadonipresentes.com.br/floricultura-canaa-dos-carajas/`
- `https://zadonipresentes.com.br/cesta-cafe-da-manha-canaa/`
- `https://zadonipresentes.com.br/presentes-romanticos-canaa/`
- `https://zadonipresentes.com.br/rosas-perfumadas-canaa/`
- `https://zadonipresentes.com.br/404.html`

## Estrategia Usada

A Tag Google Ads oficial foi instalada uma unica vez em cada pagina publica, logo apos a abertura do `<head>`.

O rastreamento de conversao usa um unico arquivo JavaScript, `assets/js/google-ads-whatsapp.js`, com listener global delegado em `document`. Ele identifica somente links reais de WhatsApp:

- `wa.me/`
- `api.whatsapp.com/`
- `web.whatsapp.com/`

Links com `target="_blank"` mantem a abertura original do navegador e apenas disparam o evento de conversao quando `gtag` esta disponivel. Links que abrirem na mesma aba usam `gtag_report_conversion(url, false)` com fallback de navegacao, para preservar o comportamento quando a tag estiver indisponivel.

## Privacidade

O evento enviado ao Google Ads contem somente:

- `send_to`
- `value`
- `currency`

Nao sao enviados ao Google Ads:

- URL do WhatsApp
- telefone
- mensagem pre-preenchida
- nome
- e-mail
- endereco
- texto digitado
- dados de formulario
- dados pessoais
- identificadores sensiveis

## Quantidade de Links Rastreados

A validacao tecnica conta os links de WhatsApp preservados em HTML publico e confirma que cada link continua usando o telefone oficial. A contagem atual deve ser conferida com:

```powershell
node scripts\validate-google-ads-tracking.mjs
```

## Como Testar Com Google Tag Assistant

1. Publicar a branch apos revisao e merge no fluxo normal.
2. Abrir o Google Tag Assistant.
3. Conectar em `https://zadonipresentes.com.br/`.
4. Navegar pela home, catalogo e paginas de categoria.
5. Confirmar que a tag `AW-16938428518` aparece uma vez por pagina.
6. Clicar em um botao real do WhatsApp.
7. Confirmar o evento `conversion` com destino `AW-16938428518/zsa-CO2Px9ccEObQ74w_`.
8. Confirmar que cliques em Instagram, telefone e links internos nao geram conversao.

## Como Evitar Duplicacao Futura

- Nao adicionar outra tag `AW-16938428518` manualmente nas mesmas paginas.
- Nao instalar a mesma tag via Google Tag Manager sem remover esta implementacao.
- Manter apenas um include de `assets/js/google-ads-whatsapp.js` por pagina.
- Se uma nova pagina publica for criada, incluir o bloco global no `<head>` e o script de tracking uma unica vez.
- Para paginas geradas, manter `scripts/generate-seo-pages.mjs` como fonte da tag.

## Como Remover Com Seguranca

1. Remover o bloco da Tag Google Ads dos HTMLs publicos ou do gerador.
2. Remover o include de `assets/js/google-ads-whatsapp.js`.
3. Remover o arquivo `assets/js/google-ads-whatsapp.js`.
4. Executar:

```powershell
node scripts\generate-seo-pages.mjs
node scripts\validate-seo.mjs
node scripts\validate-google-ads-tracking.mjs
```

5. Ajustar ou remover o validador de Google Ads se a implementacao for removida definitivamente.

## Confirmacao SEO

A validacao atual protege a Tag Google Ads, o destino de conversao e os links de WhatsApp. Alteracoes SEO posteriores podem alterar conteudo, links internos, headings e dados estruturados de forma intencional, desde que a validacao continue passando. Na implementacao original de tracking, ela nao alterou:

- `title`
- meta description
- canonical
- H1, H2 e H3
- schema JSON-LD
- Open Graph
- Twitter Cards
- `robots.txt`
- `sitemap.xml`
- URLs e slugs
- links internos
- textos
- imagens e atributos `alt`
- telefone
- mensagens pre-preenchidas do WhatsApp
- UTMs
- layout
- CSS
- filtros
- catalogo
- produtos
- navegacao
