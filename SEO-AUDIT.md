# SEO Audit - Zadoni Presentes

Data: 2026-07-26

## Arquitetura Identificada

- Framework: nenhum framework; site estatico em HTML, CSS e JavaScript puro.
- Pagina principal analisada: `presentes-canaa.html`.
- Dados de produtos: `assets/data/produtos.js`, array `produtosLocais`.
- Renderizacao atual: HTML estatico inicial para rastreadores + melhoria progressiva em `assets/js/app.js` para filtros, adicionais e links de WhatsApp.
- Publicacao: arquivos estaticos servidos no dominio `https://zadonipresentes.com.br`.

## Implementado

- H1 de `presentes-canaa.html` alterado para `Presentes em Canaã dos Carajás: Buquês, Cestas e Surpresas`.
- Removido destaque permanente de Dia dos Namorados da primeira tela e da descricao evergreen do perfume 521 Vip Rose.
- Title, meta description, canonical absoluto, Open Graph e Twitter Cards adicionados nas paginas SEO.
- Produtos renderizados diretamente no HTML inicial com nome, descricao, preco inicial, imagem responsiva e link de WhatsApp.
- Fallback `Nenhum produto encontrado` saiu do HTML inicial; agora aparece apenas via JavaScript quando um filtro nao retorna resultados.
- Criadas paginas locais:
  - `/presentes-canaa-dos-carajas/`
  - `/buques-canaa-dos-carajas/`
  - `/cestas-de-presente-canaa/`
  - `/presentes-romanticos-canaa/`
  - `/rosas-perfumadas-canaa/`
- JSON-LD valido adicionado para Organization, LocalBusiness, WebSite, BreadcrumbList, Product, Offer e FAQPage quando aplicavel.
- `sitemap.xml` atualizado com URLs canonicas.
- `robots.txt` conferido com `Allow: /` e sitemap absoluto.
- Criadas variantes WebP 480w e 720w dos produtos em `assets/optimized/products/responsive/`.
- Cards usam `picture`, `srcset`, `width`, `height`, `loading` e `fetchpriority`.
- Eventos criados:
  - `click_whatsapp`
  - `view_product`
  - `select_category`
  - `click_instagram`
- Links de WhatsApp usam parametros UTM.
- Criados scripts locais:
  - `scripts/convert-product-images.py`
  - `scripts/generate-seo-pages.mjs`
  - `scripts/validate-seo.mjs`

## Verificacoes Executadas

- `node --check assets/js/app.js`
- `node --check scripts/generate-seo-pages.mjs`
- `python -m py_compile scripts/convert-product-images.py`
- `node scripts/validate-seo.mjs`
- `git diff --check`
- HTTPS producao: `https://zadonipresentes.com.br/presentes-canaa.html` respondeu `200 OK`.
- HTTP producao: `http://zadonipresentes.com.br/presentes-canaa.html` respondeu `301 Moved Permanently`.

## Observacoes de Producao

A producao atual ainda serve a versao antiga ate o PR ser revisado, aprovado e implantado. Na verificacao online antes do merge, a pagina publicada ainda exibia Achadinhos e destaque de Dia dos Namorados.

## Riscos e Proximos Checks

- Core Web Vitals reais precisam ser medidos apos deploy, porque LCP, INP e CLS dependem da hospedagem, cache, rede e dispositivo.
- Os JSON-LD de Product usam os precos cadastrados em `produtosLocais`; se esses valores mudarem, o arquivo de dados e as paginas geradas devem ser atualizados juntos.
- As dimensoes HTML dos produtos usam proporcao estavel 720x900 com `object-fit: contain`; validar visualmente apos deploy em mobile.
- Sem GitHub CLI instalado neste ambiente; a abertura do PR depende do push/autenticacao via Git ou conector GitHub disponivel.

## Atualização - 2026-08-05

- Criadas páginas locais adicionais para cobrir duas intenções fortes observadas no Google Ads:
  - `/floricultura-canaa-dos-carajas/`
  - `/cesta-cafe-da-manha-canaa/`
- As novas páginas usam o mesmo template SEO local, com canonical absoluto, Open Graph, Twitter Cards, BreadcrumbList, Product, Offer e FAQPage quando aplicável.
- `presentes-canaa.html` ganhou links internos contextuais para Floricultura e Cesta de café da manhã na navegação de categorias.
- As páginas geradas ganharam links internos para Floricultura e Cesta de café da manhã no header/footer do template.
- `index.html` ganhou cartões e links internos para as novas páginas sem alterar URL existente, scripts de tracking, número de WhatsApp ou botões já publicados.
- `sitemap.xml` foi atualizado com as novas URLs canônicas.
- `scripts/validate-seo.mjs` passou a validar as novas páginas.
- `scripts/validate-google-ads-tracking.mjs` foi ajustado para validar preservação de Google Ads e WhatsApp durante evoluções SEO, sem congelar título, heading, JSON-LD e links internos contra a branch base.
- Nenhum deploy ou push remoto foi executado.