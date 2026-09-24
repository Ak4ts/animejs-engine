# Animejs Engine

Engine de animação web para produzir vídeos a partir de um hub de cenários, personagens e animações pré-prontas — e, futuramente, jogos.

**Stack:** React 19 · TypeScript · anime.js v4 · PixiJS v8 · mediabunny (export no cliente) · Vite.

Projeto **AI first**: a maior parte do código é escrita por agentes, com testes, camadas e guardrails automáticos definindo o que é "pronto". Comece por [`AGENTS.md`](AGENTS.md).

## Começando

```bash
pnpm install
pnpm dev          # app em http://localhost:5173
pnpm verify       # gate completo antes de abrir PR
```

| Script               | Descrição                                                                    |
| -------------------- | ---------------------------------------------------------------------------- |
| `pnpm verify`        | format:check + lint + typecheck + check:tests + test:coverage                |
| `pnpm lint`          | ESLint: camadas, determinismo, strict type-checked                           |
| `pnpm typecheck`     | `tsc -b`                                                                     |
| `pnpm test`          | Vitest (projetos `app` e `tooling`)                                          |
| `pnpm test:coverage` | Vitest com limites de cobertura por camada                                   |
| `pnpm check:tests`   | Todo arquivo de produção tem teste irmão                                     |
| `pnpm e2e`           | Playwright. Use `PW_CHANNEL=chrome` ou `msedge` para usar um navegador local |
| `pnpm tasks:sync`    | Cria issues no GitHub para tasks novas em `docs/tasks`                       |
| `pnpm format`        | Prettier                                                                     |
| `pnpm build`         | Build de produção                                                            |

## Documentação

- [AGENTS.md](AGENTS.md): guia operacional, fluxo de task e Definition of Done
- [Arquitetura](docs/ARCHITECTURE.md): camadas, modelo de domínio, packs e runtime
- [Testes](docs/TESTING.md): o que e como testar em cada camada
- [ADRs](docs/adr/): decisões arquiteturais
- [Roadmap](docs/ROADMAP.md) e [tasks](docs/tasks/), espelhadas em GitHub Issues
- [Backend](docs/BACKEND.md): especificação do projeto paralelo
