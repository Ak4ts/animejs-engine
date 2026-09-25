// Use cases exposed to the UI. Built by the composition root (src/main) and
// consumed by presentation through ContainerContext — presentation never sees adapters.
export type AppContainer = Readonly<Record<string, never>>
