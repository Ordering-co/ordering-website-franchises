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

const buildOrder = (status, overrides = {}) => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrder,
  status,
  customer: { address: '9 Customer St', location: { lat: 1, lng: 1 } },
  reporting_data: { at: { 'status:1': '2026-01-01T12:00:00Z' } },
  ...overrides
})

const requestedPin = { delivery_pin: '0427', delivery_pin_status: 'requested' }

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

  it('shows the delivery PIN while the order is in progress and the PIN is requested', () => {
    window.scrollTo = () => {}
    const { getByTestId, getByText } = renderWithProviders(
      <OrderDetails order={buildOrder(0, requestedPin)} />
    )
    const pinBlock = getByTestId('delivery-pin')
    expect(pinBlock).toHaveTextContent('Delivery PIN')
    expect(getByText('0427')).toBeInTheDocument()
    expect(pinBlock).toHaveTextContent('Give this code to the driver when you receive your order')
  })

  it('hides the delivery PIN once it has been validated', () => {
    window.scrollTo = () => {}
    const { getByText, queryByTestId, queryByText } = renderWithProviders(
      <OrderDetails order={buildOrder(0, { ...requestedPin, delivery_pin_status: 'validated' })} />
    )
    expect(getByText('Your order is in progress')).toBeInTheDocument()
    expect(queryByTestId('delivery-pin')).not.toBeInTheDocument()
    expect(queryByText('0427')).not.toBeInTheDocument()
  })

  it('hides the delivery PIN when the order has none', () => {
    window.scrollTo = () => {}
    const { getByText, queryByTestId } = renderWithProviders(
      <OrderDetails order={buildOrder(0, { delivery_pin: null, delivery_pin_status: null })} />
    )
    expect(getByText('Your order is in progress')).toBeInTheDocument()
    expect(queryByTestId('delivery-pin')).not.toBeInTheDocument()
  })

  it('hides the delivery PIN for a completed order', () => {
    window.scrollTo = () => {}
    const { getByText, queryByTestId, queryByText } = renderWithProviders(
      <OrderDetails order={buildOrder(1, requestedPin)} />
    )
    expect(getByText('Your order')).toBeInTheDocument()
    expect(queryByTestId('delivery-pin')).not.toBeInTheDocument()
    expect(queryByText('0427')).not.toBeInTheDocument()
  })
})
