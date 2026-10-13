import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderContextUI } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/fa/FaMapMarkerAlt', () => ({
  default: () => <span />
}))

const sessionState = { auth: false, user: { id: 1, name: 'Jane' } }
const configState = { loading: false, configs: { preorder_status_enabled: { value: '1' } } }

vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  useOrder: () => [{ options: { type: 1 } }, {}],
  useBusiness: () => [{ business: {} }],
  useSession: () => [sessionState],
  useConfig: () => [configState]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  getCateringValues: () => ({}),
  OrderTypeSelectorHeader: () => <div>Delivery</div>,
  MomentPopover: () => <div>Schedule</div>,
  AddressForm: () => <div>Address Form</div>,
  AddressList: () => <div>Address List</div>,
  MomentContent: () => <div>Moment content</div>,
  OrderTypeSelectorContent: () => <div>How will you delivery type?</div>
}))

describe('OrderContextUI', () => {
  it('asks for a delivery address when none is set', () => {
    sessionState.auth = false
    const { getByText } = renderWithProviders(<OrderContextUI />)
    expect(getByText('Where do we delivery?')).toBeInTheDocument()
  })

  it('opens the address form for guests', () => {
    sessionState.auth = false
    const { getByText, getAllByText } = renderWithProviders(<OrderContextUI />)
    fireEvent.click(getByText('Where do we delivery?'))
    expect(getAllByText('Address Form').length).toBeGreaterThan(0)
  })

  it('opens the delivery type modal', () => {
    const { getByText } = renderWithProviders(<OrderContextUI />)
    fireEvent.click(getByText('Delivery'))
    expect(getByText('How will you delivery type?')).toBeInTheDocument()
  })

  it('opens the address list for authenticated users', () => {
    sessionState.auth = true
    const { getByText, getAllByText } = renderWithProviders(<OrderContextUI />)
    fireEvent.click(getByText('Where do we delivery?'))
    expect(getAllByText('Address List').length).toBeGreaterThan(0)
  })
})
