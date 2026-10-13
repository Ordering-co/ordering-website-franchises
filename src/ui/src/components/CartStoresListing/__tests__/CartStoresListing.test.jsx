import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CartStoresListing } from '../index'

const uiPropsRef = { current: null }

const businessFixture = {
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  logo: 'logo.png',
  enabled: true
}

vi.mock('~components', () => ({
  CartStoresListing: ({ UIComponent, ...rest }) => (
    <UIComponent
      storesState={{ loading: false, result: [businessFixture], error: null }}
      searchValue=''
      businessIdSelect={null}
      changeStoreState={{ loading: false, result: { business_id: 1 } }}
      handleChangeSearch={vi.fn()}
      handleCartStoreChange={vi.fn()}
      cartuuid='cart-1'
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useOrder: () => [{
    options: { type: 1 },
    carts: { 'businessId:1': { uuid: 'cart-1', business_id: 1 } }
  }, {}],
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  BusinessController: ({ business }) => <div data-testid='store-card'>{business?.name}</div>,
  SearchBar: ({ placeholder }) => <input data-testid='search' placeholder={placeholder} />,
  NotFoundSource: () => <div data-testid='not-found' />
}))

describe('CartStoresListing', () => {
  it('renders store list and search', () => {
    uiPropsRef.current = {}
    const { getByTestId, getByText } = renderWithProviders(<CartStoresListing cartuuid='cart-1' />)
    expect(getByTestId('search')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
