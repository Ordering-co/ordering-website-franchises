import { describe, expect, it, vi, afterEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCouponControlProps } from '../../../../../test/cartUiTestUtils'
import { CouponControl } from '../index'

const uiPropsRef = { current: null }

vi.mock('~components', () => ({
  CouponControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      couponInput='SAVE10'
      couponDefault={null}
      handleButtonApplyClick={vi.fn()}
      handleLoadOffers={vi.fn()}
      handleOfferApplyClick={vi.fn()}
      handleOfferRemoveClick={vi.fn()}
      handleRemoveCouponClick={vi.fn()}
      onChangeInputCoupon={vi.fn()}
      offersState={{ offers: [], loading: false, error: null }}
      applyingOfferId={null}
      removingOfferId={null}
      canLoadOffers
      confirm={{ open: false, content: [] }}
      setConfirm={vi.fn()}
      {...baseCouponControlProps}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [{ carts: {} }, {}]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('CouponControl', () => {
  afterEach(() => {
    vi.clearAllMocks()
    uiPropsRef.current = null
  })

  it('renders offers and coupons entry button', () => {
    uiPropsRef.current = {}
    const { getByRole } = renderWithProviders(<CouponControl businessId={1} />)
    expect(getByRole('button', { name: /offers and coupons/i })).toBeInTheDocument()
  })

  it('opens modal with coupon input', () => {
    uiPropsRef.current = {}
    const { getByRole, getByPlaceholderText } = renderWithProviders(<CouponControl businessId={1} />)
    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))
    expect(getByPlaceholderText('Discount coupon')).toBeInTheDocument()
  })

  it('shows offers entry while loading offers list', () => {
    uiPropsRef.current = {
      offersState: { offers: [], loading: true, error: null }
    }
    const { getByRole } = renderWithProviders(<CouponControl businessId={1} />)
    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))
    expect(getByRole('button', { name: /offers and coupons/i })).toBeInTheDocument()
  })
})
