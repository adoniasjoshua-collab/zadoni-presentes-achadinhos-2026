"""Produce the technical handoff from saved browser and SEO evidence."""
import json
import subprocess
import statistics
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
def read(name):
    return json.loads((DOCS / name).read_text(encoding='utf-8-sig'))
def write(name, text):
    (DOCS / name).write_text(text.strip() + '\n', encoding='utf-8')

before = read('ui-ux-cro-before-20260919-browser/results.json')
after = read('ui-ux-cro-delivery-20260919/results.json')
audit = '''# Auditoria UX/CRO pré-implementação — 19/09/2026

Documento solicitado lido integralmente. Auditoria realizada antes da edição de produção; esta versão consolida em UTF-8 as evidências salvas naquela fase. Os números do Search Console vieram do documento do usuário e não foram verificados na conta.

## Segurança, stack e escopo

Nenhum AGENTS.md encontrado na árvore ou ancestrais consultados. README, DESIGN-SYSTEM, fluxo do montador e relatório da vitrine lidos. Repositório estático HTML/CSS/JavaScript dentro de `zadoni-catalogo`; dados em `assets/data/produtos.js`, gerador `scripts/generate-seo-pages.mjs`, CSS compartilhado `style.css`/`storefront.css`, app e Google Ads compartilhados. Montador tem módulos próprios. Publicação documentada por GitHub/Hostinger; não executada. Sem dependências instaladas ou atualizadas.

Git interno inicialmente sem arquivos rastreados modificados. Foram preservados os diretórios `docs/ui-perfumaria-live-20260915/`, `docs/ui-perfumaria-review-20260915/`, `docs/ui-storefront-live-published-20260911/` e os validadores locais de integridade SEO não rastreados. Arquivos externos ao repositório interno também preservados. Baseline exata de 19 páginas salva antes da implementação.

## Medições iniciais em 390 × 900 px

Coordenadas desde o topo, em CSS px. WhatsApp visível significa não recolhido no documento inteiro; não significa simultaneamente dentro do viewport. A contagem acima da dobra está no JSON. Home tem caminhos de categoria; montador usa componentes próprios, fora do seletor de cards da tabela.

| Página | Cards | Primeiro card y | Primeiro CTA de card y | WA não recolhidos | Ordem inicial dos blocos |
|---|---:|---:|---:|---:|---|
'''
for row in before['results']:
    if row['width'] != 390: continue
    a = row['audit']
    audit += f"| {row['page']} | {a['cards']} | {round(a.get('firstProductY', 0))} | {round(a.get('firstContextualY', 0))} | {a['whatsappVisible']} | {' → '.join(a['sections'])} |\n"
audit += '''
## Matriz e plano refinado

| Página | Gargalo | Evidência | Severidade | Impacto esperado | Risco SEO | Ação |
|---|---|---|---|---|---|---|
| Home | 12 caminhos equivalentes | HTML e captura | P0 | Facilitar escolha inicial | Baixo | DESTACAR quatro; RECOLHER oito; manter links no HTML |
| Catálogo | 54 cards; 14 adicionais interrompem últimos buquês | Dados, HTML e DOM | P0 | Priorizar presentes | Baixo | REPOSICIONAR grupos; SIMPLIFICAR detalhes; preço e busca literal |
| Aniversário | Quatro bolos antes de 11 cestas | Ordem HTML e screenshot | P0 | Alinhar primeira oferta à intenção | Baixo | REPOSICIONAR seções inteiras |
| Café | 12 modelos com três saídas por modelo | 36 links de faixa | P1 | Reduzir decisões simultâneas | Baixo | RECOLHER escolha, depois faixa e um link ativo |
| Cestas | Referências antes de ofertas; ações competem | Cards, galeria e app.js | P1 | Acelerar escolha | Baixo | REPOSICIONAR ofertas; personalização secundária |
| Buquês | Referências e adicionais competem | Cards e app.js | P1 | Destacar compra direta | Baixo | REPOSICIONAR ofertas; detalhes opcionais |
| Floricultura | Explicação e referências antes das ofertas | HTML | P1 | Mostrar flores e jarros cedo | Baixo | REPOSICIONAR produtos sem reescrever SEO |
| Presentes local | Explicação antes da vitrine | HTML | P2 | Continuidade pós-clique | Baixo | REPOSICIONAR vitrine |
| Românticos | Referências antes da seleção comercial | HTML | P2 | Clareza na escolha | Baixo | REPOSICIONAR produtos |
| Rosas/perfumes | Explicação antes da vitrine | HTML | P2 | Mostrar oferta cedo | Baixo | REPOSICIONAR produtos |
| Monte sua cesta | Perda de foco após renderização; sem fallback de compra | app.js e HTML vazio | P2 | Resiliência e teclado | Baixo | CORRIGIR foco, movimento reduzido e saída estática |

## Hipóteses confirmadas e refinadas

- Confirmados: 12 categorias, 54 produtos, bolos antes de cestas, 36 CTAs de faixa, duas colunas estreitas no celular e `cover` cortando fotos.
- Parcialmente confirmada a competição com adicionais: componentes details/modal já existiam. MANTER esses componentes, reduzir seu peso visual.
- Achadinhos já tinha peso secundário; REPOSICIONAR seu acesso após prova local, mantendo texto e link.
- Filtros de categoria já existem. Não há taxonomia confiável de ocasião/destinatário: busca por palavras cadastradas e preço, sem inventar classificações.
- O app recriava cards estáticos ao carregar, mudando mensagens de WhatsApp. Preservar os nós originais na filtragem.
- Um clique já permite consulta direta. Café passa a modelo → faixa → WhatsApp; adicionais continuam opcionais. Montador exige modelo/faixa e oferece campos opcionais.
- Mensagens são contextuais, mas extensas. MANTER composição, parâmetros e destino; encurtamento fica para teste futuro autorizado.
- Fotos já têm derivados WebP, dimensões e lazy loading. Ajustar apresentação antes de gerar arquivos redundantes. Original melhor depende de inspeção visual, não só resolução.
- Há repetição de notas comerciais; RECOLHER mantendo texto integral, sem apagar avisos por hipótese.
- Contrastes principais existentes constam no DESIGN-SYSTEM. Não se declara conformidade WCAG integral. Testar foco, menu, modal e tamanho de toque.
- Riscos de carregamento: animação escalonada de 54 cards, reconstrução DOM e imagens cortadas. Medir LCP/CLS localmente sem confundir com dados reais de visitantes.

## Evidências e limites

Primeira execução Chromium restrita falhou em `Page.enable`; execução autorizada passou em 66 cenários: 11 páginas × 360/390/412/768/1024/1366 px, altura 900 px. Sem overflow, exceções JS ou imagem eager quebrada nesse smoke inicial. Tracking e WhatsApp bloqueados.

Capturas e medições originais: `ui-ux-cro-before-20260919-browser/`. Reconstrução somente para leitura da revisão registrada, com capturas das seis larguras e métricas laboratoriais: `ui-ux-cro-baseline-complete-20260919/`. O teste ampliado registra a falha preexistente do montador sem JS. Nenhuma mensagem enviada.
'''
write('auditoria-ux-cro-pre-implementacao.md', audit)

report = '''# Relatório UX/CRO pós-implementação — 19/09/2026

Implementação local concluída. Nenhum commit, push, merge ou publicação. Alterações preexistentes preservadas.

## Alterações implementadas

- Home: quatro categorias prioritárias, oito em details nativo com links estáticos; Achadinhos após prova local.
- Catálogo: 40 presentes antes de 14 adicionais; preservados os 54 cards HTML e seus links originais. Filtros de categoria, preço inicial e busca literal; estado vazio, limpar e navegação por fragmento. Nenhuma classificação comercial inventada.
- Aniversário: 11 cestas antes dos quatro bolos; atalho contextual para cestas, destinos e rótulos antigos preservados.
- Café: 12 modelos com seleção progressiva. Depois de abrir o modelo, escolher uma faixa revela somente seu link de WhatsApp. Sem JS, details nativo conserva os três links originais. Preços, composição e URLs preservados.
- Floricultura, cestas, buquês, presentes, românticos e rosas: vitrine comercial antecipada, explicações e referências mantidas abaixo.
- Cards: uma coluna mobile, duas tablet e três desktop; imagens inteiras com contain, proporção reservada, detalhes/adicionais secundários, fontes e controles legíveis. Corrigido selo branco sobre branco na galeria de aniversário.
- Montador: foco conduzido à próxima etapa e respeito a movimento reduzido; saída estática para WhatsApp quando scripts não carregam.
- Gerador compartilha transformação idempotente de apresentação. Testado em pasta isolada; arquivos da loja e sitemap não regenerados. Versões dos apps atualizadas para evitar cache incompatível.

## Comparativo de distância até a oferta — 390 px

Coordenadas de cards não equivalem a conversão. Na página de aniversário o primeiro card anterior era bolo; agora é cesta. Café deixa de ter saída de faixa aberta por padrão; deve-se abrir o modelo e escolher a faixa.

| Página | Primeiro card antes (px) | Depois (px) | WA não recolhidos antes | Depois |
|---|---:|---:|---:|---:|
'''
old_rows = {r['page']: r for r in before['results'] if r['width'] == 390}
for row in after['results']:
    if row['width'] != 390: continue
    a = row['audit']; old = old_rows[row['page']]['audit']
    report += f"| {row['page']} | {round(old.get('firstProductY',0))} | {round(a.get('firstProductY',0))} | {old['whatsappVisible']} | {a['whatsappVisible']} |\n"
report += '''
## Proteção SEO

`seo-comparison-ux-cro-20260919.json`: 19 páginas, zero violações. Comparação exata de title, H1, metadados, canonical, schemas, breadcrumbs, hreflang, links originais, atributos de imagem, dados comerciais, sitemap, robots e redirects. Primeiro parágrafo e blocos completos de texto preservados. Ordem de seções e rótulos novos são permitidos; uma única adição de link é explicitamente validada: fallback do montador.

O validador histórico comparava ordem absoluta de todos os elementos e inicialmente reportou 1.291 diferenças de apresentação. `validate-seo-baseline.mjs` agora usa a baseline desta tarefa e o contrato semântico; `--historical` mantém a comparação histórica disponível. Baselines antigas e aprovações não foram sobrescritas. Scripts e analytics existentes mantidos; somente versões de cache dos apps locais são normalizadas no teste.

## Imagens

Inventário em `inventario-imagens-ux-cro.md` e `.json`: 574 arquivos locais, incluindo pastas de originais/backups, 171 usos HTML. Nenhum arquivo ausente, pequeno abaixo do limiar de 360 px, acima de 200 KB ou sem dimensões entre esses usos. Verificação adicional no navegador carrega todas as imagens DOM em 390 px, inclusive lazy e montador.

Nenhuma foto substituída, nenhuma fonte externa e nenhum derivado redundante gerado. Existiam WebP e variantes responsivas. CSS deixa o produto inteiro visível. A primeira foto de café (`cesta-cafe-da-manha-modelo-real-01.jpeg`) contém faixas pretas no próprio arquivo; precisa de original enquadrado melhor para eliminar essas faixas sem inventar conteúdo. Nitidez, correspondência comercial e demais enquadramentos devem ser aprovados visualmente. Resolução suficiente não comprova qualidade.

## Testes executados

- `node scripts/check-ux-cro-browser.mjs after ux-cro-delivery-20260919`: 66 cenários, resultados e capturas por largura em `ui-ux-cro-delivery-20260919/`.
- Testes funcionais: menu por Tab/Escape e retorno de foco; modais e adicionais; URL alterada com seleção e restaurada ao remover; filtros vazios/preço/limpar; preservação dos 54 nós; três faixas; foco do montador; eventos WhatsApp; imagens lazy; fallback sem JS nas 11 páginas em 390 px. Sem envio de mensagens.
- `node scripts/validate-seo-baseline.mjs` e `python scripts/validate-ux-cro.py`: contrato SEO atual.
- Todos os `scripts/validate-*.mjs`: resultados em `ux-cro-existing-validators.json`.
- `python scripts/test_seo_baseline.py`: seis testes do detector de regressão.
- Sintaxe Node dos JS alterados e `git diff --check`.
- Build: gerador executado somente em `.tmp/ux-cro-build-*`, 11 páginas geradas, zero diferença de title/metadata/canonical/schema; ordem de aniversário confirmada. Resultado em `ux-cro-build-result.json`.

| Viewport | Páginas | Falhas finais |
|---|---:|---:|
'''
for width in (360,390,412,768,1024,1366):
    rows = [r for r in after['results'] if r['width'] == width]
    report += f"| {width} × 900 | {len(rows)} | {sum(bool(r['failures']) for r in rows)} |\n"
report += '''
Métricas LCP/CLS de laboratório estão nos JSON antes/depois; são medições locais sem throttling, observadas perto do carregamento, não Core Web Vitals de campo nem garantia de performance. Não há Lighthouse instalado; o equivalente utilizado é Chromium/CDP com PerformanceObserver, inspeção visual e testes geométricos. Não foram testados Safari/iOS real, rede móvel real ou integrações de atendimento em produção.

## Eventos e mensuração

Mantidos `click_whatsapp`, `select_category` e conversão Google Ads. `view_product` passa a observar impressão real de 25% do card, uma vez por card/carregamento nas páginas revisadas. Adicionados `view_product_list` (quando a lista entra no viewport, uma vez por lista), `select_product`, `open_product_details`, `open_personalization`, `apply_filter`, `select_price_tier`, `click_whatsapp_product` e `click_whatsapp_generic`.

Camada existente `dataLayer`, sem nova plataforma ou ID. Eventos novos não enviam telefone, mensagem, campos pessoais ou busca livre. Params incluem página/tipo, ID/nome/categoria, faixa, posição e seção conforme aplicável. `click_whatsapp` mantém payload legado; o evento segmentado o complementa. Não somar os dois como duas conversões. `select_category` é equivalente legado de filtro; não somar a `apply_filter` como ações separadas.

Google Ads configurado no repositório não demonstra coleta de sessões GA4 nem ingestão automática de objetos dataLayer. Validar conexão autorizada da camada ao analytics e DebugView/Tag Assistant antes de usar os eventos em relatórios. Não presumir que push no dataLayer já cria relatório GA4.

KPI: sessões com pelo menos um clique WhatsApp ÷ sessões da página × 100. Deduplicar por sessão e página na ferramenta de analytics; contagem bruta de eventos não é clique único. Segmentar mobile/desktop, entrada, produto, filtro e detalhes. Para conversão por produto, conectar `view_product` a `click_whatsapp_product` pelo ID na mesma sessão; `view_product_list` sozinho não comprova que cada produto foi visto.

Comparar janelas equivalentes e registrar campanhas, preços e sazonalidade: dia 7, validar coleta/duplicação; dia 14, avaliar CTR por página/dispositivo e filtros; dia 21, examinar detalhes/faixas e qualidade das conversas; dia 28, comparar conversão para pedidos, mantendo tráfego orgânico, impressões, CTR SERP e posição como guardrails. Não atribuir causalidade a pequenas amostras nem prometer aumento de vendas.

## Pendências e validação antes da publicação

- P0: validar presencialmente mensagens, nomes, faixas e adicionais no WhatsApp sem enviar pedido de teste; conferir em Android/iPhone real o fluxo café e o montador. Confirmar ingestão de analytics antes de medir conversão. Não há P0 técnico conhecido nos testes executados.
- P1: obter original melhor da primeira imagem de café; revisão humana das fotos e nitidez. Validar contraste integral com leitor de tela, Safari e conexões lentas.
- P2: taxonomia de ocasião/destinatário depende de dados comerciais; revisão de snippets ou encurtamento de mensagens depende de experimento SEO separado. Ver `recomendacoes-seo-futuras.md`.

Revisar `ux-cro-code.diff`, os arquivos listados abaixo, Home, catálogo, aniversário, café e floricultura nas capturas. Conferir navegação com voltar, filtros combinados, personalização opcional e preço final informado pela loja. Após aprovação humana, publicar arquivos estáticos modificados junto com CSS/JS novos pelo processo já existente; não é necessário regenerar sitemap. Limpar cache aplicável e repetir smoke das URLs públicas, canonical/robots/schema e analytics. Esta tarefa não executou publicação.

## Arquivos alterados

Lista de arquivos rastreados obtida do Git, seguida dos novos componentes/ferramentas. Arquivos não rastreados preexistentes não integram o diff desta tarefa.

'''
changed = subprocess.check_output(['git','diff','--name-only'],cwd=ROOT).decode().splitlines()
report += '\n'.join('- `' + name + '`' for name in changed)
report += '\n\nNovos: `assets/css/ux-cro.css`, `assets/js/ux-cro.js`, `scripts/apply-ux-cro-layout.mjs`, `scripts/check-ux-cro-browser.mjs`, `scripts/validate-ux-cro.py`, `scripts/inventory-ux-cro-images.py`, `scripts/report-ux-cro.py` e documentos/evidências UX/CRO em `docs/`.\n'
write('relatorio-ux-cro-pos-implementacao.md', report)
baseline_vitals = read('ui-ux-cro-baseline-complete-20260919/results.json')['results']
metric_note = (f"\n\nComparação local (66 cenários): LCP mediano {statistics.median(r['vitals']['lcp'] for r in baseline_vitals):.0f} → "
               f"{statistics.median(r['vitals']['lcp'] for r in after['results']):.0f} ms; maior CLS observado "
               f"{max(r['vitals']['cls'] for r in baseline_vitals):.3f} → "
               f"{max(r['vitals']['cls'] for r in after['results']):.3f}. Diferenças pequenas neste ambiente; validar em rede e dispositivos reais.")
file = DOCS / 'relatorio-ux-cro-pos-implementacao.md'
file.write_text(file.read_text(encoding='utf-8').replace('## Eventos e mensuração', metric_note + '\n\n## Eventos e mensuração'), encoding='utf-8')
write('recomendacoes-seo-futuras.md', '''# Recomendações para ciclos separados

| Prioridade | Proposta não executada | Motivo e risco | Hipótese de teste |
|---|---|---|---|
| P1 | Reescrever title/description da floricultura | Protegidos; risco de alterar sinais orgânicos e CTR | Teste isolado, comparar impressões/posição/CTR em janelas equivalentes |
| P1 | Encurtar mensagens de WhatsApp | Removeria composição, imagem ou parâmetros úteis protegidos | Aprovar texto com atendimento e comparar qualidade da conversa |
| P2 | Remover avisos e textos repetidos | Podem conter regras comerciais/SEO | Revisão editorial específica; nesta rodada apenas recolhidos |
| P2 | Criar filtros taxonômicos de ocasião/destinatário | Base não oferece dados confiáveis | Cadastrar taxonomia aprovada, depois medir uso e CTR |

URLs, H1, parágrafos principais, metadados, schema, FAQ, preços e telefone não foram reescritos. Nenhuma imagem de terceiro foi utilizada.
''')
print('Technical audit and handoff generated from saved evidence.')
