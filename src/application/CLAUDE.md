# src/application — use cases e ports

**Pode importar:** `src/domain`, `src/application`, pacotes npm (ex. zod para validar entrada externa).

## O que vive aqui

- `ports/`: interfaces que o mundo externo implementa (`Clock`, `Random`, `PackRepository`, `Renderer`, `AnimationRuntime`, `VideoEncoder`…). Só tipos, sem implementação.
- `usecases/`: um arquivo por use case (`ImportPack.ts`). Recebe ports no construtor/fábrica e expõe um único `execute(input)`.
- `AppContainer.ts`: o que a UI pode chamar. Todo use case novo que a UI usa entra aqui.
- Schemas Zod de dados externos (manifest, clip, project) e conversão schema → domínio.

## Padrões

```ts
export function makeImportPack(deps: { packs: PackRepository; blobs: BlobStore }) {
  return async function importPack(file: Blob): Promise<Result<PackSummary, ImportPackError>> {
    // orquestra: valida → chama domínio → persiste via ports
  }
}
```

- Use case orquestra; regra de negócio fica no domínio.
- Retorne `Result` para falhas esperadas; exceção só para bug.
- Port novo: crie também o fake em `src/test/fakes/` e a contract suite em `src/test/contracts/`.

## Testes (cobertura mínima 90%)

- Teste cada use case com **fakes** (nunca adapters reais, nunca `vi.mock` de módulo).
- Cubra: sucesso, cada erro esperado, e efeitos nos fakes (o que foi salvo e o que não foi).
