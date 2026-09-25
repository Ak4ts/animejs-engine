## Task

Closes #<!-- issue --> · `<!-- E?-? -->`

## O que muda e por quê

<!-- 2–4 linhas. Decisão arquitetural nova? Link para o ADR. -->

## Testes

<!-- Quais comportamentos passaram a ser testados e com que tipo (unit, property, contract, visual, E2E). -->

## Definition of Done

- [ ] Testes junto com o código, cobrindo bordas e erros (não só o caminho feliz)
- [ ] Tipo de teste certo para a camada (`docs/TESTING.md`)
- [ ] `pnpm verify` verde localmente (cobertura da camada respeitada)
- [ ] Sem `eslint-disable`/`@ts-expect-error` sem justificativa, sem `.only`/`.skip`
- [ ] Port novo tem fake + contract suite
- [ ] ADR/docs atualizados se mudou decisão ou estrutura
- [ ] Task marcada `[x]` em `docs/tasks`
- [ ] Revisado por `test-auditor` e `architecture-reviewer` (se feito por IA)
