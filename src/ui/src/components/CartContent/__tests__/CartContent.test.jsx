import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartContentUIProps } from '../../../../../test/cartUiTestUtils'
import { CartContent } from '../index'

const progress = vi.hoisted(() => vi.fn(() => ({ status: 'progress' })))

vi.mock('~components', () => ({
  useFreeDeliveryProgress: progress,
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useConfig: () => [{ configs: {} }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  Cart: ({ cart, freeDeliveryProgress, isCheckout }) => <div data-testid='cart-item' data-progress={freeDeliveryProgress?.status} data-checkout={String(isCheckout)}>{cart?.uuid}</div>
}))

describe('CartContent', () => {
  beforeEach(() => {
    progress.mockClear()
    window.history.replaceState(null, '', '/')
  })
  it('does not request promotional eligibility in checkout', () => {
    window.history.replaceState(null, '', '/checkout/cart-1')
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'true')
    window.history.replaceState(null, '', '/')
  })
  it('does not request promotional eligibility for the checkout cart list', () => {
    window.history.replaceState(null, '', '/checkout')
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'false')
  })
  it.each(['/checkout', '/checkout/cart-1', '/multi-checkout', '/multi-checkout/group-1'])('does not request offers from the header cart on %s', (path) => {
    window.history.replaceState(null, '', path)
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts isCartPopover isOpenCart />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'false')
  })
  it('owns progress for the visible global cart and disables lookup while closed', () => {
    const cart = { uuid: 'cart-1', business_id: 1, business: { id: 1, slug: 'demo' }, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId, rerender } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts isOpenCart />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ business: cart.business, cart, enabled: true }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-progress', 'progress')
    rerender(<CartContent carts={[cart]} isOrderStateCarts isOpenCart={false} />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
  })
  it('shows empty state when no carts', () => {
    const { getByText } = renderWithProviders(<CartContent carts={[]} isOrderStateCarts />)
    expect(getByText('You have no products added to the cart')).toBeInTheDocument()
  })

  it('renders cart items when carts are provided', () => {
    const carts = [{
      uuid: 'cart-1',
      valid: true,
      status: 1,
      products: [{ id: 1, name: 'Burger', code: 'BRG-1' }],
      total: 9.5,
      business_id: 1
    }]
    const { getByTestId } = renderWithProviders(
      <CartContent carts={carts} isOrderStateCarts {...baseCartContentUIProps} />
    )
    expect(getByTestId('cart-item')).toBeInTheDocument()
  })

  it('renders carts from order state when not passed explicitly', () => {
    const carts = [{
      uuid: 'cart-2',
      valid: true,
      status: 1,
      products: [{ id: 2, name: 'Fries', code: 'FRS-1' }],
      total: 4.5,
      business_id: 2
    }]
    const { getByTestId } = renderWithProviders(
      <CartContent isOrderStateCarts carts={carts} {...baseCartContentUIProps} />
    )
    expect(getByTestId('cart-item')).toHaveTextContent('cart-2')
  })
})
