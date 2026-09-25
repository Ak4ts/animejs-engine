@AGENTS.md

# Notas específicas do Claude Code

## Hooks ativos (`.claude/settings.json`)

| Evento                     | Script                | Efeito                                                                                                          |
| -------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| SessionStart               | `session-context.mjs` | Injeta branch, tasks `[~]` e status do último check.                                                            |
| UserPromptSubmit           | `inject-state.mjs`    | Se o check do fim do turno anterior falhou, injeta os erros — **corrija-os primeiro**.                          |
| PreToolUse Edit/Write      | `guard-edit.mjs`      | Bloqueia lockfile/dist/.env, `.only`, `@ts-ignore`, disable sem motivo, disable de boundaries, baixar coverage. |
| PreToolUse Bash/PowerShell | `guard-bash.mjs`      | Bloqueia force push, push na main, `--no-verify`, `rm -rf` fora de pastas geradas.                              |
| PostToolUse Edit/Write     | `post-edit.mjs`       | Prettier + ESLint no arquivo; erros voltam para você na hora. Lembra de teste irmão faltando.                   |
| Stop                       | `stop-check.mjs`      | Se `src/` mudou: typecheck + testes relacionados + check:tests. Só avisa (não bloqueia).                        |

As regras ficam em `.claude/hooks/lib/rules.mjs` e são testadas em `rules.test.mjs`. Para mudar uma regra, mude o teste primeiro. Um bloqueio do guardrail é informação: corrija a abordagem, não tente contornar.

## Skills (`.claude/skills/`)

- `/task <ID>`: executa uma task do roadmap de ponta a ponta (branch → TDD → verify → revisão → commit).
- `/new-entity`, `/new-usecase`, `/new-port-adapter`: scaffolding com teste no padrão da camada.
- `/adr <título>`: registra uma decisão arquitetural.
- `/verify`: roda o gate completo e resume as falhas.

## Agents (`.claude/agents/`)

- `test-auditor`: revisa a qualidade dos testes do diff. Rodar antes de todo commit de feature.
- `architecture-reviewer`: revisa camadas, ports, determinismo e se precisa de ADR.

## Ambiente local (Windows)

- Os browsers do Playwright não baixam nesta máquina, então o E2E roda no CI. Localmente: `PW_CHANNEL=chrome|msedge pnpm e2e` se houver navegador instalado.
- O pnpm 12 bloqueia build scripts; aprovações ficam em `pnpm-workspace.yaml` (`allowBuilds`).
