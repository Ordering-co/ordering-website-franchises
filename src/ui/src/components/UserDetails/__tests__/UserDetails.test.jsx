import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { accountUser } from '../../../../../test/accountUiTestUtils'
import { UserDetails } from '../index'

const detailsPropsRef = { current: {} }
const sessionRef = { current: { user: accountUser, loading: false } }
const otpLeftTimeRef = { current: 600 }
const resetOtpLeftTime = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('libphonenumber-js', () => {
  const parsePhoneNumber = () => ({ country: 'US' })
  return { default: parsePhoneNumber, parsePhoneNumber }
})
vi.mock('react-phone-number-input', () => ({
  default: () => <div data-testid='country-flag' />
}))
vi.mock('~components', () => ({
  UserFormDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      isEdit={false}
      formState={{ loading: false, changes: {}, result: {} }}
      validationFields={{ loading: false, fields: {} }}
      userState={{ loading: false, result: { result: accountUser } }}
      toggleIsEdit={vi.fn()}
      handleSendVerifyCode={vi.fn()}
      verifyPhoneState={{}}
      requiredFields={[]}
      setFormState={vi.fn()}
      {...rest}
      {...detailsPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  useCountdownTimer: () => [otpLeftTimeRef.current, () => {}, resetOtpLeftTime],
  VerifyCodeForm: ({ handleSendOtp, handleCheckPhoneCode }) => (
    <div data-testid='verify-code'>
      <button type='button' onClick={handleSendOtp}>resend</button>
      <button type='button' onClick={() => handleCheckPhoneCode({ code: '1234' })}>verify</button>
    </div>
  ),
  UserFormDetailsUI: ({ setWillVerifyOtpState }) => (
    <div data-testid='user-form-details'>
      <button type='button' onClick={() => setWillVerifyOtpState?.(true)}>start-otp</button>
    </div>
  )
}))

describe('UserDetails', () => {
  beforeEach(() => {
    detailsPropsRef.current = {}
    sessionRef.current = { user: accountUser, loading: false }
    otpLeftTimeRef.current = 600
  })

  it('renders customer name, phone and email', () => {
    const { getByText } = renderWithProviders(<UserDetails />)
    expect(getByText(/Jane/)).toBeInTheDocument()
    expect(getByText('5551234567')).toBeInTheDocument()
    expect(getByText('jane@example.com')).toBeInTheDocument()
  })

  it('toggles edit mode from the change action', () => {
    const toggleIsEdit = vi.fn()
    detailsPropsRef.current = { toggleIsEdit }
    const { getByText } = renderWithProviders(<UserDetails />)
    fireEvent.click(getByText('Change'))
    expect(toggleIsEdit).toHaveBeenCalled()
  })

  it('shows skeletons while validation fields load', () => {
    detailsPropsRef.current = {
      validationFields: { loading: true },
      requiredFields: [{ id: 1 }, { id: 2 }]
    }
    const { getAllByTestId } = renderWithProviders(<UserDetails />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('opens the edit form and verification modal', () => {
    const setFormState = vi.fn()
    const handleSendVerifyCode = vi.fn()
    detailsPropsRef.current = {
      isEdit: true,
      setFormState,
      handleSendVerifyCode,
      formState: {
        loading: false,
        changes: { cellphone: '5551234567', country_phone_code: '1' },
        result: {}
      }
    }
    const { getByTestId, getByText } = renderWithProviders(<UserDetails />)
    expect(getByTestId('user-form-details')).toBeInTheDocument()
    fireEvent.click(getByText('start-otp'))
    expect(getByTestId('verify-code')).toBeInTheDocument()
    fireEvent.click(getByText('resend'))
    expect(handleSendVerifyCode).toHaveBeenCalled()
    fireEvent.click(getByText('verify'))
    expect(setFormState).toHaveBeenCalled()
  })

  it('shows a verify phone error and checkout success', () => {
    const setIsSuccess = vi.fn()
    const onClose = vi.fn()
    detailsPropsRef.current = {
      verifyPhoneState: { result: { error: true, result: ['Phone error'] } },
      isCheckoutPlace: true,
      requiredFields: [],
      formState: { loading: false, changes: {}, result: {} },
      setIsSuccess,
      onClose
    }
    const { getByTestId } = renderWithProviders(<UserDetails />)
    expect(getByTestId('alert')).toHaveTextContent('Phone error')
    expect(setIsSuccess).toHaveBeenCalledWith(true)
    expect(onClose).toHaveBeenCalled()
  })
})
