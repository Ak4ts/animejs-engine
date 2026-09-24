# Animejs Engine

Engine de animação web para produzir vídeos a partir de um hub de cenários, personagens e animações pré-prontas — e, futuramente, jogos.

**Stack:** React 19 · TypeScript · anime.js v4 · PixiJS v8 · mediabunny (export no cliente) · Vite.

## Começando

```bash
pnpm install
pnpm dev          # app em http://localhost:5173
```

| Script           | Descrição                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| `pnpm lint`      | ESLint, incluindo regras de camada (`eslint-plugin-boundaries`)              |
| `pnpm typecheck` | `tsc -b`                                                                     |
| `pnpm test`      | Vitest (unit)                                                                |
| `pnpm e2e`       | Playwright. Use `PW_CHANNEL=chrome` ou `msedge` para usar um navegador local |
| `pnpm format`    | Prettier                                                                     |
| `pnpm build`     | build de produção                                                            |

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md): camadas, modelo de domínio, packs e runtime
- [Roadmap](docs/ROADMAP.md) e [tasks](docs/tasks/), espelhadas em GitHub Issues
- [Backend](docs/BACKEND.md): especificação do projeto paralelo
