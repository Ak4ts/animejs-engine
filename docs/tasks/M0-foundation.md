# M0 — Fundação

- [x] **E0-1** `ci` Scaffold Vite + React 19.3 + TypeScript strict + pnpm (#1)
  - Aceite: `pnpm dev` sobe app; `pnpm build` gera `dist/`.
- [x] **E0-2** `ci` ESLint (flat config) + Prettier + `eslint-plugin-boundaries` (#2)
  - Aceite: import de `pixi.js`/`animejs`/`react` em `src/domain` falha no lint; regras da tabela em ARCHITECTURE.md aplicadas.
- [~] **E0-3** `ci` Vitest + Testing Library + Playwright (#3)
  - Aceite: `pnpm test` e `pnpm e2e` rodam com 1 teste exemplo cada.
- [~] **E0-4** `ci` GitHub Actions: lint, typecheck, test, build em PR/push na main (#4)
- [x] **E0-5** `docs` Estrutura de pastas das camadas + container DI + README + CLAUDE.md (#5)
