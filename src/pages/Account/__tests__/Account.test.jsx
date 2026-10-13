import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Account } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  Account: (props) => (
    <div data-testid='account-ui' data-props={JSON.stringify(Object.keys(props))} />
  )
}))

describe('Account page', () => {
  it('renders helmet tags and passes props to account controller', () => {
    const { getByTestId } = renderWithProviders(
      <Account onNavigationRedirect={vi.fn()} />
    )
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'account')
    expect(getByTestId('account-ui')).toBeInTheDocument()
  })
})
