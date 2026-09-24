# M5 — Áudio & Export (100% cliente)

- [ ] **E5-1** `app`/`ui` Tracks de áudio (música, SFX, voz) + preview sincronizado ao clock (#31)
- [ ] **E5-2** `infra` `OfflineAudioMixer` (OfflineAudioContext → AudioBuffer) (#32)
- [ ] **E5-3** `infra` `MediabunnyEncoder`: render determinístico frame a frame (MP4 H.264/AV1, WebM VP9) (#33)
  - Aceite: 5 s @ 30 fps → 150 frames, duração correta (validar lendo o arquivo com mediabunny `Input`).
- [ ] **E5-4** `ui` Tela de export: resolução, fps, codec, progresso, cancelar; avaliar Worker + OffscreenCanvas (#34)
- [ ] **E5-5** `infra` Detecção de suporte WebCodecs + fallback de codec + mensagem clara se não suportado (#35)
