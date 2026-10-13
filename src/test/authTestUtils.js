import React from 'react'
import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const languageTuple = [{}, t]

export const baseLoginUIProps = {
  useLoginByEmail: true,
  useLoginByCellphone: false,
  handleChangeInput: vi.fn(),
  handleReCaptcha: vi.fn(),
  handleChangeTab: vi.fn(),
  handleButtonLoginClick: vi.fn(),
  handleSendVerifyCode: vi.fn(),
  handleCheckPhoneCode: vi.fn(),
  formState: { loading: false, result: null },
  verifyPhoneState: { loading: false },
  checkPhoneCodeState: { loading: false },
  loginTab: 'email',
  credentials: {},
  enableReCaptcha: false,
  useRootPoint: false,
  isCustomerMode: false,
  otpType: 'email',
  setOtpType: vi.fn(),
  generateOtpCode: vi.fn(),
  otpState: '',
  setOtpState: vi.fn(),
  useLoginOtpEmail: false,
  useLoginOtpCellphone: false,
  handleLoginSpoonity: vi.fn(),
  useLoginSpoonity: false
}

export const baseForgotPasswordUIProps = {
  hanldeChangeInput: vi.fn(),
  handleButtonForgotPasswordClick: vi.fn(),
  formState: { loading: false, result: { result: null, error: null } },
  handleReCaptcha: vi.fn(),
  enableReCaptcha: false,
  isRecaptchaEnable: false
}

export const baseResetPasswordUIProps = {
  code: 'code-1',
  random: 'random-1',
  formState: { loading: false, result: { result: null, error: null } },
  resetPasswordData: { code: 'code-1', random: 'random-1' },
  handleResetPassword: vi.fn(),
  handleChangeInput: vi.fn(),
  redirectResetPassword: vi.fn()
}

export const baseSignupUIProps = {
  handleChangeInput: vi.fn(),
  handleButtonSignupClick: vi.fn(),
  handleReCaptcha: vi.fn(),
  handleChangePromotions: vi.fn(),
  closeModal: vi.fn(),
  useChekoutFileds: false,
  validationFields: {
    fields: {
      checkout: {
        email: { id: 1, code: 'email', enabled: true, required: true, type: 'email' },
        cellphone: { id: 2, code: 'cellphone', enabled: false, required: false, type: 'text' },
        password: { id: 3, code: 'password', enabled: true, required: true, type: 'password' }
      }
    }
  },
  showField: () => true,
  isRequiredField: () => false,
  formState: { loading: false, result: { result: null, error: null } },
  handleSuccessSignup: vi.fn(),
  enableReCaptcha: false,
  signupData: {},
  fieldsNotValid: [],
  saveCustomerUser: false,
  signUpTab: 'default',
  setSignUpTab: vi.fn(),
  useSignUpFullDetails: true,
  useSignUpOtpEmail: false,
  useSignUpOtpCellphone: false,
  willVerifyOtpState: false,
  setWillVerifyOtpState: vi.fn(),
  otpState: '',
  setOtpState: vi.fn(),
  checkPhoneCodeState: { loading: false },
  generateOtpCode: vi.fn()
}

export const baseSessionsUIProps = {
  sessionsList: { loading: false, sessions: [] },
  actionState: { loading: false, error: null },
  handleDeleteSession: vi.fn(),
  handleDeleteAllSessions: vi.fn()
}

export const baseUserVerificationUIProps = {
  verifyEmailState: { loading: false, loadingSendCode: true, loadingCheckCode: false },
  verifyPhoneState: { loading: false, loadingSendCode: true, loadingCheckCode: false },
  sendVerifyEmailCode: vi.fn(),
  sendVerifyPhoneCode: vi.fn(),
  checkVerifyEmailCode: vi.fn(),
  checkVerifyPhoneCode: vi.fn(),
  cleanErrorsState: vi.fn()
}

export const createFranchiseUiMock = () => ({
  Alert: ({ open, title, content }) => (
    open
      ? <div data-testid='alert'>{title}{Array.isArray(content) ? content.join(' ') : content}</div>
      : null
  ),
  Confirm: ({ open, content, onAccept, handleOnAccept }) => (
    open
      ? (
        <div data-testid='confirm'>
          {content}
          <button type='button' onClick={onAccept || handleOnAccept}>Accept</button>
        </div>
        )
      : null
  ),
  Button: ({ children, onClick, type = 'button' }) => (
    <button type={type} onClick={onClick}>{children}</button>
  ),
  Input: React.forwardRef((props, ref) => <input ref={ref} {...props} />),
  Checkbox: (props) => <input type='checkbox' {...props} />,
  Modal: ({ open, children, onClose, onRemove }) => (
    open
      ? (
        <div data-testid='modal'>
          <button type='button' onClick={onClose || onRemove}>close</button>
          {children}
        </div>
        )
      : null
  ),
  SpinnerLoader: ({ content }) => <div data-testid='spinner'>{content}</div>,
  Tabs: ({ children }) => <div data-testid='tabs'>{children}</div>,
  Tab: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  InputPhoneNumber: () => <input data-testid='phone-input' />,
  LoginForm: () => <div data-testid='login-form' />,
  SignUpForm: () => <div data-testid='signup-form' />,
  ForgotPasswordForm: () => <div data-testid='forgot-form' />,
  UserDetails: () => <div data-testid='user-details' />,
  UserFormDetailsUI: () => <div data-testid='user-form-details' />,
  FacebookLoginButton: () => <button type='button'>fb</button>,
  GoogleLoginButton: () => <button type='button'>google</button>,
  AppleLogin: () => <button type='button'>apple</button>,
  SmsLoginButton: () => <button type='button'>sms</button>,
  useCountdownTimer: () => [600, () => {}, () => {}],
  useRecaptcha: () => [{}],
  formatSeconds: (value) => String(value ?? ''),
  sortInputFields: ({ values } = {}) => (
    Array.isArray(values) ? values : Object.values(values || {})
  )
})
