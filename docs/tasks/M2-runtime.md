# M2 — Runtime núcleo

- [ ] **E2-1** `engine` `Clock` + `Loop` manual (anime `engine.useDefaultMainLoop = false`, Pixi `autoStart: false`) (#11)
- [ ] **E2-2** `infra` `AnimeRuntime`: `CompiledTimeline` → anime `createTimeline` (seek/play/pause/labels) (#12)
  - Aceite: `seek(t)` duas vezes no mesmo `t` → transforms idênticos (teste).
- [ ] **E2-3** `infra`/`ui` `PixiRenderer` + componente `<Stage>` (mount/unmount, resize, cleanup sem leaks) (#13)
- [ ] **E2-4** `infra` `SvgRigLoader`: SVG com `bone:*` / `slot:*` → hierarquia de `Container` + cache de `GraphicsContext` (#14)
- [ ] **E2-5** `infra` `SpriteSheetLoader`: frame escolhido por tempo da timeline (não pelo ticker) (#15)
- [ ] **E2-6** `engine` Câmera (pan/zoom/shake) + layers com parallax (#16)
- [ ] **E2-7** `infra` Transições: fade, wipe, zoom, filtro/shader Pixi (#17)
- [ ] **E2-8** `ui` Rota `/playground` para smoke visual (personagem + clip + scrub) (#18)
