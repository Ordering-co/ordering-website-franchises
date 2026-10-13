import { describe, expect, it } from 'vitest'

import { getCartPayableAmount } from './getCartPayableAmount'

describe('getCartPayableAmount', () => {
  it('uses remaining balance when wallets reduced the cart total', () => {
    expect(getCartPayableAmount({ total: 20, balance: 5 })).toBe(5)
  })

  it('falls back to total when balance is missing', () => {
    expect(getCartPayableAmount({ total: 20 })).toBe(20)
  })

  it('keeps a zero balance when wallets cover the full total', () => {
    expect(getCartPayableAmount({ total: 20, balance: 0 })).toBe(0)
  })

  it('does not throw when cart is missing', () => {
    expect(getCartPayableAmount(undefined)).toBeUndefined()
  })
})
