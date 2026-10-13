import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessItemAccordion } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{
    carts: {
      'cart-other': { products: [{ id: 2 }] },
      'cart-another': { products: [{ id: 3 }] }
    },
    options: { type: 1 }
  }, {}],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useConfig: () => [{ configs: {} }]
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  generalUtilities: () => ({
    getOrderStatus: () => 'pending',
    convertHoursToMinutes: (v) => v
  })
}))

describe('BusinessItemAccordion', () => {
  it('renders cart accordion with business name', () => {
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        cart={{ products: [{ id: 1 }] }}
        business={{ name: 'Cart Store', logo: 'logo.png' }}
        uuid='cart-1'
        orderTotal={25}
        isProducts
        currentCartUuid='cart-1'
      />
    )
    expect(getByText('Cart Store')).toBeInTheDocument()
  })

  it('handles checkout click', () => {
    const handleClickCheckout = vi.fn()
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        cart={{ products: [{ id: 1 }] }}
        business={{ name: 'Cart Store' }}
        uuid='cart-1'
        orderTotal={25}
        isProducts
        isClosed={false}
        handleClickCheckout={handleClickCheckout}
      />
    )
    fireEvent.click(getByText('Checkout'))
    expect(handleClickCheckout).toHaveBeenCalledWith('cart-1')
  })
})
