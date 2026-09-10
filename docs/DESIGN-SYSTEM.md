# Design system — Sprints 1–2

Evolução do CSS existente, sem framework, fonte externa, biblioteca de ícones ou carrossel novo.

| Uso | Token | Valor |
|---|---|---|
| Marca | `--cor-primaria` | `#7a2f55` |
| Header e texto forte | `--cor-primaria-escura` | `#4f1d38` |
| Destaque da marca/foco no header | `--cor-secundaria` | `#f3c85f` |
| Conversa no WhatsApp | `--cor-whatsapp` | `#087a3d` |
| WhatsApp hover/gradiente | `--cor-whatsapp-escura` | `#066332` |
| Fundo | `--cor-fundo` | `#fff8fb` |
| Texto | `--cor-texto` | `#2f2530` |
| Texto secundário | `--cor-texto-leve` | `#746a76` |
| Cantos compartilhados | `--raio` | `12px` |
| Alvo mínimo dos controles revisados | `--alvo-toque` | `44px` |

Tipografia preservada: fontes de sistema no corpo e Georgia/serif nos títulos. Espaçamento usa os tokens já existentes de 4, 8, 16, 24, 32 e 48 px. O hero da home e as vitrines serão tratados nos sprints próprios; o presente trabalho não redesenha essas seções.

## Contraste calculado

Razão de luminância sRGB, sem transparência: branco sobre verde WhatsApp 5,44:1; branco sobre verde escuro 7,40:1; dourado sobre vinho do header 8,46:1; texto secundário sobre fundo principal 4,94:1. Isso valida essas combinações, não constitui certificação WCAG de todas as páginas.

## Header e navegação

Em até 1099 px, o header contém menu, marca e o mesmo link contextual de WhatsApp que antes flutuava na tela. O elemento é movido, não clonado: URL, mensagem, atributos de tracking e listeners são mantidos. Acima desse limite, o menu fica horizontal e o WhatsApp retorna à posição flutuante original. O breakpoint existente foi preservado para acomodar as seis opções.

Os destinos e rótulos do menu continuam intactos. Com o menu mobile aberto, Tab entra nas opções; Escape fecha e devolve foco ao botão. Sair do menu com o foco ou clicar fora fecha a lista. Em telas baixas, a lista pode rolar dentro da altura disponível. Navegação desktop recebe alvos de ao menos 44 px e destaque visual para a página atual.

O aprimoramento é inicializado pelo JS existente. Sem JavaScript, o HTML comercial e os links originais permanecem; o menu mobile anterior também dependia de JS. Não se adicionou uma segunda integração de analytics.

## Validação visual e funcional

`scripts/check-ui-browser.mjs` usa Chrome headless local e CDP nativo do Node 24. Não instala pacotes. Bloqueia domínios de tracking e WhatsApp; os testes inspecionam o destino, sem enviar mensagens. Configure `CHROME_PATH` se necessário.

```sh
node scripts/check-ui-browser.mjs before nome-da-referencia
node scripts/check-ui-browser.mjs after nome-da-revisao
```

Os nomes identificam o estado local no momento da execução: o script não faz checkout histórico automaticamente. O diretório de saída é `docs/ui-<nome>` e um resultado existente não é sobrescrito. Os perfis temporários ficam em `.tmp/`, ignorado pelo Git.

A referência `ui-before` cobre 11 páginas locais nas sete larguras. `ui-after-final` inclui teclado real, resize e acessibilidade do landmark. `ui-after-shared` amplia a cobertura para 16 páginas que usam o CSS global, incluindo quatro Achadinhos e a página 404. Não inclui aprovação do fluxo interno do montador nem da página de links, que têm estilos próprios.
