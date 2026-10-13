import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { basePaymentOptionProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptionCash } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('PaymentOptionCash', () => {
  it('renders cash amount helper label', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionCash orderTotal={20} onChangeData={vi.fn()} {...basePaymentOptionProps} />
    )
    expect(getByText(/Don't have exact amount/)).toBeInTheDocument()
  })
})
