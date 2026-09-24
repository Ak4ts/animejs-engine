# AGENTS.md

Guia operacional para agentes de IA (Claude Code, Codex, Cursor…) e humanos. Este projeto é **AI first**: a maior parte do código será escrita por modelos, então **testes, camadas e automação são a especificação executável**. Se algo não está testado, não está pronto.

## Missão

Engine de animação web: hub de cenários, personagens e animações pré-prontas → usuário roteiriza, organiza e exporta vídeo. Depois: modo jogo reaproveitando os mesmos assets.
Stack: React 19 · TypeScript strict · anime.js v4 · PixiJS v8 · mediabunny · Vite · Vitest · Playwright.

## Mapa do repositório

| Caminho                          | O que é                                                                   |
| -------------------------------- | ------------------------------------------------------------------------- |
| `src/domain/`                    | Regras de negócio puras. Sem pacotes npm. Determinístico.                 |
| `src/application/`               | Use cases + ports (interfaces). `AppContainer.ts` = o que a UI enxerga.   |
| `src/engine/`                    | Runtime compartilhado vídeo/jogo (clock, loop, modos). Determinístico.    |
| `src/infrastructure/`            | Adapters dos ports (anime, pixi, dexie, opfs, mediabunny, http).          |
| `src/presentation/`              | React. Fala só com use cases via `useContainer()`.                        |
| `src/main/`                      | Composition root + entry. Único lugar que conhece todas as camadas.       |
| `src/test/`                      | Builders, fakes, contract suites, fixtures. Nunca importado por produção. |
| `e2e/`                           | Playwright: jornadas e regressão visual.                                  |
| `scripts/`                       | Tooling do repo (com testes).                                             |
| `.claude/`                       | Hooks, skills e agents do Claude Code.                                    |
| `docs/ARCHITECTURE.md`           | Camadas, modelo de domínio, packs, runtime.                               |
| `docs/TESTING.md`                | **Como testar cada camada.** Leia antes de escrever código.               |
| `docs/adr/`                      | Decisões arquiteturais e o porquê delas.                                  |
| `docs/ROADMAP.md`, `docs/tasks/` | Tasks com IDs `E<m>-<n>`, espelhadas em GitHub Issues.                    |

Cada camada tem um `CLAUDE.md` próprio com regras locais — leia o da pasta onde vai mexer.

## Comandos

```bash
pnpm verify        # gate completo: format:check + lint + typecheck + check:tests + test:coverage
pnpm test          # vitest (app em jsdom + tooling em node)
pnpm exec vitest related --run <arquivos>   # só testes afetados
pnpm check:tests   # todo arquivo de produção tem teste irmão?
pnpm e2e           # Playwright (roda no CI; local precisa de browser — ver docs/TESTING.md)
pnpm tasks:sync    # cria issues para tasks novas em docs/tasks
```

## Fluxo de trabalho (toda task)

1. **Entender**: ler a task em `docs/tasks/M*.md` + issue (`gh issue view <n>`), ADRs relacionados e o `CLAUDE.md` da camada.
2. **Branch**: `feat/<ID>-<slug>` (ou `fix/`, `chore/`). Nunca commitar direto na `main`.
3. **Marcar** a task como `[~]` no markdown.
4. **TDD**: escrever o teste que falha → implementar o mínimo → refatorar. Tipos de teste por camada em `docs/TESTING.md`.
5. **Verificar**: `pnpm verify` verde.
6. **Revisar**: rodar os agents `test-auditor` e `architecture-reviewer` (Claude Code) ou revisar pelos checklists deles em `.claude/agents/`.
7. **Fechar**: marcar `[x]`, commit Conventional Commits com `Closes #<n>`, abrir PR.

No Claude Code, `/task <ID>` executa esse fluxo.

## Definition of Done

- [ ] Testes escritos junto com o código, cobrindo comportamento, bordas e erros (não só o caminho feliz).
- [ ] Tipo de teste certo para a camada (unit/property no domínio, fakes na aplicação, contrato nos adapters, visual no render).
- [ ] `pnpm verify` verde: cobertura mínima da camada respeitada.
- [ ] Nenhum `eslint-disable` / `@ts-expect-error` sem justificativa; nenhum `.only`/`.skip` esquecido.
- [ ] Camadas respeitadas (lint garante); ports novos têm contract suite em `src/test/contracts/`.
- [ ] Decisão arquitetural nova → ADR em `docs/adr/`. Mudança de estrutura → docs atualizadas.
- [ ] Task marcada `[x]` e issue referenciada no commit/PR.

## Regras invioláveis

1. **Domínio puro**: `src/domain` não importa nenhum pacote (nem zod, react, pixi, anime).
2. **Determinismo**: domínio e engine não usam `Math.random`, `Date.now`, `new Date()`, `performance`, timers ou rAF. Use os ports `Clock`/`Random` (ADR-0004). É isso que garante que o frame `t` do export seja sempre idêntico.
3. **Clips são dados**: animações são JSON do domínio; anime.js só aparece em `src/infrastructure/animation` (ADR-0003).
4. **Presentation não conhece infraestrutura**: use cases chegam via `useContainer()`; adapters são montados em `src/main/container.ts` (ADR-0005).
5. **Cobertura só sobe**: nunca reduzir thresholds em `vite.config.ts`. Falta teste → escreva o teste.
6. **Nada de burlar o gate**: não desabilitar regras de boundaries, não usar `@ts-ignore`, não usar `--no-verify`, não fazer force push.
7. **Arquivos pequenos**: < 300 linhas, funções simples. Dividir antes de crescer.
8. **Na dúvida sobre produto/UX**, pergunte ao humano; na dúvida técnica, siga os ADRs.

## Convenções

- Imports entre camadas via alias `@/`; relativos dentro do mesmo módulo.
- Nomes: `PascalCase` para tipos/classes/componentes, `camelCase` para funções/variáveis, arquivos com o nome do export principal (`TimelineCompiler.ts`).
- Testes ao lado do arquivo: `Foo.ts` → `Foo.test.ts`. Arquivo sem teste unitário possível → cabeçalho `// @no-unit-test: <motivo>` e cobertura por outro nível (visual/E2E).
- Comentários só para o **porquê** não óbvio. Código e comentários em inglês; docs e tasks em português.
- Commits: Conventional Commits (`feat(domain): ...`, `test(engine): ...`, `docs: ...`).
