# CLAUDE.md

Frontend de uma engine de animação (vídeo agora, jogo depois). Ler `docs/ARCHITECTURE.md` antes de mudar estrutura.

## Comandos

- `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` — todos devem passar antes de commit.
- E2E local: navegadores do Playwright não baixam nesta máquina; E2E roda no CI.

## Regras de camada (enforced por `eslint-plugin-boundaries`)

- `src/domain`: TS puro, **nenhum** pacote npm (nem zod, react, pixi, anime).
- `src/application`: domain + ports/use cases. Tipos expostos à UI em `AppContainer.ts`.
- `src/engine`: runtime compartilhado vídeo/jogo (clock, loop, modos).
- `src/infrastructure`: adapters (anime, pixi, dexie, opfs, mediabunny).
- `src/presentation`: React; nunca importa infrastructure nem `src/main`.
- `src/main`: composition root + entry; único lugar que conhece todas as camadas.
- Import entre camadas via alias `@/`.

## Convenções

- Clips de animação são JSON próprio no domínio; anime.js só aparece em `infrastructure/animation`.
- anime roda com `engine.useDefaultMainLoop = false`; Pixi com `autoStart: false`. Nosso loop dirige ambos (necessário para export determinístico).
- Tasks: `docs/tasks/M*.md` (fonte) espelhadas em GitHub Issues (`#n` no fim da linha). Marcar `[x]` e fechar issue ao concluir.
