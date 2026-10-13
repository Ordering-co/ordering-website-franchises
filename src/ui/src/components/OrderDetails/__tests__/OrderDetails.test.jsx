import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderDetails } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/ri/RiUser2Fill', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/fa/FaUserAlt', () => ({ default: () => <span /> }))
vi.mock('../OrderEta', () => ({
  OrderEta: () => <span>eta</span>
}))
vi.mock('../OrderBillSection', () => ({
  OrderBillSection: () => <div>bill section</div>
}))
vi.mock('../ActionsSection', () => ({
  ActionsSection: () => null
}))
vi.mock('../OrderPreferencesSections', () => ({
  OrderPreferencesSection: () => <div>preferences</div>
}))
vi.mock('../OrderHistory', () => ({
  OrderHistory: () => null
}))
vi.mock('../utils', () => ({
  getUtils: () => ({ setLocalMoment: () => {} })
}))

const buildOrder = (status) => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrder,
  status,
  customer: { address: '9 Customer St', location: { lat: 1, lng: 1 } },
  reporting_data: { at: { 'status:1': '2026-01-01T12:00:00Z' } }
})

vi.mock('~components', () => {
  const { baseOrdersUiHooks, baseOrder } = require('../../../../../test/ordersUiTestUtils')
  const fallbackOrder = {
    ...baseOrder,
    customer: { address: '9 Customer St', location: { lat: 1, lng: 1 } },
    reporting_data: { at: { 'status:1': '2026-01-01T12:00:00Z' } }
  }
  return {
    ...baseOrdersUiHooks,
    useOrder: () => [{ carts: {} }, {}],
    useBusiness: () => [{}, { setBusiness: () => {} }],
    GoogleMapsMap: () => null,
    OrderDetails: ({ UIComponent, ...rest }) => (
      <UIComponent
        {...rest}
        order={{
          order: rest.order || fallbackOrder,
          loading: false,
          error: null,
          businessData: { slug: 'demo' }
        }}
        messages={{ messages: [] }}
        reorderState={{ loading: false }}
        handleReorder={() => {}}
        handleRemoveCart={() => {}}
        handleBusinessRedirect={() => {}}
        handleOrderRedirect={() => {}}
      />
    )
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getStatusPrefix: () => ({ value: 'Completed', percentage: 100 })
  }),
  getGoogleMapImage: () => 'map.png',
  getMomentCalendarLocale: () => ({}),
  ReviewOrder: () => null,
  ReviewProduct: () => null,
  ReviewDriver: () => null,
  ReviewProfessional: () => null,
  ProductItemAccordion: ({ product }) => <div>{product?.name}</div>,
  TaxInformation: () => null,
  Messages: () => null,
  SendGiftCard: () => null
}))

describe('OrderDetails', () => {
  it('renders a completed order summary', () => {
    window.scrollTo = () => {}
    const { getByText } = renderWithProviders(<OrderDetails />)
    expect(getByText('Your order')).toBeInTheDocument()
    expect(getByText('Review')).toBeInTheDocument()
    expect(getByText('Order again')).toBeInTheDocument()
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('renders an in-progress order', () => {
    window.scrollTo = () => {}
    const { getByText } = renderWithProviders(
      <OrderDetails order={buildOrder(0)} />
    )
    expect(getByText('Your order is in progress')).toBeInTheDocument()
    expect(getByText('Help')).toBeInTheDocument()
    fireEvent.click(getByText('Help'))
  })
})
