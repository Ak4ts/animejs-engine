# M3 — Assets & Packs

- [ ] **E3-1** `infra` Dexie (`packs`, `assets`, `clips`, `projects`) + `OpfsBlobStore` endereçado por sha-256 (#19)
  - Testes: contract suites dos repositórios/blob store (`fake-indexeddb`).
- [ ] **E3-2** `infra` `PackZipReader`/`Writer` para `.aepack` + validação de manifest (#20)
  - Testes: unit round-trip write → read + fixtures inválidas (manifest ruim, hash divergente).
- [ ] **E3-3** `app` Use cases: `ImportPack`, `RemovePack`, `ListLibrary`, `ResolveAsset` (#21)
  - Testes: use cases com fakes (sucesso, cada erro, efeitos).
- [ ] **E3-4** `docs`/`infra` Pack built-in `core`: 2 cenários, 2 personagens `humanoid-v1`, ~10 clips (idle, walk, run, wave, talk, jump, sit, point, surprised, nod), 4 transições (#22)
  - Testes: teste que valida o pack `core` inteiro contra o schema + visual de preview.
- [ ] **E3-5** `docs` Guia de autoria de rig SVG (ossos, pivôs, slots, export do Figma/Inkscape) (#23)
  - Testes: exemplo do guia usado como fixture em teste do `SvgRigLoader`.
