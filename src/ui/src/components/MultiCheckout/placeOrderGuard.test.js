import { describe, expect, it } from 'vitest'

import { shouldAutoPlaceWalletPay, shouldSkipPlaceOrder } from './placeOrderGuard'

const methodsPay = ['global_google_pay', 'global_apple_pay']

describe('shouldSkipPlaceOrder', () => {
  it('blocks a second place while placing is already in flight', () => {
    expect(shouldSkipPlaceOrder(true)).toBe(true)
  })

  it('allows place when placing is idle', () => {
    expect(shouldSkipPlaceOrder(false)).toBe(false)
    expect(shouldSkipPlaceOrder(undefined)).toBe(false)
  })
})

describe('shouldAutoPlaceWalletPay', () => {
  it('auto-places Google or Apple Pay when source_id is present and placing is idle', () => {
    expect(shouldAutoPlaceWalletPay({
      gateway: 'global_google_pay',
      paymethodData: '{"source_id":"tok_1"}',
      methodsPay,
      placing: false
    })).toBe(true)
  })

  it('does not auto-place while a manual place is already in flight', () => {
    expect(shouldAutoPlaceWalletPay({
      gateway: 'global_apple_pay',
      paymethodData: '{"source_id":"tok_1"}',
      methodsPay,
      placing: true
    })).toBe(false)
  })

  it('does not throw when paymethod_data is invalid JSON', () => {
    expect(shouldAutoPlaceWalletPay({
      gateway: 'global_google_pay',
      paymethodData: 'not-json',
      methodsPay,
      placing: false
    })).toBe(false)
  })
})
