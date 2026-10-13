import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { OrderDetail } from './OrderDetail'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../test/franchiseUiMock').franchiseUiMock,
  OrderBillSection: () => <div>bill</div>,
  ProductItemAccordion: ({ product }) => <div>{product?.name}</div>
}))

describe('OrderDetail', () => {
  it('renders the address, products and place order action', () => {
    const onClick = vi.fn()
    const { getByText } = renderWithProviders(
      <OrderDetail
        customerAddress='123 Main'
        orderType={1}
        item={{
          products: [{ id: 1, name: 'Burger', code: 'BRG-1' }]
        }}
        onClick={onClick}
      />
    )
    expect(getByText('123 Main')).toBeInTheDocument()
    expect(getByText('Delivery')).toBeInTheDocument()
    expect(getByText('Burger')).toBeInTheDocument()
    fireEvent.click(getByText('Place Order'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows placing state and pickup label', () => {
    const { getByText } = renderWithProviders(
      <OrderDetail
        customerAddress='123 Main'
        orderType={2}
        placingOrder
        item={{ products: [] }}
        onClick={() => {}}
      />
    )
    expect(getByText('Pickup')).toBeInTheDocument()
    expect(getByText('Placing')).toBeInTheDocument()
  })
})
