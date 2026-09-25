# M6 — Game mode (exploratório)

- [ ] **E6-1** `engine` Fixed-timestep loop + modo Game (update 60 Hz, render interpolado) (#36)
  - Testes: property: N updates por intervalo, independente do tamanho dos frames.
- [ ] **E6-2** `engine` Input (teclado, gamepad, touch) com action mapping (#37)
  - Testes: unit de action mapping com eventos sintéticos.
- [ ] **E6-3** `engine` `AnimationStateMachine` (idle/walk/jump, crossfade de clips) (#38)
  - Testes: unit + property (só transições válidas, crossfade soma 1).
- [ ] **E6-4** `engine` ECS-lite + colisão AABB (#39)
  - Testes: unit + property (colisão AABB simétrica, sem falso positivo).
- [ ] **E6-5** `ui` Protótipo jogável com o pack `core` (#40)
  - Testes: E2E com input simulado + visual.
- [ ] **E6-6** `infra` Export de jogo como bundle web estático (#41)
  - Testes: E2E sobre o bundle exportado.
