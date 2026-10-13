import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SmartAppBanner } from '../index'

vi.mock('~components', () => ({
  SmartAppBanner: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} />
  )
}))

describe('SmartAppBanner', () => {
  it('renders the wired export without visible chrome', () => {
    const { container } = renderWithProviders(<SmartAppBanner />)
    expect(container).toBeTruthy()
    expect(container.textContent).toBe('')
  })
})
