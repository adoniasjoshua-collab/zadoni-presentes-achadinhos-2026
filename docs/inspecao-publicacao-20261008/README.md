# Inspeção para publicação — 08/10/2026

## Alterações preparadas

- Foto enviada pelo proprietário em WebP de 480, 720 e 1080 px; hero, ícone e primeira opção de buquês por R$ 250. Buquê de borboletas em segundo.
- Correção de 22 mensagens de WhatsApp nas galerias de buquês, cestas e rosas perfumadas: identificação do modelo, resumo e URL pública da foto. Preservados os pedidos anteriores, preços, destino, parâmetros de rastreamento e textos visíveis.
- Versão do CSS atualizada na inicial e na página de buquês para renovar o cache do ícone.

## Preservação

Comparação com o commit `5b68ebebad24b690872f517f3cada6dc07d9ed0e`, anterior à troca do buquê, usando `python scripts/check-publication-20261008.py`:

- 23 páginas: title, H1, metadados, canonical, scripts e JSON-LD preservados.
- Âncoras existentes mantidas; nenhum ID duplicado ou recurso local ausente.
- Robots, sitemap, configuração de redirecionamentos, dados protegidos e workflows mantidos.
- `CHANGELOG-SEO.md` intacto: acompanhamento de 28/10/2026 e decisões posteriores preservados.
- Não foram pedidos indexação, alterações no Google ou mudanças nas automações.

## Verificações aprovadas

- SEO: 13 páginas e 55 produtos no validador geral.
- Integridade local: 19 páginas no sitemap e 5 registros LocalBusiness consistentes.
- Performance estática: dimensões e carregamento de imagens, scripts locais e links.
- WhatsApp: 123 botões de produtos e 60 botões de galerias.
- Combos: HTML sincronizado com os dados e 19 verificações no navegador.
- Perfumaria: teste específico em 4 larguras aprovado.
- Detector de regressão SEO: 6 testes unitários aprovados.
- Heroes: 50 casos em 10 páginas; imagens carregadas, sem overflow ou exceções JavaScript. Três casos da perfumaria divergem apenas do limite genérico de altura de 260 px: o CSS atual usa foto quadrada intencionalmente, validada pelo teste específico da perfumaria.

## Pendências da validação histórica

O workflow geral ainda contém cinco validadores incompatíveis com alterações já registradas antes desta inspeção. Eles foram mantidos, sem apagar históricos nem redefinir os resultados esperados apenas para obter aprovação:

- `validate-combos.mjs`: compara hashes do site inteiro com a versão de 28/09, anterior às alterações documentadas de 30/09 e 01/10. A validação funcional e a sincronização do combo passaram separadamente.
- `validate-seo-baseline.mjs`: compara com o snapshot de 23/09 e autorizações até 28/09; não incorpora as mudanças registradas de 30/09 e 01/10. A comparação desta entrega com o commit anterior passou.
- `validate-navigation-ux.mjs`: exige seis itens na inicial, que já possui sete.
- `validate-perfumaria.mjs`: exige quatro avisos “Imagem em breve”, substituídos pelas fotos atuais.
- `validate-photo-galleries.mjs`: exige quatro fotos na página de buquês, que já tinha doze antes da nova opção.

Essas falhas não permitem declarar o workflow completo aprovado. Atualizar esses testes exige reconciliar as versões históricas com as mudanças comerciais já realizadas, sem reverter o site.

O teste amplo de navegação `check-ui-browser.mjs` não concluiu: o Chrome excedeu o tempo de resposta em `Page.enable` em duas tentativas. Isso limita a cobertura da navegação geral; os testes específicos de heroes, combos e perfumaria executaram, com os resultados descritos acima.

## Publicação

Alterações locais; nenhum commit, push ou deploy realizado nesta inspeção. As capturas e os relatórios são evidências locais, não confirmação de publicação na Hostinger.
