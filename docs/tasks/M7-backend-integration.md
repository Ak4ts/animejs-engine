# M7 — Integração com backend

Depende de B0–B5 em [BACKEND.md](../BACKEND.md).

- [ ] **E7-1** `app` Extrair schemas para pacote compartilhado `@engine/schemas` (#42)
  - Testes: unit dos schemas compartilhados (mesmos fixtures do front).
- [ ] **E7-2** `infra` Auth client + sessão (refresh token) (#43)
  - Testes: contract + unit de refresh com `FakeClock`.
- [ ] **E7-3** `infra` `HttpPackRepository` + cache OPFS (#44)
  - Testes: contract suite `PackRepository` contra servidor fake.
- [ ] **E7-4** `ui` Catálogo remoto no Hub (busca, instalar pack) (#45)
  - Testes: componente + E2E com API fake.
- [ ] **E7-5** `app` Sync de projetos cloud (conflito: last-write-wins + versão) (#46)
  - Testes: unit + property da resolução de conflito.
- [ ] **E7-6** `ui` Upload/compartilhamento de exports (#47)
  - Testes: componente + E2E.
