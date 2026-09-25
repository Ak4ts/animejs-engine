# ADR-0004: Loop manual e runtime determinístico

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

O export frame a frame (ADR-0002), os testes visuais e o futuro modo jogo precisam que o frame no tempo `t` seja sempre idêntico, independente da velocidade da máquina ou do histórico de interação.

## Decisão

- anime.js roda com `engine.useDefaultMainLoop = false` e Pixi com `autoStart: false`. O `Loop` do engine dirige ambos (`seek`/`update` + `render`).
- Tempo e aleatoriedade entram por ports (`Clock`, `Random`). Domínio e engine nunca leem o relógio nem geram números aleatórios diretamente.

## Consequências

- Positivas: export reproduzível, testes visuais estáveis, replays e fixed timestep no jogo.
- Negativas: todo código com tempo precisa receber um `Clock`.
- Obriga: lint proíbe `Math.random`, `Date.now`, `new Date()`, `performance`, timers e rAF em `src/domain` e `src/engine`. Os testes usam `FakeClock`/`SeededRandom`. Invariante testado: `seek(a); seek(t)` ≡ `seek(t)`.
