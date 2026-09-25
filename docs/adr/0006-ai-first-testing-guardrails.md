# ADR-0006: Desenvolvimento AI first com testes e guardrails automáticos

- **Status:** aceito
- **Data:** 2026-09-24

## Contexto

A maior parte do código será escrita por modelos de IA. Modelos erram de forma plausível: código que parece certo, testes que não testam nada, atalhos para passar no gate. O humano revisa por amostragem, não linha a linha.

## Decisão

1. **Teste é especificação**: todo arquivo de produção tem teste irmão (`check:tests`) e cobertura mínima por camada que só sobe (domain 95, application 90, engine/infra 80, presentation 70).
2. **Guardrails executáveis, não só documentados**: lint de camadas, determinismo, strict type-checked, disable com justificativa, sem `.only`.
3. **Hooks do Claude Code**: bloqueiam atalhos (lockfile, `@ts-ignore`, baixar coverage, force push), dão feedback de lint na hora e checam o turno ao final (só avisam, por decisão do time).
4. **Contexto em camadas**: `AGENTS.md` (geral) + `CLAUDE.md` por pasta + ADRs + `docs/TESTING.md`.
5. **Revisão por agents** (`test-auditor`, `architecture-reviewer`) antes de commit de feature.
6. **Sem git hooks locais**: o CI (`pnpm verify` + E2E) é a trava final.

## Consequências

- Positivas: o modelo sabe o que é "pronto" sem perguntar; regressões são pegas cedo; o humano revisa intenção, não sintaxe.
- Negativas: mais atrito para mudanças rápidas; o custo de manter os próprios guardrails (que também têm testes).
- Obriga: mudar uma regra de guardrail exige mudar o teste dela (`.claude/hooks/lib/rules.test.mjs`) e, se mudar a política, um ADR novo.
