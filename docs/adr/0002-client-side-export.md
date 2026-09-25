# ADR-0002: Exportar vídeo apenas no cliente (WebCodecs + mediabunny)

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

Renderizar vídeo no servidor exige infraestrutura de headless browser + ffmpeg e tem custo por minuto. O WebCodecs está disponível no Chrome/Edge 94+ e no Safari 16.4+.

## Decisão

O export acontece 100% no browser: o modo Render do engine faz seek frame a frame, o Pixi renderiza e o `CanvasSource` do mediabunny codifica (MP4 H.264/AV1, WebM). O áudio é mixado com `OfflineAudioContext`.

## Consequências

- Positivas: custo zero de infra de render; o backend fica simples (sem render server).
- Negativas: limitado pela máquina do usuário; exige detecção de suporte e fallback de codec.
- Obriga: o render precisa ser determinístico (ADR-0004).

## Alternativas consideradas

- Render no backend: determinístico e escalável, mas caro e com infra desde o dia 1.
- Cliente com fallback no backend: adiado; pode virar um ADR novo se vídeos longos ou 4K exigirem.
