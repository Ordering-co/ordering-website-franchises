import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Login } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useLanguage: () => [null, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  LoginGuest: ({ cartUuid, title, isGuest }) => (
    <div
      data-testid='login-guest-ui'
      data-cart-uuid={cartUuid}
      data-guest={String(isGuest)}
    >
      {title}
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ cartUuid: 'cart-1' })
  }
})

describe('Login page', () => {
  it('renders helmet tags and wires guest login props', () => {
    const { getByTestId, getByText } = renderWithProviders(<Login />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'login')
    expect(getByTestId('login-guest-ui')).toHaveAttribute('data-cart-uuid', 'cart-1')
    expect(getByTestId('login-guest-ui')).toHaveAttribute('data-guest', 'true')
    expect(getByText('Log in to OrderingPlus!')).toBeInTheDocument()
  })
})
