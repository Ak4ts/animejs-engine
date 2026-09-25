# Estratégia de testes

Projeto AI first: **o teste é a especificação**. Um modelo lê os testes para entender o comportamento esperado e os roda para provar que entregou. Por isso todo código de produção tem teste, e o tipo de teste depende da camada.

## Pirâmide por camada

| Camada                                 | Tipo principal                                             | Ferramentas                   | Cobertura mínima |
| -------------------------------------- | ---------------------------------------------------------- | ----------------------------- | ---------------- |
| `domain`                               | Unit + **property-based** (invariantes)                    | Vitest + fast-check           | 95%              |
| `application`                          | Use cases com **fakes in-memory** dos ports                | Vitest + `src/test/fakes`     | 90%              |
| `engine`                               | Loop/clock com `FakeClock`; **determinismo**               | Vitest                        | 80%              |
| `infrastructure`                       | **Contract tests** (mesma suíte para todo adapter do port) | Vitest + `fake-indexeddb`     | 80%              |
| `presentation`                         | Componentes e hooks pelo comportamento visível             | Vitest + Testing Library      | 70%              |
| Render (Pixi/WebGL)                    | **Regressão visual** de frames determinísticos             | Playwright `toHaveScreenshot` | —                |
| Fluxos                                 | Jornadas E2E                                               | Playwright                    | —                |
| Tooling (`scripts/`, `.claude/hooks/`) | Unit das funções puras                                     | Vitest (projeto `tooling`)    | —                |

Branches têm limite 5 pontos abaixo. Os limites estão em `vite.config.ts` e **só podem subir** (um hook bloqueia a redução).

## Regras

1. **Teste irmão obrigatório**: `Foo.ts` → `Foo.test.ts` (`pnpm check:tests`). Isentos: `index.ts`, `.d.ts`, módulos só de tipos. Se o teste unitário for impossível (ex. adapter WebGL), coloque `// @no-unit-test: <motivo>` no topo e cubra por visual/E2E.
2. **Teste comportamento, não implementação**: asserts sobre saídas e efeitos observáveis. Não asserte chamadas internas nem estrutura privada.
3. **Fakes > mocks**: use os fakes de `src/test/fakes` (implementam o port de verdade). `vi.fn()`/`vi.spyOn` só para observar bordas externas (console, callbacks da UI).
4. **Determinismo**: nada de tempo real nem aleatoriedade nos testes. `FakeClock`, `SeededRandom` e seeds fixas no fast-check quando um caso falhar (`fc.assert(prop, { seed })`).
5. **Um comportamento por `it`**, com título descrevendo a regra (`'rejects negative durations'`). Use `it.each` para tabelas de casos.
6. **Bordas sempre**: vazio, zero, negativo, limites, erro, duplicado, ordem.
7. **Nunca** commitar `.only`; `.skip` só com issue referenciada.

## Padrões

### Property-based (domínio)

Para invariantes que valem para qualquer entrada: "compilar um projeto nunca gera track com tempo negativo", "seek(t) é idempotente", "serializar → desserializar = identidade".

```ts
fc.assert(
  fc.property(arbitraryProject(), (project) => {
    const timeline = compileTimeline(project)
    expect(timeline.tracks.every((t) => t.startMs >= 0)).toBe(true)
  }),
)
```

Arbitraries reutilizáveis ficam em `src/test/builders/arbitraries.ts`.

### Test data builders

`src/test/builders/`: `aClip().withDuration(500).build()`. Valores padrão válidos; o teste só declara o que importa para ele.

### Contract tests (ports)

Todo port com mais de uma implementação (fake + adapter real) tem uma suíte em `src/test/contracts/<port>.contract.ts`. Cada implementação chama a suíte no próprio teste. Exemplo real: `clock.contract.ts`, usado por `FakeClock.test.ts`.

```ts
clockContract('RafClock', () => {
  const clock = new RafClock(fakeRaf)
  return { clock, advance: (ms) => fakeRaf.step(ms) }
})
```

### Regressão visual (render)

O render é determinístico (`seek(t)` → mesmo frame), então é testado por screenshot:

1. Rota dev-only `/__harness/:fixture?t=<ms>` monta o stage com uma fixture de `src/test/fixtures` e faz seek para `t`.
2. `e2e/visual/*.spec.ts` captura `toHaveScreenshot()` em tempos-chave.
3. As baselines são geradas **no CI (Linux)**: workflow `update-snapshots` (Actions → Run workflow). Nunca gere baseline no Windows local, porque a fonte e o antialias diferem.

### Presentation

Testing Library por papel/texto acessível (`getByRole`). `user-event` para interação. Use cases entram por um `AppContainer` de teste com fakes.

## Comandos

```bash
pnpm test                               # tudo
pnpm test:coverage                      # com limites por camada
pnpm exec vitest related --run <files>  # só afetados
pnpm exec vitest --project app          # só src/
pnpm check:tests                        # pares arquivo/teste
pnpm e2e                                # Playwright
```
