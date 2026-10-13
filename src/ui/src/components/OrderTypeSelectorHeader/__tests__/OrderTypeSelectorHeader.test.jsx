import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderTypeSelectorHeader } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  useOrder: () => [{ options: { type: 1 } }, {}],
  useConfig: () => [{ configs: {} }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('OrderTypeSelectorHeader', () => {
  it('renders the selected order type label', () => {
    const { getByText } = renderWithProviders(
      <OrderTypeSelectorHeader orderTypeList={['Pickup']} />
    )
    expect(getByText('Pickup')).toBeInTheDocument()
  })
})
