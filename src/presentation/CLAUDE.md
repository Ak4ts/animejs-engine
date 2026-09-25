# src/presentation — React

**Pode importar:** `domain`, `application`, `engine`, `presentation`, pacotes npm. **Nunca** `infrastructure` nem `main` (lint barra).

## Estrutura

- `app/`: shell, rotas, providers (`ContainerContext`).
- `features/<feature>/`: telas por feature (hub, library, script-editor, timeline, stage, export). Cada feature tem componentes, hooks e store própria.
- `components/`: componentes visuais reutilizáveis, sem estado de negócio.

## Padrões

- Use cases via `useContainer()`; nunca instancie adapters aqui.
- Estado de UI/editor em Zustand, uma store por feature. Estado de negócio vem dos use cases.
- `<Stage>` é o único componente que monta canvas, via port `Renderer`.
- React 19: `use(Context)`, `ref` como prop, Actions/`useActionState` para formulários.
- Acessibilidade: elementos interativos com papel e nome acessíveis, que também são o que os testes consultam.

## Testes (cobertura mínima 70%)

- Testing Library por papel/texto (`getByRole`, `getByLabelText`); `user-event` para interação.
- Renderize com um `AppContainer` de teste montado com fakes (`src/test/fakes`).
- Teste o que o usuário vê e faz, não o estado interno nem nomes de classe CSS.
- Canvas/Pixi: coberto por regressão visual no Playwright, não em jsdom.
