# ADR-0003: Clips de animação são dados JSON do domínio, não código anime.js

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

O produto é um hub de animações pré-prontas distribuídas em packs. Elas precisam ser serializadas, versionadas, validadas, reaproveitadas entre personagens e usadas também no modo jogo.

## Decisão

`AnimationClip` é um tipo do domínio (`tracks[{ target, property, keyframes[{ t, value, ease }] }]`). O `TimelineCompiler` (domínio) gera uma `CompiledTimeline` plana, e só o adapter `AnimeRuntime` a traduz para anime.js. Clips referenciam ossos por nome e declaram um `skeletonProfile`.

## Consequências

- Positivas: packs portáveis e validáveis por schema; retarget entre personagens com o mesmo esqueleto; anime.js substituível; domínio testável sem browser.
- Negativas: uma camada de tradução a manter; recursos do anime.js que não existem no formato precisam ser adicionados ao formato primeiro.
- Obriga: `animejs` só é importado em `src/infrastructure/animation`.
