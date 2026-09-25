---
name: new-usecase
description: Scaffold an application use case with its ports, fakes and tests, and expose it in AppContainer. Use when adding an application feature such as ImportPack, CreateProject or ExportVideo.
argument-hint: <UseCaseName>
---

# /new-usecase — use case da aplicação

Leia `src/application/CLAUDE.md` e `src/test/CLAUDE.md` antes.

## Passos

1. **Ports**: liste os ports de que o use case precisa. Para cada port que ainda não existe, crie:
   - `src/application/ports/<Port>.ts` (só a interface, documentada)
   - `src/test/fakes/<FakePort>.ts` + teste
   - `src/test/contracts/<port>.contract.ts`, rodada no teste do fake
2. **Use case** `src/application/usecases/<Name>.ts`:
   ```ts
   export function make<Name>(deps: { repo: SomeRepository; clock: Clock }) {
     return async function <name>(input: <Name>Input): Promise<Result<<Name>Output, <Name>Error>> {
       // valida entrada → domínio → ports
     }
   }
   ```
3. **Teste** `<Name>.test.ts` com fakes: sucesso, cada erro, efeitos nos fakes (o que foi e o que não foi persistido), entrada inválida.
4. **Expor à UI**: adicione ao tipo em `src/application/AppContainer.ts` e monte em `src/main/container.ts` com os adapters reais (se ainda não existirem, deixe o fake/adapter mínimo e registre a pendência na task).

## Regras

- Regra de negócio fica no domínio; o use case só orquestra.
- Nada de `vi.mock` de módulo: dependências entram por parâmetro.
