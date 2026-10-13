import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { giftCardThemeOverrides } from '../../../../../../test/giftCardUiTestUtils'
import { GiftCardUI } from '../index'

vi.mock('../../PurchaseGiftCard', () => ({
  PurchaseGiftCard: () => <div>Purchase form</div>
}))
vi.mock('../../RedeemGiftCard', () => ({
  RedeemGiftCard: () => <div>Redeem form</div>
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  PurchaseGiftCard: () => <div>Purchase form</div>,
  RedeemGiftCard: () => <div>Redeem form</div>
}))

const renderGiftCardUI = () => renderWithProviders(
  <GiftCardUI />,
  { themeOverrides: giftCardThemeOverrides }
)

describe('GiftCardUI', () => {
  it('renders the gift card title and actions', () => {
    const { getByText, getByRole, queryByTestId } = renderGiftCardUI()
    expect(getByText('Gift card')).toBeInTheDocument()
    expect(getByText('Purchase')).toBeInTheDocument()
    expect(getByText('Redeem')).toBeInTheDocument()
    expect(getByRole('img')).toHaveAttribute('src', 'gift-card.png')
    expect(queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('opens the purchase modal and closes it', () => {
    const { getByText, queryByText } = renderGiftCardUI()
    fireEvent.click(getByText('Purchase'))
    expect(getByText('Purchase form')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
    expect(queryByText('Purchase form')).not.toBeInTheDocument()
  })

  it('opens the redeem modal and closes it', () => {
    const { getByText, queryByText } = renderGiftCardUI()
    fireEvent.click(getByText('Redeem'))
    expect(getByText('Redeem form')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
    expect(queryByText('Redeem form')).not.toBeInTheDocument()
  })
})
