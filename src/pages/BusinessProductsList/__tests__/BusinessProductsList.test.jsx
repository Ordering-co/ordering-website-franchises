import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { BusinessProductsList } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useApi: () => [{}],
  useEvent: () => [{ emit: vi.fn() }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug', product_url_template: '/store/:business_slug/:category_slug/:product_slug' } }],
  useSession: () => [{ auth: true, loading: false }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => (
    fallback.includes('product')
      ? '/store/:business_slug/:category_slug/:product_slug'
      : fallback
  ),
  capitalize: (value) => value,
  generalUtilities: () => ({ handleCreateGuestUser: vi.fn() }),
  BusinessProductsListing: (props) => (
    <div
      data-testid='business-products-listing-ui'
      data-slug={String(props.slug)}
      data-category-id={String(props.categoryId)}
      data-product-id={String(props.productId)}
    />
  )
}))
vi.mock('../../../config', () => ({
  default: {
    businessSlug: null,
    use_marketplace: false,
    use_kiosk: false
  }
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({
      business_slug: 'demo-store',
      category_slug: 'burgers',
      product_slug: 'cheeseburger'
    }),
    useLocation: () => ({ search: '' })
  }
})

describe('BusinessProductsList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders helmet tags and wires slug route params to the controller', () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsList />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'business')
    expect(getByTestId('business-products-listing-ui')).toHaveAttribute('data-slug', 'demo-store')
    expect(getByTestId('business-products-listing-ui')).toHaveAttribute('data-category-id', 'burgers')
    expect(getByTestId('business-products-listing-ui')).toHaveAttribute('data-product-id', 'cheeseburger')
  })
})
