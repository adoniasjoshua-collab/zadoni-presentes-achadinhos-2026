# Revisão para publicação — 20/09/2026

Vitrine e escolha pelo WhatsApp revisadas: produtos antecipados, filtros preservando a seleção, três buquês naturais por encomenda, capa de buquês e foto completa do modelo artificial. Adicionais acessíveis sem details aninhado, total visível e mensagens identificando o modelo. Corrigido evento duplicado de escolha na foto com link WhatsApp.

## Verificações

- 18 validadores JavaScript passaram (`precommit-validation-20260920.json`).
- 6 testes Python do detector de regressão passaram.
- Chrome local: 66 casos, 11 páginas em 360, 390, 412, 768, 1024 e 1366 px, sem falhas (`ui-precommit-full-20260920/results.json`). Inclui seleção e remoção de adicionais, atualização/restauração da mensagem, total visível, três modelos naturais, filtros, orçamento, foco e fallback sem JavaScript em 390 px. WhatsApp e serviços de rastreamento bloqueados durante os testes; nenhuma mensagem enviada.
- Gerador executado com destino temporário: destaques presentes nas páginas de buquês e floricultura.
- Sintaxe JavaScript e whitespace conferidos.

## Correções da revisão

- Validador de catálogo considera somente produtos ativos, como o site e o gerador.
- Teste da faixa Básica atualizado para os R$ 220 já configurados no montador; não houve alteração de preço nesta revisão.
- Teste da versão de JavaScript alinhado à versão carregada pela página de café.
- Texto de floricultura recupera a expressão contextual “flores para presente”.
- A floricultura pode compartilhar buquês com a página especializada, mantendo arranjos próprios, metadados distintos e links contextuais.

## Referências de SEO

As referências históricas permanecem intactas. A referência `seo-release-20260920.json` e os blocos correspondentes registram a versão local revisada, incluindo as alterações comerciais de 19–20/09. Não representam aprovação externa nem resultado de conversão.

Conferidos contra 19/09: mesmas 19 páginas, títulos, H1, canonical, breadcrumbs e arquivos de infraestrutura. As diferenças comerciais incluem produtos novos/desativados, preços já editados, organização, imagens, descrições de buquês/floricultura e schemas correspondentes. `python scripts/validate-ux-cro.py --pre-commercial` continua permitindo auditar essas diferenças; `node scripts/validate-seo-baseline.mjs --historical` conserva a comparação histórica anterior.

Ainda não medidos: conversão real, atendimento, Safari/iPhone físico e velocidade em rede móvel. O push não comprova a conclusão da publicação na Hostinger.
