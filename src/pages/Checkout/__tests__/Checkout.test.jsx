import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { CheckoutPage } from '../index'

const emit = vi.fn()
const changeMoment = vi.fn()
const setBusiness = vi.fn()

vi.mock('../../../config', () => ({
  default: { businessSlug: null, use_kiosk: false }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useOrder: () => [{ options: {} }, { confirmCart: vi.fn(), changeMoment }],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }],
  useBusiness: () => [{}, { setBusiness }]
}))
vi.mock('@stripe/stripe-js/pure', () => ({
  loadStripe: vi.fn()
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  Checkout: (props) => (
    <div data-testid='checkout-ui' data-cart-uuid={props.cartUuid}>
      <button type='button' onClick={() => props.handleOrderRedirect('order-1')}>order</button>
      <button type='button' onClick={() => props.handleSearchRedirect()}>search</button>
      <button type='button' onClick={() => props.handleStoreRedirect('demo-store')}>store</button>
      <button
        type='button'
        onClick={() => props.onPlaceOrderClick(null, null, { order: { uuid: 'order-2' }, business_id: 5, business: { slug: 'demo-store' } })}
      >
        place
      </button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ cartUuid: 'cart-123' }),
    useLocation: () => ({ search: '' })
  }
})

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checkout helmet tags and passes cart uuid from route', () => {
    const { getByTestId } = renderWithProviders(<CheckoutPage />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'checkout')
    expect(getByTestId('checkout-ui')).toHaveAttribute('data-cart-uuid', 'cart-123')
  })

  it('emits navigation events from checkout callbacks', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />)

    getByText('order').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 'order-1' },
      replace: true
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'order_types' })

    getByText('store').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })

    getByText('place').click()
    expect(setBusiness).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 'order-2' },
      replace: true
    })
  })
})
