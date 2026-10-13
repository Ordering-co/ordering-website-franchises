import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { MultiCheckout } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [{}, { confirmMultiCarts: vi.fn() }],
  useConfig: () => [{ configs: { epayco_sandbox_mode: { value: '0' } } }]
}))
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn()
}))
vi.mock('~ui', () => ({
  MultiCheckout: (props) => (
    <div data-testid='multi-checkout-ui' data-cart-uuid={props.cartUuid}>
      <button type='button' onClick={props.handleSearchRedirect}>search</button>
      <button type='button' onClick={() => props.onPlaceOrderClick({ id: 'order-9' })}>place</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ cartUuid: 'cart-55' })
  }
})

describe('MultiCheckout page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders multi checkout helmet tags and cart uuid', () => {
    const { getByTestId } = renderWithProviders(<MultiCheckout />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'multi_checkout')
    expect(getByTestId('multi-checkout-ui')).toHaveAttribute('data-cart-uuid', 'cart-55')
  })

  it('emits navigation events from multi checkout callbacks', () => {
    const { getByText } = renderWithProviders(<MultiCheckout />)

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })

    getByText('place').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'multi_orders',
      params: { orderId: 'order-9' }
    })
  })
})
