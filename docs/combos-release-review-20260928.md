# Nova página de combos — revisão de 28/09/2026

## Estado da entrega

Aprovada pelo proprietário e integrada para publicação em 28/09/2026: `status: ready`, `index, follow`, uma entrada nova no sitemap e links de descoberta em Home (Links Rápidos), catálogo (rodapé) e `/links/` (atalho "Combos de pastel", `data-bio-link="combos_pastel"`). Google Ads e Meta Pixel carregam como nas demais páginas; o rastreamento continua representando clique/contato, não pedido pago.

Navegação e contato (28/09, segunda publicação): botão fixo de WhatsApp (some quando a barra "Revisar pedido" aparece); atalhos no topo comparando Combo 1/2/3 com preço; refrigerante em lata já marcado em cada pastel; rodapé completo com 12 páginas da Zadoni e contato (WhatsApp, Instagram, avaliações Google); card "Combos de Pastel" na grade principal da Home, com foto recortada da arte e grade de 5 colunas (a última ocupa a linha inteira no celular). O menu principal de 6 itens não foi alterado.

Fotos reais por recheio recebidas em 28/09 (originais em assets/img/originais/combos/, fora do deploy). Retirada: local e horário combinados no WhatsApp; nenhum endereço é publicado.

## Funcionalidade

- Layout enxuto (28/09, noite): um card por recheio (carne com queijo, frango com queijo, presunto com queijo) com foto real própria, preço único em destaque R$ 22 = 1 pastelão + 1 refrigerante em lata, botão "Pedir no WhatsApp" e um botão "Adicionais e opções" com suco (+ R$ 7), observação, quantidade, adicionais e entrega/retirada. Combos de 2 e 3 pastéis (R$ 30/47) foram descontinuados, e as artes com esses preços saíram da página e do repositório.
- Adicionais com quantidades: refrigerante em lata extra R$ 6 por lata; caixinha R$ 10; maçã R$ 5; pão de queijo R$ 2; barrinha Cacau Show R$ 10; Ferrero caixas de 4, 8 e 12 unidades por R$ 40, R$ 55 e R$ 69.
- Lista expansível por combo; quantidades preservadas ao recolher; preços unitários, subtotais e total visíveis. Quantidades dos adicionais são por combo, multiplicadas quando se pedem vários combos iguais.
- Compra direta de um grupo de combos ou inclusão no pedido geral. Edição, remoção, resumo revisável e mensagem completa para o telefone existente, 5594992993138.
- Recebimento escolhido pelo cliente, uma vez por pedido: retirada sem taxa (local e horário combinados no WhatsApp) ou entrega com frete R$ 5 uma única vez por pedido e endereço atendido. Padrão: entrega. A escolha aparece em cada card e em "Meu pedido", sincronizada. Não transfere essa regra para cestas/buquês.
- Entrega em toda a zona urbana de Canaã dos Carajás. Suco é adicional de R$ 7 por bebida, somado por combo e multiplicado pela quantidade de combos iguais (decisão de 28/09). As artes ainda dizem "refrigerante em lata ou suco" como incluído e precisam ser ajustadas antes da divulgação.
- Campos de preferência e personalização são escapados na interface. Nenhum dado livre é salvo no navegador ou enviado a rastreadores.
- O pedido fica apenas em memória; recarregar limpa as escolhas. Sem JavaScript, permanecem os três produtos, preços e links de consulta no WhatsApp.
- Limites de interface: 20 combos por grupo e 99 unidades de cada extra por combo; não representam estoque confirmado.

## Preservação do patrimônio SEO

Foi registrada uma impressão SHA-256 de 62 arquivos anteriores nesta sessão. O validador confirma que continuam idênticos byte a byte. Não foram modificados URLs, canonical, títulos, descrições, H1, textos, schemas, imagens, links, dados de produtos, CSS/JS compartilhados, sitemap ou robots anteriores.

A única alteração necessária em ferramenta anterior foi uma exceção restrita em `scripts/validate-ux-cro.py`: admite exclusivamente a nova rota como rascunho com noindex e fora do sitemap. Todos os testes dos arquivos e páginas protegidos permanecem. Os snapshots históricos não foram regravados.

Isso demonstra preservação dos arquivos locais, não garantia de posições no Google. Nesta etapa não foi realizada comparação entre a publicação Hostinger e a cópia local, nem consulta ao Search Console.

## SEO preparado para a nova URL

- Canonical próprio: `https://zadonipresentes.com.br/combos-pastel-canaa/`.
- Title: `Combos de Pastelão em Canaã dos Carajás | Zadoni`.
- Descrição própria; idioma pt-BR; um H1; sabores, composição, preços e contexto local em HTML estático.
- Links de contexto para cestas, buquês, aniversário e catálogo, preservando a finalidade das categorias anteriores.
- Schema `CollectionPage`, `BreadcrumbList` e `ItemList`, coerentes com a página de coleção. Sem classificação falsa de restaurante, avaliações fabricadas, estoque inventado ou promessa de resultado enriquecido de produto.
- Metadados sociais com marca existente enquanto faltam as fotos. Imagens reais terão dimensões explícitas, carregamento adiado nas posições posteriores e prioridade na primeira foto.
- CSS e JavaScript exclusivos da página, sem dependências adicionais e sem carregar o catálogo completo antigo.
- No rascunho, Google Ads e Meta não são carregados. O gerador prepara as integrações existentes para o estado `ready`, sem eventos falsos de compra; o rastreamento existente continua representando clique/contato, não pedido pago.

Referências verificadas:

- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet

## Evidências

- `docs/combos-preservation-before-20260928.json`: hashes anteriores.
- `docs/combos-validation-20260928.json`: 21 validadores aprovados. O validador de performance foi repetido após acrescentar loading/decoding ao logo novo.
- Seis testes de `test_seo_baseline.py` aprovados.
- `docs/ui-combos-reviewed-20260928/results.json`: 28 verificações em navegador, incluindo larguras 360, 390, 412, 768, 1024 e 1440 px; quantidades; caixas Ferrero; frete único; edição; remoção; suco; conteúdo malicioso tratado como texto; teclado; ausência/falha de JavaScript.
- Capturas `combos-390.png`, `combos-1440.png`, `extras-390.png` e `pedido-390.png` na mesma pasta. Capturas de celular e desktop inspecionadas visualmente.
- Sintaxe JS, sincronia gerador/HTML e diff sem erros de whitespace verificados.
- Nos testes, WhatsApp e rastreadores foram bloqueados. Nenhuma mensagem foi enviada.

## Imagens necessárias

Enviar fotos originais, sem necessidade de renomear ou comprimir:

1. Pastelão de carne com queijo acompanhado da lata incluída.
2. Pastelão de frango com queijo acompanhado da lata incluída.
3. Pastelão de queijo e presunto acompanhado da lata incluída.
4. Caixinha personalizada pronta, para representar o acabamento (opcional para a primeira revisão).

Preferir a mesma luz, fundo e enquadramento nos três sabores. As fotos de combos serão preparadas em proporção 4:3, com pelo menos 1200 px de largura na origem, se possível. Uma delas ou uma foto dos três pode originar a imagem social 1200×630. Não usar imagem de combo com adicionais como se esses extras estivessem incluídos nos R$ 20.

Salvar versões tratadas em `assets/optimized/combos/`. O cadastro usa caminhos relativos à raiz, por exemplo `assets/optimized/combos/carne-queijo.webp`. A imagem de caixinha poderá ser acrescentada ao adicional após seu recebimento; a interface atual da lista é textual.

## Dados comerciais pendentes

- Marcas e volumes das latas; confirmar quais estão incluídas e eventual diferença de preço.
- Bairros/área para a entrega de R$ 5.
- Composição e preço dos mini kits de chocolate vendidos separadamente, se entrarão no lançamento.

O arquivo `combos-pastel-canaa/catalogo.json` é a fonte exclusiva dessa linha. Preços são inteiros em centavos. Exemplo de formato de bebida: `{ "id": "identificador-unico", "name": "Marca e volume confirmados", "price": 0 }`; `price` é o acréscimo por combo. `delivery.areas` recebe nomes de bairros confirmados. Não inventar opções para preencher a prévia.

## Próxima etapa de implantação

1. Receber e otimizar fotos; preencher os dados pendentes no JSON; gerar a página novamente com `node scripts/generate-combos.mjs`.
2. Revisar fotos, composições, bebida e entrega com o proprietário; testar a versão final em celular.
3. Preparar uma única integração local: estado `ready`, remover noindex pelo gerador, acrescentar uma entrada canonical ao sitemap e links de acesso em Home e catálogo. O gerador recusa `ready` sem imagens reais, bebidas e bairros. Ele nunca publica nem altera páginas anteriores sozinho.
4. Atualizar de forma restrita os validadores: substituir a exceção de rascunho por uma adição publicada, autorizar somente os novos links e a nova entrada no sitemap. Preservar todos os snapshots e as verificações do conteúdo anterior. O validador de combos atualmente exige o estado draft e deverá validar ready e a integração nessa etapa; simplesmente mudar o JSON não libera publicação.
5. Executar novamente a suíte e os testes de navegador; revisar a comparação dos arquivos antigos, admitindo apenas os links novos em Home/catálogo e a nova entrada no sitemap.
6. Revisar lista seletiva de arquivos antes do deploy. O repositório interno e o externo possuem numerosas alterações antigas preparadas; não usar commit geral nem regenerar o site inteiro.
7. Depois da publicação autorizada: verificar HTTP 200, canonical, ausência de noindex, imagens, telefone e total do WhatsApp no domínio real; conferir sitemap; solicitar indexação da nova URL no Search Console quando houver acesso. Não remover nem redirecionar URLs antigas.

Rollback: retirar exclusivamente a entrada nova do sitemap e os links acrescentados, restaurar a revisão anterior dos arquivos de integração e despublicar a página nova se necessário. Nunca reverter globalmente o repositório com alterações de terceiros.

## Prévia local

Na pasta `zadoni-catalogo`, executar `python -m http.server 8765 --bind 127.0.0.1` e visitar `http://127.0.0.1:8765/combos-pastel-canaa/`.

Arquivos principais desta entrega: JSON e HTML em `combos-pastel-canaa/`; `assets/css/combos.css`; `assets/js/combos.js`; gerador, validadores e testes com nome combos em `scripts/`; a alteração restrita em `scripts/validate-ux-cro.py`; este documento e as evidências de combos em `docs/`.
