# M1 — Domínio & schemas

- [ ] **E1-1** `domain` Value objects: `Id`, `TimeMs`, `Vec2`, `Color`, `Easing`, `SemVer` (construção validada, imutáveis) (#6)
- [ ] **E1-2** `domain` Entidades: `Asset`, `Pack`, `Character`, `Skeleton`/`Bone`, `Scenario`, `AnimationClip`, `Transition` (#7)
- [ ] **E1-3** `domain` `Project` → `Sequence` → `Shot` → `Action` / `CastMember` / `CameraMove` / `AudioCue` (#8)
- [ ] **E1-4** `app` Schemas Zod (manifest, clip, project) + `schemaVersion` + migrators (#9)
  - Zod fica em `application/` ou `infrastructure/` (domínio sem deps).
- [ ] **E1-5** `domain` `TimelineCompiler`: Project → `CompiledTimeline` (tracks absolutas) (#10)
  - Aceite: testes cobrindo offsets de shots, transições sobrepostas, clips em loop, retarget por skeletonProfile.
