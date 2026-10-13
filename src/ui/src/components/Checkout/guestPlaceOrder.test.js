import { describe, expect, it } from 'vitest'

import { shouldSkipPlaceOrderAsGuest } from './guestPlaceOrder'

describe('shouldSkipPlaceOrderAsGuest', () => {
  it('blocks guest placement while placing is already in flight', () => {
    expect(shouldSkipPlaceOrderAsGuest(true)).toBe(true)
  })

  it('allows guest placement when placing is idle', () => {
    expect(shouldSkipPlaceOrderAsGuest(false)).toBe(false)
    expect(shouldSkipPlaceOrderAsGuest(undefined)).toBe(false)
  })
})
