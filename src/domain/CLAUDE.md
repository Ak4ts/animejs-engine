# src/domain — regras de negócio puras

**Pode importar:** apenas `src/domain`. Nenhum pacote npm (nem zod, react, pixi, anime, lodash).
**Determinístico:** proibido `Math.random`, `Date.now`, `new Date()`, `performance`, timers, rAF (lint barra). Tempo e aleatoriedade chegam como parâmetros.

## O que vive aqui

- **Value objects** (`shared/`): `TimeMs`, `Vec2`, `Color`, `Easing`, `SemVer`, `Id`. Imutáveis, validados na criação: não existe instância inválida.
- **Entidades**: `Pack`, `Asset`, `Character`, `Skeleton`, `AnimationClip`, `Scenario`, `Transition`, `Project/Sequence/Shot`.
- **Domain services**: lógica que cruza entidades, como `TimelineCompiler`.
- **Migrators** de `schemaVersion` (funções puras `vN → vN+1`).

## Padrões

- Prefira **dados imutáveis + funções puras** a classes com estado. Classe só quando houver invariante a proteger.
- Criação validada retorna resultado explícito em vez de lançar exceção em fluxo esperado:
  ```ts
  export type Result<T, E = DomainError> = { ok: true; value: T } | { ok: false; error: E }
  ```
- Erros de domínio são tipos (`{ kind: 'InvalidDuration', value }`), não strings soltas.
- Nada de I/O, nada de async.

## Testes (cobertura mínima 95%)

- Unit para cada regra + **property-based (fast-check)** para invariantes: idempotência, ordem, limites, round-trip de serialização.
- Builders em `src/test/builders`; arbitraries em `src/test/builders/arbitraries.ts`.
- Todo value object testa: criação válida, cada rejeição, igualdade.
