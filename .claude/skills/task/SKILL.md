---
name: task
description: Execute a roadmap task end to end (branch, TDD, verify, review, commit). Use when the user says "/task E1-5", "start task E2-4", "work on issue #12", or asks to implement an item from docs/tasks.
argument-hint: <task-id | #issue>
---

# /task — executar uma task do roadmap

Argumento: ID da task (`E1-5`) ou issue (`#12`). Sem argumento: liste as tasks `[ ]` do próximo milestone do caminho crítico (docs/ROADMAP.md) e pergunte qual.

## 1. Entender (não escreva código ainda)

1. Encontre a linha da task em `docs/tasks/M*.md` (`grep -n "\*\*<ID>\*\*" docs/tasks`) e o número da issue no fim `(#n)`.
2. `gh issue view <n>`: leia descrição e comentários.
3. Leia o `CLAUDE.md` de cada camada que vai tocar, os ADRs citados e `docs/TESTING.md`.
4. Se a task depende de outra ainda `[ ]`, avise o usuário antes de seguir.
5. Escreva um plano curto: arquivos a criar/alterar, **lista de testes** (comportamentos + bordas), ports novos. Tarefas grandes ou ambíguas: confirme o plano com o usuário.

## 2. Preparar

- `git checkout -b feat/<ID>-<slug>` a partir da `main` atualizada (ou `fix/`, `chore/`).
- Marque a task `[~]` no markdown.

## 3. TDD, em ciclos pequenos

Para cada comportamento da lista:

1. Escreva o teste e rode `pnpm exec vitest related --run <arquivo>`. Ele **deve falhar pelo motivo certo**.
2. Implemente o mínimo para passar.
3. Refatore mantendo verde.

Regras: tipo de teste certo para a camada (property no domínio, fakes na aplicação, contrato em adapters, visual no render). Port novo → fake + contract suite. Arquivo sem teste unitário possível → `// @no-unit-test: <motivo>` + teste visual/E2E.

## 4. Verificar

- `pnpm verify` precisa ficar verde. Não reduza coverage nem desabilite regras: escreva o teste que falta ou corrija o design.
- Se mudou arquitetura/decisão: `/adr`. Se mudou estrutura: atualize `docs/ARCHITECTURE.md`/`AGENTS.md`.

## 5. Revisar

Lance em paralelo os agents `test-auditor` e `architecture-reviewer` sobre o diff (`git diff main...HEAD`). Corrija o que for apontado como bloqueante e rode `pnpm verify` de novo.

## 6. Fechar

1. Marque `[x]` na task.
2. Commit Conventional Commits, corpo curto com o porquê e `Closes #<n>`.
3. Pergunte ao usuário se deve dar push e abrir o PR (`gh pr create`, usando o template com a checklist de DoD preenchida).
4. Resuma: o que foi feito, testes adicionados (quantidade/tipos), cobertura da camada, pendências.
