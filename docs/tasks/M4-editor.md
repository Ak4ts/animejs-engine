# M4 — Editor (hub & roteiro)

- [ ] **E4-1** `ui` Layout + rotas (TanStack Router): Hub, Library, Project editor (#24)
  - Testes: componente + E2E de navegação.
- [ ] **E4-2** `ui` Library browser: filtros por tipo/tag, preview animado de clips e transições (#25)
  - Testes: componente (filtros) + E2E.
- [ ] **E4-3** `ui` Script editor: shots, cast, drag de placement no stage (#26)
  - Testes: componente + E2E (criar shot, posicionar ator).
- [ ] **E4-4** `ui` Timeline: tracks por ator, drag/resize de ações, scrub, zoom, snapping (#27)
  - Testes: unit (snapping/zoom/conversão px↔ms) + componente + E2E drag.
- [ ] **E4-5** `ui` Inspector de propriedades e params de ação (#28)
  - Testes: componente.
- [ ] **E4-6** `app` Undo/redo (command pattern sobre use cases) (#29)
  - Testes: unit da pilha de comandos + property (`undo ∘ do` = identidade).
- [ ] **E4-7** `app` Autosave de projeto (IndexedDB, debounce) (#30)
  - Testes: unit do debounce com `FakeClock` + contract do repositório.
