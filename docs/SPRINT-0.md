# Sprint 0 — proteção antes de UI

O baseline registra o código local de 09/09/2026, antes das novas alterações visuais. Não reconstrói uma fotografia histórica de agosto nem comprova o estado publicado, HTTP, indexação ou Core Web Vitals.

## Uso

Requisitos: Node para os validadores existentes e Python 3 (biblioteca padrão, sem pacotes adicionais).

```sh
python scripts/seo_baseline.py check
python scripts/seo_baseline.py check --output docs/seo-comparison-after-ui.json
python -m unittest discover -s scripts -p test_seo_baseline.py
```

`validate-seo-baseline.mjs` integra a checagem à execução de `validate-*.mjs`. Qualquer divergência inesperada retorna código 1 e mostra o caminho antes/depois. Execute os validadores Node na raiz do site.

O comando `capture` cria o primeiro snapshot e recusa sobrescrever um arquivo existente. Nunca recapture sobre o original para fazer um teste passar. Snapshots adicionais devem usar `--output` com outro nome. Baseline e aprovações devem ser revisados no Git; o teste não substitui revisão de alterações nesses arquivos.

## O que fica protegido

Todas as páginas HTML publicáveis encontradas: URL derivada do caminho, title, todos os metadados (description, robots, OG/Twitter), canonical, H1–H6, JSON-LD completo, FAQ, breadcrumbs, texto do main, todos os links e suas âncoras, imagens/alt/dimensões/srcset/sizes e fontes de picture. A lista de páginas também é comparada: remoções e adições falham.

Arquivos comerciais de `assets/data/`, configuração, modelos, produtos e níveis do montador, sitemap, robots e configurações locais de redirects são comparados integralmente quando presentes. Alterações visuais em classes, estilos e wrappers sem mudança textual são permitidas. O snapshot não executa JavaScript: comportamento renderizado exige teste no navegador.

## Exceções autorizadas

O usuário autorizou especificamente substituir “Mais escolhida” por linguagem neutra. A troca será registrada em `seo-approved-changes.json` com caminho exato e hashes SHA-256 do valor antes/depois. Não é uma autorização genérica para alterar conteúdo, preço ou schema. O baseline original permanece intacto. Nenhuma outra exceção está autorizada.

## Limites

HTMLParser é um parser da biblioteca padrão para o HTML estático do projeto, não um navegador nem um auditor de acessibilidade. A comparação semântica não detecta conteúdo escondido por CSS, problemas de foco ou alteração visual de preço via JavaScript. Testes de navegador e validadores comerciais continuam necessários. Configurações remotas de Hostinger e redirects externos não são observáveis neste snapshot.
