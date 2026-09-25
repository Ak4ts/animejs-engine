# Arquitetura

Baseada em clean architecture aplicada ao frontend (ver [Khalil Stemmler — Organizing App Logic](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic)). Domínio no centro, estável; UI, render, animação e storage são adapters voláteis que dependem do domínio — nunca o contrário.

## Stack

Vite · React 19.3 · TypeScript strict · Zustand · TanStack Router · Zod · Dexie (IndexedDB) + OPFS · PixiJS 8 · anime.js 4 · mediabunny · Vitest · Playwright · ESLint + `eslint-plugin-boundaries` · pnpm.

## Camadas

```
src/
  domain/          puro TS. Zero deps (sem react, pixi, anime, zod).
  application/     use cases (commands/queries) + ports (interfaces).
  infrastructure/  adapters concretos dos ports (anime, pixi, dexie, opfs, mediabunny, http).
  engine/          runtime compartilhado vídeo/jogo: Clock, Loop, modos Editor/Render/Game.
  presentation/    React: rotas, features, componentes, stores (Zustand).
  main/            composition root + entry point: monta adapters e injeta use cases na UI.
```

Regra de dependência (enforced por lint):

| Camada         | Pode importar                                                                |
| -------------- | ---------------------------------------------------------------------------- |
| domain         | domain                                                                       |
| application    | domain, application                                                          |
| engine         | domain, application, engine                                                  |
| infrastructure | domain, application, engine, infrastructure                                  |
| presentation   | domain, application, engine, presentation                                    |
| main           | todas (único ponto que conhece infrastructure e presentation ao mesmo tempo) |

Presentation fala com use cases via `AppContainer` (tipo em `application/`, instância criada em `main/`). Só `<Stage>` monta o canvas, via port `Renderer`.

## Modelo de domínio

- **Pack**: `id, name, version (semver), author, license, engineVersion, schemaVersion, contents[]`.
- **Asset**: `Image | Svg | SpriteSheet | Audio | Font`, endereçado por `sha-256`.
- **Character**: `visual: SvgRig | SpriteSheet`, `skeletonProfile` (ex. `humanoid-v1`), `defaultPose`, `slots`.
- **Skeleton/Bone**: árvore `Bone { name, parent, pivot, rest }`.
- **AnimationClip** (agnóstico de engine): `duration, loop, targetKind, skeletonProfile?, tracks[{ target, property, keyframes[{ t, value, ease }] }]`.
- **Scenario**: camadas com parallax, props animáveis, clips ambientes.
- **Transition**: clip aplicado entre dois shots (`from`, `to`, `duration`).
- **Project → Sequence → Shot[]**: Shot = `scenario, cast[], actions[{ actor, clipRef, startMs, params }], camera[], audio[], transitionOut`.
- **TimelineCompiler** (domain service): Project → `CompiledTimeline` (tracks absolutas, planas). Puro e testável; infra só traduz para anime.

> Clips são JSON próprio, não código anime: serializáveis em packs, validáveis, portáveis para o modo jogo, e a lib de tween é substituível.

## Rig SVG — convenções

- Cada osso é um `<g id="bone:<nome>" data-pivot="x,y">`; hierarquia do SVG = hierarquia do esqueleto.
- Slots trocáveis: `<g id="slot:<nome>" data-variant="<variante>">`.
- Loader converte cada grupo em `Container` Pixi; partes vetoriais via `Graphics.svg()` com `GraphicsContext` cacheado.
- Clips referenciam ossos por nome → mesmo clip serve para todo personagem com o mesmo `skeletonProfile`.

## Assets & Packs

- Distribuição: `.aepack` (zip) = `manifest.json` + `assets/<sha256>.<ext>` + `clips/*.json` + `thumbs/`.
- Local (offline-first): metadados em IndexedDB (Dexie: `packs`, `assets`, `clips`, `projects`); blobs em OPFS por hash (dedupe).
- Projetos guardam só referências `packId@version/assetId`.
- Packs built-in em `public/packs/`, instalados no primeiro boot.
- `schemaVersion` em manifests/projetos + migrators puros no domínio.
- Backend futuro: `HttpPackRepository` implementa o mesmo port, com cache OPFS.

## Runtime — 3 modos, 1 núcleo

Sempre `engine.useDefaultMainLoop = false` (anime) e `autoStart: false` (Pixi). Nosso `Loop` chama `engine.update()` / `timeline.seek()` e `app.render()`.

1. **Editor**: rAF → `timeline.seek(clock.now)`; scrub/play/pause pela UI.
2. **Render** (export): para cada frame `f`: `seek(f * 1000 / fps)` → `app.render()` → `CanvasSource.add(t, 1/fps)` (mediabunny). Determinístico, independente da máquina. Áudio mixado por `OfflineAudioContext`.
3. **Game** (futuro): fixed timestep (60 Hz) + render interpolado; `AnimationStateMachine` toca clips (idle/walk/attack) com crossfade; sistemas Input, Collision (AABB), ECS-lite, Camera follow. Reaproveita Character/Rig/Clip/Pack do hub.
