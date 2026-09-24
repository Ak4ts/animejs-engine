# M5 — Áudio & Export (100% cliente)

- [ ] **E5-1** `app`/`ui` Tracks de áudio (música, SFX, voz) + preview sincronizado ao clock (#31)
  - Testes: unit de sincronia áudio/clock com `FakeClock`.
- [ ] **E5-2** `infra` `OfflineAudioMixer` (OfflineAudioContext → AudioBuffer) (#32)
  - Testes: unit com `OfflineAudioContext` fake (mix, ganho, offsets).
- [ ] **E5-3** `infra` `MediabunnyEncoder`: render determinístico frame a frame (MP4 H.264/AV1, WebM VP9) (#33)
  - Aceite: 5 s @ 30 fps → 150 frames, duração correta (validar lendo o arquivo com mediabunny `Input`).
  - Testes: E2E exporta 5 s @ 30 fps e valida frames/duração lendo o arquivo.
- [ ] **E5-4** `ui` Tela de export: resolução, fps, codec, progresso, cancelar; avaliar Worker + OffscreenCanvas (#34)
  - Testes: componente + E2E (progresso, cancelar).
- [ ] **E5-5** `infra` Detecção de suporte WebCodecs + fallback de codec + mensagem clara se não suportado (#35)
  - Testes: unit da detecção com globals simulados.
