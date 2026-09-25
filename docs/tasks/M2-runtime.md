# M2 — Runtime núcleo

- [ ] **E2-1** `engine` `Clock` + `Loop` manual (anime `engine.useDefaultMainLoop = false`, Pixi `autoStart: false`) (#11)
  - Testes: unit com `FakeClock` + property de determinismo.
- [ ] **E2-2** `infra` `AnimeRuntime`: `CompiledTimeline` → anime `createTimeline` (seek/play/pause/labels) (#12)
  - Aceite: `seek(t)` duas vezes no mesmo `t` → transforms idênticos (teste).
  - Testes: contract suite `AnimationRuntime` + property `seek(a); seek(t)` ≡ `seek(t)`.
- [ ] **E2-3** `infra`/`ui` `PixiRenderer` + componente `<Stage>` (mount/unmount, resize, cleanup sem leaks) (#13)
  - Testes: unit do `<Stage>` (mount/unmount/resize) com `Renderer` fake + visual via harness.
- [ ] **E2-4** `infra` `SvgRigLoader`: SVG com `bone:*` / `slot:*` → hierarquia de `Container` + cache de `GraphicsContext` (#14)
  - Testes: unit do parse de SVG → árvore de ossos (lógica pura) + visual de poses.
- [ ] **E2-5** `infra` `SpriteSheetLoader`: frame escolhido por tempo da timeline (não pelo ticker) (#15)
  - Testes: unit da seleção de frame por tempo + visual.
- [ ] **E2-6** `engine` Câmera (pan/zoom/shake) + layers com parallax (#16)
  - Testes: unit da matemática de câmera/parallax + visual.
- [ ] **E2-7** `infra` Transições: fade, wipe, zoom, filtro/shader Pixi (#17)
  - Testes: unit do progresso de cada transição + visual por transição.
- [ ] **E2-8** `ui` Rota `/playground` para smoke visual (personagem + clip + scrub) (#18)
  - Testes: E2E + visual.
