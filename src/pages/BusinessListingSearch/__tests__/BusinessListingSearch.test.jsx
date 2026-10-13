import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { BusinessListingSearch } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug', product_url_template: '/store/:business_slug/:category_slug/:product_slug' } }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  BusinessListingSearch: (props) => (
    <div data-testid='business-listing-search-ui' data-default-term={props.defaultTerm} />
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ search: '?term=pizza' })
  }
})

describe('BusinessListingSearch page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders helmet tags and passes default search term from query', () => {
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'business_search')
    expect(getByTestId('business-listing-search-ui')).toHaveAttribute('data-default-term', 'pizza')
  })
})
