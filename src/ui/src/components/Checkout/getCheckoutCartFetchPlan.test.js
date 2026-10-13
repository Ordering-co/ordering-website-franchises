import { describe, expect, it } from 'vitest'

import { getCheckoutCartFetchPlan } from './getCheckoutCartFetchPlan'

const base = {
  root: 'https://api.example.com',
  cartId: 'cart-1',
  hasLocalCart: true
}

describe('getCheckoutCartFetchPlan', () => {
  it('ignores stale user-customer storage when customer mode is off', () => {
    const plan = getCheckoutCartFetchPlan({
      ...base,
      isCustomerMode: false,
      customerStateUser: null,
      storedUserCustomerRaw: '{"id":99}'
    })
    expect(plan.useLocalCart).toBe(true)
    expect(plan.url).toBe('https://api.example.com/carts/cart-1')
  })

  it('appends user_id when customer mode is active', () => {
    const plan = getCheckoutCartFetchPlan({
      ...base,
      isCustomerMode: true,
      customerStateUser: { id: 42 },
      storedUserCustomerRaw: '{"id":99}'
    })
    expect(plan.useLocalCart).toBe(false)
    expect(plan.url).toBe('https://api.example.com/carts/cart-1?user_id=42')
  })

  it('falls back to stored user-customer id when customer mode has no context user', () => {
    const plan = getCheckoutCartFetchPlan({
      ...base,
      isCustomerMode: true,
      customerStateUser: null,
      storedUserCustomerRaw: '{"id":99}'
    })
    expect(plan.useLocalCart).toBe(false)
    expect(plan.url).toBe('https://api.example.com/carts/cart-1?user_id=99')
  })

  it('does not throw when stored user-customer is invalid JSON', () => {
    expect(() => getCheckoutCartFetchPlan({
      ...base,
      isCustomerMode: true,
      customerStateUser: null,
      storedUserCustomerRaw: 'not-json'
    })).not.toThrow()
    expect(getCheckoutCartFetchPlan({
      ...base,
      isCustomerMode: true,
      customerStateUser: null,
      storedUserCustomerRaw: 'not-json'
    }).url).toBe('https://api.example.com/carts/cart-1')
  })
})
