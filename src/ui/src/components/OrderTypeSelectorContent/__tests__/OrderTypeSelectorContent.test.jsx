import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderTypeSelectorContent } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  OrderTypeControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      typeSelected={1}
      handleChangeOrderType={() => {}}
      orderTypes={[
        { value: 1, text: 'Delivery', description: 'Delivery description' },
        { value: 2, text: 'Pickup', description: 'Pickup description' }
      ]}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('OrderTypeSelectorContent', () => {
  it('renders the delivery type prompt', () => {
    const { queryByText } = renderWithProviders(<OrderTypeSelectorContent />)
    expect(
      queryByText('How will you delivery type?') || queryByText('start my order')
    ).toBeTruthy()
  })
})
