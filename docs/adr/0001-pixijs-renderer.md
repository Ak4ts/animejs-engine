# ADR-0001: Usar PixiJS v8 (WebGL) como renderer

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

A engine precisa exportar vídeo frame a frame no browser e, no futuro, rodar jogos. O anime.js anima qualquer objeto JS, então o renderer é independente dele.

## Decisão

Renderizar em canvas com PixiJS v8. O anime.js anima propriedades de nodes Pixi através do adapter `AnimeRuntime`. Personagens SVG são carregados com `Graphics.svg()` e `GraphicsContext` cacheado.

## Consequências

- Positivas: captura de frames trivial para WebCodecs; performance de jogo; filtros/shaders para transições.
- Negativas: WebGL não roda em jsdom, então o render é testado por regressão visual no Playwright.
- Obriga: o código Pixi fica só em `src/infrastructure/render/pixi`, atrás do port `Renderer`.

## Alternativas consideradas

- DOM/SVG: autoria simples, mas o export de vídeo exigiria headless no backend e é fraco para jogo.
- Canvas2D próprio: sem dependência, mas batching, hit-test e filtros teriam de ser feitos na mão.
