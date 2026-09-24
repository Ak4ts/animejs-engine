# src/engine — runtime compartilhado (vídeo e jogo)

**Pode importar:** `src/domain`, `src/application`, `src/engine`, pacotes npm.
**Determinístico:** mesmas proibições do domínio (lint barra). Tempo vem de `Clock`, aleatoriedade de `Random`.

## O que vive aqui

- `Loop`: dirige o tick manualmente. anime.js roda com `engine.useDefaultMainLoop = false` e Pixi com `autoStart: false` (ADR-0004).
- Modos: **Editor** (realtime, scrub), **Render** (frame a frame para export), **Game** (fixed timestep, futuro).
- Câmera, `AnimationStateMachine` (jogo), sistemas de input/colisão (jogo).

O engine fala com anime/Pixi **só pelos ports** (`AnimationRuntime`, `Renderer`); as implementações ficam em `infrastructure`.

## Invariante central

> Para qualquer `t`, `seek(t)` produz exatamente o mesmo estado, independente do histórico (play, scrub, seeks anteriores).

É isso que torna o export reproduzível e o teste visual possível. Todo código daqui deve preservar isso.

## Testes (cobertura mínima 80%)

- `FakeClock` para avançar o tempo; nunca espere tempo real.
- Teste de determinismo obrigatório para qualquer coisa que dependa de tempo: `seek(a); seek(t)` ≡ `seek(t)` (property test com `a`, `t` arbitrários).
- Fixed timestep: N updates para o mesmo intervalo, independente do tamanho dos frames.
