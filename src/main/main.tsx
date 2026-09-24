import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { App } from '@/presentation/app/App'
import { createContainer } from './container'
import { ContainerContext } from '@/presentation/app/ContainerContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <ContainerContext value={createContainer()}>
      <App />
    </ContainerContext>
  </StrictMode>,
)
