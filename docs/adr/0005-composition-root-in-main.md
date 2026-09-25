# ADR-0005: Composition root em `src/main`

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

A presentation não deve conhecer adapters, mas alguém precisa montá-los. O `eslint-plugin-boundaries` v7 classifica camadas por pasta, não por arquivo solto.

## Decisão

`src/main/` contém o entry point (`main.tsx`) e o `container.ts`, que instancia adapters e monta os use cases. É a única camada que pode importar todas as outras. O tipo `AppContainer` fica em `src/application/AppContainer.ts`, e a presentation o consome via `useContainer()`.

## Consequências

- Positivas: trocar Dexie por HTTP (M7) ou fakes nos testes muda um único ponto; a UI é testável com um container de fakes.
- Obriga: `presentation` nunca importa `infrastructure` nem `main` (lint).
