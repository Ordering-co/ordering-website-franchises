import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { OrderDetailsPage } from '../index'

const emit = vi.fn()
const push = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page, helmetTitle }) => (
    <div data-testid='helmet-tags' data-page={page} data-title={helmetTitle} />
  )
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  OrderDetails: (props) => (
    <div data-testid='order-details-ui' data-order-id={props.orderId} data-hash={props.hashKey || ''}>
      <button type='button' onClick={props.handleOrderRedirect}>orders</button>
      <button type='button' onClick={() => props.handleBusinessRedirect('demo-store')}>business</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ orderId: 'order-42' }),
    useLocation: () => ({ search: '?hash=abc' }),
    useHistory: () => ({ push })
  }
})

describe('OrderDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order details helmet tags and route params', () => {
    const { getByTestId } = renderWithProviders(<OrderDetailsPage />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'order_details')
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-title', 'Order #order-42')
    expect(getByTestId('order-details-ui')).toHaveAttribute('data-order-id', 'order-42')
    expect(getByTestId('order-details-ui')).toHaveAttribute('data-hash', 'abc')
  })

  it('redirects to profile orders and business page from callbacks', () => {
    const { getByText } = renderWithProviders(<OrderDetailsPage />)
    getByText('orders').click()
    expect(push).toHaveBeenCalledWith('/profile/orders')
    getByText('business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
  })
})
