# src/infrastructure — adapters

**Pode importar:** `domain`, `application`, `engine`, `infrastructure`, pacotes npm. **Não** importa `presentation` nem `main`.

## O que vive aqui

| Pasta              | Adapter                                             | Port                           |
| ------------------ | --------------------------------------------------- | ------------------------------ |
| `animation/anime/` | `AnimeRuntime`: `CompiledTimeline` → anime timeline | `AnimationRuntime`             |
| `render/pixi/`     | `PixiRenderer`, `SvgRigLoader`, `SpriteSheetLoader` | `Renderer`, loaders            |
| `storage/`         | Dexie, OPFS blob store, leitor/escritor `.aepack`   | `PackRepository`, `BlobStore`… |
| `export/`          | `MediabunnyEncoder`, `OfflineAudioMixer`            | `VideoEncoder`, `AudioMixer`   |
| `api/`             | Cliente HTTP do backend (M7)                        | repositórios HTTP              |

## Padrões

- Adapter é fino: traduz entre o port e a lib. Nenhuma regra de negócio aqui.
- Toda dependência de browser (IndexedDB, OPFS, WebCodecs, WebGL) fica atrás de um port, para que o resto seja testável em node/jsdom.
- Detectar suporte (`'VideoEncoder' in globalThis`) e retornar erro tipado em vez de quebrar.

## Testes (cobertura mínima 80%)

- **Contract test obrigatório**: o adapter roda a mesma suíte do port que o fake (`src/test/contracts/<port>.contract.ts`).
- Storage: `fake-indexeddb` (`import 'fake-indexeddb/auto'` no teste).
- anime.js roda em jsdom animando objetos JS puros; testar `seek(t)` → valores esperados.
- Pixi/WebGL não roda em jsdom: marque `// @no-unit-test: WebGL, coberto por e2e/visual/<spec>` e crie o teste visual (docs/TESTING.md). Isole a lógica pura (parse de SVG, cálculo de hierarquia) em funções testáveis por unit.
