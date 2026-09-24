---
name: new-entity
description: Scaffold a domain value object or entity with validated creation and property-based tests. Use when adding a type to src/domain (e.g. "create the TimeMs value object", "add the AnimationClip entity").
argument-hint: <Name> [value-object|entity] [folder]
---

# /new-entity — value object ou entidade de domínio

Leia `src/domain/CLAUDE.md` antes.

## Arquivos

- `src/domain/<folder>/<Name>.ts`
- `src/domain/<folder>/<Name>.test.ts`
- Se o objeto for usado em outros testes: builder em `src/test/builders/<name>.builder.ts` + arbitrary em `src/test/builders/arbitraries.ts`.

## Forma

```ts
// src/domain/shared/TimeMs.ts
export type TimeMs = number & { readonly __brand: 'TimeMs' }

export type TimeMsError =
  { kind: 'NegativeTime'; value: number } | { kind: 'NotFinite'; value: number }

export function timeMs(value: number): Result<TimeMs, TimeMsError> {
  if (!Number.isFinite(value)) return { ok: false, error: { kind: 'NotFinite', value } }
  if (value < 0) return { ok: false, error: { kind: 'NegativeTime', value } }
  return { ok: true, value: value as TimeMs }
}
```

- Tipos branded para primitivos com regra; objetos `readonly`.
- Construção validada que retorna `Result`; sem exceção em fluxo esperado.
- Operações são funções puras que retornam novas instâncias.

## Testes obrigatórios

1. Criação válida (casos típicos e limites).
2. **Cada** motivo de rejeição, com o `kind` do erro.
3. Property: para toda entrada válida gerada, a criação dá `ok`; invariantes das operações (ex. `add(a, b) >= a` para tempos não negativos).
4. Igualdade/serialização se existir.

Termine com `pnpm exec vitest related --run <arquivos>` verde e sem aviso de lint.
