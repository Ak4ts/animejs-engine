import { render, renderHook, screen } from '@testing-library/react'
import type { AppContainer } from '@/application/AppContainer'
import { ContainerContext, useContainer } from './ContainerContext'

describe('useContainer', () => {
  it('returns the container provided by ContainerContext', () => {
    const container: AppContainer = {}
    function Probe() {
      return <span>{useContainer() === container ? 'same' : 'other'}</span>
    }

    render(
      <ContainerContext value={container}>
        <Probe />
      </ContainerContext>,
    )

    expect(screen.getByText('same')).toBeInTheDocument()
  })

  it('fails loudly when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useContainer())).toThrow(/inside <ContainerContext>/)
  })
})
