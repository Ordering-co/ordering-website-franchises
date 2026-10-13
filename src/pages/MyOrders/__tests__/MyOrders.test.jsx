import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { MyOrders } from '../index'

const emit = vi.fn()

vi.mock('../../../config', () => ({
  default: { businessSlug: 'store-a', franchiseSlug: 'franchise-a' }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useSite: () => [{
    site: {
      business_url_template: '/store/:business_slug',
      product_url_template: '/store/:business_slug/:category_slug/:product_slug'
    }
  }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  useWindowSize: () => ({ width: 1024, height: 768 }),
  MyOrders: (props) => (
    <div
      data-testid='my-orders-ui'
      data-hide-options={String(props.hideOptions)}
      data-franchise-id={String(props.franchiseId)}
      data-is-customer={String(!!props.isAsCustomer)}
    >
      <button type='button' onClick={() => props.onBusinessClick({ slug: 'demo-store' })}>business</button>
      <button type='button' onClick={() => props.onRedirectPage({ page: 'orders' })}>orders</button>
    </div>
  )
}))

describe('MyOrders page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders orders helmet tags and listing props', () => {
    const { getByTestId } = renderWithProviders(<MyOrders />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'orders')
    expect(getByTestId('my-orders-ui')).toHaveAttribute('data-hide-options', 'false')
    expect(getByTestId('my-orders-ui')).toHaveAttribute('data-franchise-id', 'franchise-a')
    expect(getByTestId('my-orders-ui')).toHaveAttribute('data-is-customer', 'true')
  })

  it('emits navigation events from orders callbacks', () => {
    const { getByText } = renderWithProviders(<MyOrders />)
    getByText('business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
    getByText('orders').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders' })
  })
})
