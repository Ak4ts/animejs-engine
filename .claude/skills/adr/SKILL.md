---
name: adr
description: Record an architectural decision as a numbered ADR in docs/adr. Use when a task introduces or changes a technical decision (new library, layer rule, data format, testing policy) or the user asks to document a decision.
argument-hint: <título da decisão>
---

# /adr — registrar decisão arquitetural

1. Próximo número: maior `docs/adr/NNNN-*.md` + 1 (4 dígitos).
2. Copie `docs/adr/0000-template.md` para `docs/adr/NNNN-<slug-kebab>.md`.
3. Preencha em português, de forma curta: contexto (forças reais), decisão (direta), consequências (incluindo o que obriga no código: lint, testes, camadas) e alternativas consideradas.
4. Se substitui um ADR anterior, mude o status do antigo para `substituído por ADR-NNNN`.
5. Se a decisão cria uma regra verificável, implemente a regra (lint/hook/teste) no mesmo PR e cite-a no ADR.
6. Referencie o ADR no `CLAUDE.md` da camada afetada, se ele mudar como o código é escrito ali.
