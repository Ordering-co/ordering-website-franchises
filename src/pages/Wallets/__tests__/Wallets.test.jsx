import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Wallets } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  Wallets: (props) => (
    <div data-testid='wallets-ui' data-props={JSON.stringify(Object.keys(props))} />
  )
}))

describe('Wallets page', () => {
  it('renders helmet tags and passes props to wallets controller', () => {
    const { getByTestId } = renderWithProviders(
      <Wallets onNavigationRedirect={vi.fn()} />
    )
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'wallets')
    expect(getByTestId('wallets-ui')).toBeInTheDocument()
  })
})
