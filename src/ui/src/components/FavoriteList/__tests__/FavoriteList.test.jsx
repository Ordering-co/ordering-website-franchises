import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { FavoriteList } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  FavoriteList: ({ UIComponent, emptyFavorites, loadingFavorites, ...rest }) => (
    <UIComponent
      favoriteList={{
        loading: !!loadingFavorites,
        favorites: emptyFavorites || loadingFavorites
          ? []
          : [{
              id: 1,
              name: 'Favorite Store',
              slug: 'favorite-store',
              status: 1,
              business: { name: 'Favorite Store' }
            }]
      }}
      pagination={{ currentPage: 1, totalPages: 1 }}
      handleUpdateFavoriteList={vi.fn()}
      getFavoriteList={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1, address: { location: { lat: 1, lng: 2 } } } }, {}],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>,
  NotFoundSource: ({ content, children }) => <div>{content}{children}</div>,
  checkSiteUrl: (_t, fallback) => fallback,
  Button: ({ children }) => <button type='button'>{children}</button>,
  Modal: () => null,
  useWindowSize: () => ({ width: 1200, height: 800 }),
  generalUtilities: () => ({ getOrderStatus: () => 'pending' }),
  BusinessPreorder: () => null,
  SingleProductCard: ({ product }) => <div>{product?.name}</div>,
  SingleOrderCard: ({ order }) => <div>{order?.business?.name || order?.name}</div>,
  SingleProfessionalCard: ({ professional }) => <div>{professional?.name}</div>
}))

describe('FavoriteList', () => {
  it('renders favorite business cards', () => {
    const { getByTestId } = renderWithProviders(
      <FavoriteList isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getByTestId('business-card')).toHaveTextContent('Favorite Store')
  })

  it('renders favorite products', () => {
    const { getByText } = renderWithProviders(
      <FavoriteList isProduct favoriteURL='favorite_products' originalURL='products' />
    )
    expect(getByText('Favorite Store')).toBeInTheDocument()
  })

  it('renders favorite orders', () => {
    const { getByText } = renderWithProviders(
      <FavoriteList isOrder favoriteURL='favorite_orders' originalURL='orders' />
    )
    expect(getByText('Favorite Store')).toBeInTheDocument()
  })

  it('shows an empty favorites state', () => {
    const { getByText } = renderWithProviders(
      <FavoriteList emptyFavorites isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getByText('No favorites found')).toBeInTheDocument()
  })

  it('renders favorite professionals', () => {
    const { getByText } = renderWithProviders(
      <FavoriteList isProfessional favoriteURL='favorite_professionals' originalURL='professionals' />
    )
    expect(getByText('Favorite Store')).toBeInTheDocument()
  })

  it('renders favorite business skeletons while loading', () => {
    const { getAllByTestId } = renderWithProviders(
      <FavoriteList loadingFavorites isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getAllByTestId('business-card').length).toBeGreaterThan(0)
  })
})
