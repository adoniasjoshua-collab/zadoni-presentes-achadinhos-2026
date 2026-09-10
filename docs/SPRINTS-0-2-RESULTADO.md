# Resultado — Sprints 0, 1 e 2

Data: 09/09/2026 (America/Sao_Paulo). Branch: `feat/ui-ux-cro-controlled`.

## Sprint 0

Baseline capturado antes das alterações visuais, a partir do commit `9724b47`. Implementação e comparação registradas no commit `9e52e5d`.

Arquivos criados: `docs/seo-baseline-before-ui.json`, `docs/seo-approved-changes.json`, `docs/seo-comparison-sprint-0.json`, `docs/SPRINT-0.md`, `docs/MONTE-SUA-CESTA-FLUXO-ATUAL.md`, `scripts/seo_baseline.py`, `scripts/test_seo_baseline.py`, `scripts/validate-seo-baseline.mjs` e `.github/workflows/validate.yml`. `.gitignore` passou a excluir caches Python e perfis temporários locais.

Páginas incluídas no baseline:

- `/`
- `/presentes-canaa.html`
- `/presentes-canaa-dos-carajas/`
- `/floricultura-canaa-dos-carajas/`
- `/buques-canaa-dos-carajas/`
- `/cestas-de-presente-canaa/`
- `/cesta-cafe-da-manha-canaa/`
- `/cesta-de-aniversario-canaa/`
- `/presentes-romanticos-canaa/`
- `/rosas-perfumadas-canaa/`
- `/revenda-chocolates-canaa/`
- `/monte-sua-cesta/`
- `/achadinhos/`
- `/achadinhos/presentes-criativos/`
- `/achadinhos/presentes-de-aniversario/`
- `/achadinhos/presentes-para-namorada/`
- `/links/`
- `/404.html`

Registrados URL, title, meta description e demais metadados, canonical, headings H1–H6, JSON-LD completo, FAQ, breadcrumbs, links internos/externos com âncoras, referências e alt das imagens, variantes picture e conteúdo textual principal. Também são protegidos os arquivos de dados comerciais, sitemap, robots e redirects locais quando presentes.

Resultado inicial: 18 páginas, zero divergências. Os 16 validadores passaram. Cinco testes do comparador passaram, cobrindo múltiplas mutações intencionais: title, description, schema/preço, conteúdo, FAQ, imagens/alt, links, H1, remoção de página, robots e tentativa de ampliar uma exceção aprovada. Alterações de apresentação sem mudança semântica são aceitas.

## Selo autorizado

Commit `344937c`: “Mais escolhida” substituído por “Versão intermediária” na página de café, na configuração do montador e no template gerador. Preços e demais afirmações não foram alterados.

O original permanece no baseline histórico. O comparador registra 14 diferenças autorizadas: 12 âncoras de faixa, o texto principal da página de café e o arquivo de configuração do montador. As exceções usam hashes exatos antes/depois e não autorizam nenhuma alteração adicional nesses campos.

## Sprints 1–2

Implementação registrada no commit `9a49813` (`feat(ui): refine shared controls and accessible mobile header`). As evidências de navegador e este relatório ficam em commit documental separado.

- Tokens de controles e cantos refinados; cores de WhatsApp escurecidas para legibilidade do texto branco.
- CTAs existentes de WhatsApp identificados visualmente em verde.
- Header mobile com menu, marca e WhatsApp contextual existente, sem duplicar links.
- Menu desktop com alvos de toque maiores e estado atual mais visível.
- Foco visível, ordem de teclado, fechamento por Escape/saída de foco e menu rolável em tela baixa.
- WhatsApp restaurado ao estado flutuante ao voltar ao desktop, mantendo mensagem e tracking.
- Versões das referências de CSS/JS atualizadas para evitar mistura de assets antigos e novos numa publicação futura. Templates recebem as mesmas versões; o gerador não foi executado.

Arquivos de implementação: `assets/css/style.css`, `assets/js/app.js`; referências de assets nos HTML que os utilizam e nos dois geradores; referência da configuração no HTML do montador. O validador de café foi atualizado para exigir a nova versão do JS. Não houve alteração em valores, disponibilidade, URLs, titles, H1, canonicals, schemas, sitemap ou robots.

## Evidências e limites

Comparação final: `seo-comparison-after-ui.json`. Somente a troca do selo aparece como divergência autorizada; nenhuma regressão inesperada detectada.

Navegador: larguras 360, 390, 430, 768, 1024, 1280 e 1440 px. Referência anterior: 77 casos aprovados. Verificação final ampliada do CSS compartilhado: 112 casos aprovados, zero falhas, em `ui-after-shared/results.json`. Capturas de home e café a 390/1440 px e menu a 390 px estão nos diretórios correspondentes. Testes verificam overflow, imagens iniciais quebradas, exceções JS, abertura/fechamento do menu, Tab/Escape, landmark de navegação, alvos do header, sobreposição, resize e preservação do WhatsApp.

Sem push ou deploy. A CI foi configurada no repositório efetivo do site, mas ainda não executou no GitHub. O workflow não versionado na raiz externa do workspace foi preservado.

Risco residual: o baseline é de fonte local, não auditoria HTTP/Hostinger ou garantia de indexação. Screenshots e testes usam Chromium, não substituem Safari/iPhone físico nem avaliação com pessoas. Não há medição nova de Core Web Vitals de campo ou prova de ganho em conversão. A conferência visual completa das vitrines e do fluxo de adicionais pertence aos próximos sprints. O montador foi documentado e não foi reconstruído.

Próximo escopo do plano: Sprint 3, home comercial; depois cards/vitrines e páginas por categoria. Manter o baseline original e as confirmações comerciais pendentes.
