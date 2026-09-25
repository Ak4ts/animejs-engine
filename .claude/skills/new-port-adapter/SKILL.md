---
name: new-port-adapter
description: Implement an infrastructure adapter for an application port, verified by the port's contract suite. Use when wiring a real library (anime.js, Pixi, Dexie, OPFS, mediabunny, HTTP) behind a port.
argument-hint: <PortName> <AdapterName>
---

# /new-port-adapter — adapter de infraestrutura

Leia `src/infrastructure/CLAUDE.md` antes.

## Passos

1. Confirme que o port existe em `src/application/ports/` e tem contract suite em `src/test/contracts/`. Se não tiver, crie os dois primeiro, junto com o fake.
2. Crie `src/infrastructure/<area>/<Adapter>.ts`, uma tradução fina entre o port e a lib, sem regra de negócio.
3. Teste `<Adapter>.test.ts`:
   - `<port>Contract('<Adapter>', () => harness)`: **obrigatório**.
   - Testes extras só para o que é específico do adapter (erros da lib, detecção de suporte).
   - Storage: `import 'fake-indexeddb/auto'`.
4. **Se depender de WebGL/canvas real** (Pixi): extraia a lógica pura para funções testáveis por unit; no arquivo que toca WebGL, coloque `// @no-unit-test: WebGL, coberto por e2e/visual/<spec>.spec.ts` e crie o spec visual com uma fixture (docs/TESTING.md → Regressão visual).
5. Registre o adapter em `src/main/container.ts`.

## Checklist

- [ ] Contract suite passa para o fake **e** para o adapter.
- [ ] Recurso de browser ausente → erro tipado, não crash.
- [ ] A lib só é importada dentro de `src/infrastructure/<area>`.
