import { vi } from 'vitest'

export const baseCartUIProps = {
  cart: {
    uuid: 'cart-1',
    business_id: 1,
    products: [{ id: 100, name: 'Burger', quantity: 1, price: 9.99 }],
    total: 9.99,
    status: 0
  },
  business: { id: 1, name: 'Demo Store', slug: 'demo' },
  isCartPending: false,
  isCheckout: false,
  isStore: true,
  isCartOnProductsList: false,
  handleCartOpen: vi.fn(),
  onNavigationRedirect: vi.fn(),
  handleDeleteClick: vi.fn(),
  handleEditProduct: vi.fn(),
  isProducts: 1,
  isForceOpenCart: false
}

export const baseCartContentUIProps = {
  cart: baseCartUIProps.cart,
  business: baseCartUIProps.business,
  isStore: true,
  isCheckout: false,
  isCartPending: false,
  onNavigationRedirect: vi.fn()
}

export const basePaymentOptionProps = {
  paymethod: { id: 1, name: 'Cash', gateway: 'cash' },
  isSelected: true,
  isDisabled: false,
  handlePaymentMethodClick: vi.fn(),
  handlePlaceOrder: vi.fn()
}

export const baseCheckoutUIProps = {
  cart: baseCartUIProps.cart,
  business: baseCartUIProps.business,
  cartUuid: 'cart-1',
  handleOrderRedirect: vi.fn(),
  handleSearchRedirect: vi.fn(),
  handleStoreRedirect: vi.fn(),
  onPlaceOrderClick: vi.fn(),
  isCustomerMode: false
}

export const baseCouponControlProps = {
  cart: baseCartUIProps.cart,
  businessId: 1,
  onNavigationRedirect: vi.fn()
}

export const baseDriverTipsProps = {
  driverTipsOptions: [{ value: 0 }, { value: 10 }],
  driverTip: 0,
  handleChangeDriverTip: vi.fn(),
  parsePrice: (v) => `$${v}`
}

export const baseMultiCartUIProps = {
  carts: [baseCartUIProps.cart],
  businesses: [baseCartUIProps.business],
  onNavigationRedirect: vi.fn()
}
