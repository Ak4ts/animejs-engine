---
name: verify
description: Run the full quality gate (format, lint, typecheck, test pairing, tests with coverage) and summarize failures with fixes. Use before committing, when the user asks "is it green?", or after the Stop hook reports failing checks.
---

# /verify — gate completo

1. Rode `pnpm verify`. Ele para na primeira etapa que falhar; rode as etapas seguintes individualmente para ter o quadro completo:
   `pnpm format:check` · `pnpm lint` · `pnpm typecheck` · `pnpm check:tests` · `pnpm test:coverage`.
2. Resuma em tabela: etapa → status → causa raiz (arquivo:linha).
3. Proponha a correção de cada falha seguindo as regras do projeto:
   - Coverage abaixo do mínimo → quais comportamentos não testados escrever (nunca baixar o threshold).
   - Arquivo sem teste irmão → criar o teste (ou `@no-unit-test` justificado, se for WebGL/E2E).
   - Erro de boundaries → mover o código de camada ou criar um port.
4. Se o usuário pediu para corrigir, corrija e rode de novo até ficar verde.
