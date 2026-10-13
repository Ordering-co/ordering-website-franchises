import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { BusinessesList } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  BusinessesListing: (props) => (
    <div
      data-testid='businesses-listing-ui'
      data-search-by-name={String(!!props.isSearchByName)}
      data-search-by-description={String(!!props.isSearchByDescription)}
      data-current-page={String(props.currentPageParam)}
      data-franchise-id={String(props.franchiseId)}
      data-business-id={String(props.businessId)}
    />
  )
}))
vi.mock('../../../config', () => ({
  default: {
    franchiseSlug: 'franchise-a',
    businessSlug: 'store-a'
  }
}))

describe('BusinessesList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders helmet tags and wires listing search props', () => {
    const { getByTestId } = renderWithProviders(<BusinessesList />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'search')
    expect(getByTestId('businesses-listing-ui')).toHaveAttribute('data-search-by-name', 'true')
    expect(getByTestId('businesses-listing-ui')).toHaveAttribute('data-search-by-description', 'true')
    expect(getByTestId('businesses-listing-ui')).toHaveAttribute('data-current-page', '0')
    expect(getByTestId('businesses-listing-ui')).toHaveAttribute('data-franchise-id', 'franchise-a')
    expect(getByTestId('businesses-listing-ui')).toHaveAttribute('data-business-id', 'store-a')
  })
})
