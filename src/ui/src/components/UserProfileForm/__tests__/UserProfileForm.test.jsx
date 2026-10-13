import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { accountUser } from '../../../../../test/accountUiTestUtils'
import { UserProfileForm } from '../index'

const profilePropsRef = { current: {} }
const otpLeftTimeRef = { current: 600 }
const resetOtpLeftTime = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  UserFormDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      userData={accountUser}
      handleButtonUpdateClick={vi.fn()}
      handlechangeImage={vi.fn()}
      formState={{ loading: false, changes: {}, result: { error: false } }}
      cleanFormState={vi.fn()}
      toggleIsEdit={vi.fn()}
      handleSendVerifyCode={vi.fn()}
      verifyPhoneState={{}}
      setFormState={vi.fn()}
      {...rest}
      {...profilePropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ user: accountUser }],
  DragAndDrop: ({ children }) => children,
  ExamineClick: ({ children }) => children
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  bytesConverter: () => 100,
  AddressList: () => <div data-testid='address-list' />,
  useCountdownTimer: () => [otpLeftTimeRef.current, () => {}, resetOtpLeftTime],
  VerifyCodeForm: ({ handleCheckPhoneCode }) => (
    <div data-testid='verify-code'>
      <button type='button' onClick={() => handleCheckPhoneCode({ code: '9999' })}>verify</button>
    </div>
  ),
  UserFormDetailsUI: ({ setWillVerifyOtpState }) => (
    <div data-testid='user-form-details'>
      <button type='button' onClick={() => setWillVerifyOtpState?.(true)}>start-otp</button>
    </div>
  )
}))

describe('UserProfileForm', () => {
  beforeEach(() => {
    profilePropsRef.current = {}
    otpLeftTimeRef.current = 600
  })

  it('renders the profile form and toggles edit on mount', () => {
    const toggleIsEdit = vi.fn()
    profilePropsRef.current = { toggleIsEdit }
    const { getByTestId } = renderWithProviders(<UserProfileForm />)
    expect(getByTestId('user-form-details')).toBeInTheDocument()
    expect(toggleIsEdit).toHaveBeenCalled()
  })

  it('shows saved places when requested', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <UserProfileForm view='savedPlaces' />
    )
    expect(getByTestId('address-list')).toBeInTheDocument()
    expect(queryByTestId('user-form-details')).not.toBeInTheDocument()
  })

  it('alerts when phone verification fails and when otp time expires', () => {
    profilePropsRef.current = {
      verifyPhoneState: { result: { error: true, result: ['Bad phone'] } }
    }
    otpLeftTimeRef.current = 0
    const { getByTestId } = renderWithProviders(<UserProfileForm />)
    expect(getByTestId('alert')).toBeInTheDocument()
  })

  it('sends a verification code from the otp modal', () => {
    const setFormState = vi.fn()
    const handleSendVerifyCode = vi.fn()
    profilePropsRef.current = {
      setFormState,
      handleSendVerifyCode,
      formState: {
        loading: false,
        changes: { cellphone: '5551234567', country_phone_code: '1' },
        result: { error: false }
      }
    }
    const { getByText, getByTestId } = renderWithProviders(<UserProfileForm />)
    fireEvent.click(getByText('start-otp'))
    expect(getByTestId('verify-code')).toBeInTheDocument()
    fireEvent.click(getByText('verify'))
    expect(setFormState).toHaveBeenCalled()
  })
})
