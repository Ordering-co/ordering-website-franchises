import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PaymentOptionEpayco } from '../index'

describe('PaymentOptionEpayco', () => {
  it('injects epayco checkout script on mount', () => {
    renderWithProviders(<PaymentOptionEpayco />)
    const script = document.querySelector('script[src="https://checkout.epayco.co/checkout.js"]')
    expect(script).toBeTruthy()
  })
})
