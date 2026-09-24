# src/test — suporte a testes

Importado só por arquivos `*.test.ts(x)`; código de produção nunca importa daqui (lint barra).

| Pasta        | Conteúdo                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fakes/`     | Implementações in-memory **reais** dos ports (`FakeClock`, `SeededRandom`, repositórios). Cada fake tem teste e passa na contract suite do seu port. |
| `contracts/` | `<port>.contract.ts`: suíte que todo adapter do port roda. Exporta `xContract(name, makeHarness)`.                                                   |
| `builders/`  | Test data builders (`aClip()`) com defaults válidos + arbitraries fast-check (`arbitraries.ts`).                                                     |
| `fixtures/`  | Arquivos de exemplo: SVG rig `humanoid-v1`, clips JSON, manifests `.aepack`.                                                                         |
| `setup.ts`   | Setup global do Vitest (jest-dom).                                                                                                                   |

## Regras

- Fake não é mock: ele implementa o comportamento do port, de forma simples e determinística.
- Port novo → fake + contract suite no mesmo PR.
- Builder novo quando o mesmo objeto de teste aparecer em mais de um arquivo.
