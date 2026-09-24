import { createContext, use } from 'react'
import type { AppContainer } from '@/application/AppContainer'

export const ContainerContext = createContext<AppContainer | null>(null)

export function useContainer(): AppContainer {
  const container = use(ContainerContext)
  if (!container) throw new Error('useContainer must be used inside <ContainerContext>')
  return container
}
