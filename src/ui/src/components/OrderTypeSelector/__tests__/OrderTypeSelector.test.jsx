import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderTypeSelector } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2]
}))
vi.mock('../../AdvancedAddressForm', () => ({
  AdvancedAddressForm: () => null
}))
vi.mock('../../SpinnerLoader', () => ({
  SpinnerLoader: () => null
}))
vi.mock('../../styles/Buttons', () => ({
  __esModule: true,
  default: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  useSession: () => [{ user: { id: 1 } }],
  useOrder: () => [{ loading: false, options: { type: 1, address: { location: { lat: 1, lng: 1 } } } }, {}],
  OrderTypeControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      typeSelected={1}
      handleChangeOrderType={() => {}}
      orderTypes={[
        { value: 1, text: 'Delivery', description: 'Delivery description' },
        { value: 2, text: 'Pickup', description: 'Pickup description' }
      ]}
      configTypes={[1, 2]}
    />
  )
}))

describe('OrderTypeSelector', () => {
  it('renders delivery and pickup options', () => {
    const { getByText } = renderWithProviders(<OrderTypeSelector />)
    expect(getByText('Delivery')).toBeInTheDocument()
    expect(getByText('Pickup')).toBeInTheDocument()
  })
})
