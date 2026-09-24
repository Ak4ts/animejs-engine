# Roadmap — animejs-engine

Engine de animação web (anime.js v4 + PixiJS v8 + React 19) para produzir vídeos a partir de um hub de cenários, personagens e animações pré-prontas. Evolução futura: modo jogo.

- Arquitetura: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Backend (projeto paralelo): [BACKEND.md](./BACKEND.md)
- Tasks detalhadas: [`docs/tasks/`](./tasks)

## Convenções de tracking

- Fonte da verdade: arquivos `docs/tasks/M*.md` (checkboxes). Espelho em GitHub Issues + Milestones.
- ID da task: `E<milestone>-<n>` (ex. `E2-4`). Backend: `B<n>`.
- Labels: `domain`, `app`, `infra`, `engine`, `ui`, `backend`, `docs`, `ci`.
- Status: `[ ]` pendente · `[~]` em andamento · `[x]` concluída. Ao fechar task, referenciar commit/PR.

## Milestones

| ID  | Nome                 | Objetivo                                                             | Arquivo                                 |
| --- | -------------------- | -------------------------------------------------------------------- | --------------------------------------- |
| M0  | Fundação             | Scaffold, lint com regras de camada, testes, CI                      | [M0](./tasks/M0-foundation.md)          |
| M1  | Domínio & schemas    | Entidades, value objects, schemas Zod, TimelineCompiler              | [M1](./tasks/M1-domain.md)              |
| M2  | Runtime núcleo       | Loop manual, AnimeRuntime, PixiRenderer, rig SVG, câmera, transições | [M2](./tasks/M2-runtime.md)             |
| M3  | Assets & Packs       | IndexedDB + OPFS, formato `.aepack`, pack built-in                   | [M3](./tasks/M3-assets-packs.md)        |
| M4  | Editor               | Hub, biblioteca, roteiro, timeline, inspector, undo/redo             | [M4](./tasks/M4-editor.md)              |
| M5  | Áudio & Export       | Mix de áudio, export MP4/WebM determinístico no cliente              | [M5](./tasks/M5-export.md)              |
| M6  | Game mode            | Fixed timestep, input, state machine, ECS-lite                       | [M6](./tasks/M6-game.md)                |
| M7  | Integração backend   | Schemas compartilhados, auth, catálogo remoto, sync                  | [M7](./tasks/M7-backend-integration.md) |
| B   | Backend (outro repo) | API de packs, assets, projetos                                       | [BACKEND](./BACKEND.md)                 |

## Caminho crítico do MVP (vídeo)

M0 → M1 → M2 (E2-1..E2-4) → M3 (E3-1..E3-4) → M4 (E4-1, E4-3, E4-4) → M5 (E5-3) = primeiro vídeo exportado a partir de um pack.
