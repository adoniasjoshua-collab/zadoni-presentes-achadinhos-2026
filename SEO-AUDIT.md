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
## Ajuste seguro - 2026-08-05

### Ajustes realizados

- Reposicionada a página `/floricultura-canaa-dos-carajas/` para apresentar a Zadoni como empresa de presentes com opções de buquês, rosas, flores e presentes, sem afirmar que é uma floricultura tradicional.
- Reposicionada a página `/cesta-cafe-da-manha-canaa/` para focar exclusivamente em cesta de café da manhã e composição com itens matinais.
- Revisadas âncoras internas para reduzir repetição de palavra-chave exata:
  - `Flores e buquês`
  - `Flores e buquês em Canaã`
  - `Cesta de café`
  - `Cesta matinal personalizada`
- Removida da página de café da manhã a listagem de cestas sem relação clara com café da manhã.
- Removido da página de floricultura o produto de perfume que entrava por conter termo relacionado a floral, mas não era uma oferta de flor, rosa, buquê ou arranjo.
- Nas duas páginas novas, o JSON-LD deixou de incluir `LocalBusiness` e `availability`, mantendo `WebPage`, `BreadcrumbList`, `ItemList`, `Product`, `Offer` e `FAQPage` apenas quando visíveis/aplicáveis.

### Informações presumidas removidas ou suavizadas

- Removida a afirmação direta de que a Zadoni funciona como floricultura.
- Removidas expressões que podiam sugerir disponibilidade imediata, estoque permanente ou entrega garantida.
- Substituída a ideia de “surpreender cedo” por linguagem cautelosa sobre modelos, composição, disponibilidade e consulta pelo WhatsApp.
- A personalização passou a ser descrita como possibilidade dependente de modelo, itens e disponibilidade.

### Mapeamento de intenção

- `/presentes-canaa.html`: catálogo geral, loja de presentes, presentes em Canaã dos Carajás e presentes personalizados.
- `/floricultura-canaa-dos-carajas/`: intenção ampla de floricultura, flores, rosas, buquês e presentes com flores, sem prometer estrutura de floricultura tradicional.
- `/buques-canaa-dos-carajas/`: intenção específica de buquês, tipos de buquê, buquê romântico e buquê de rosas.
- `/cestas-de-presente-canaa/`: cestas de presente, cestas personalizadas e cestas para diferentes ocasiões.
- `/cesta-cafe-da-manha-canaa/`: cesta de café da manhã, cesta matinal e composição com itens de café.

### Redução do risco de canibalização

- A página de floricultura ficou mais ampla que a página de buquês, evitando repetir o mesmo H1 e o mesmo posicionamento.
- A página de café da manhã passou a exibir apenas o produto com relação clara com café da manhã, evitando competição direta com a página ampla de cestas.
- As âncoras internas foram diversificadas para reforçar o papel de cada URL.

### Validações executadas

- `node scripts/validate-seo.mjs`: ok, 10 páginas e 33 produtos preservados.
- `node scripts/validate-google-ads-tracking.mjs`: ok, 10 páginas e 125 links de WhatsApp preservados.
- `node --check scripts/generate-seo-pages.mjs`: ok.
- `node --check scripts/validate-google-ads-tracking.mjs`: ok.
- `git diff --check`: ok.

### Resultado final

- Produtos, preços e dados de origem foram preservados.
- Google Ads, ID da tag, destino de conversão e número do WhatsApp foram preservados.
- O total de links de WhatsApp caiu de 133 para 125 porque a página de cesta de café da manhã deixou de listar produtos irrelevantes e, consequentemente, removeu CTAs de WhatsApp desses produtos da página nova.
- Nenhum push ou deploy foi executado.