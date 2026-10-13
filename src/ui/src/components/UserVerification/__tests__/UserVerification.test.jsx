import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseUserVerificationUIProps } from '../../../../../test/authTestUtils'
import { UserVerification } from '../index'

const verifyUIPropsRef = { current: null }
const sessionRef = {
  current: {
    auth: true,
    user: { email: 'a@b.c', cellphone: '555', country_phone_code: '1' }
  }
}
const configRef = {
  current: {
    configs: {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
  }
}

vi.mock('~components', () => ({
  UserVerification: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...verifyUIPropsRef.current} />
  ),
  UserFormDetails: () => null,
  useSession: () => [sessionRef.current, {}],
  useLanguage: () => [{}, (k, f) => f],
  useConfig: () => [configRef.current]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)
vi.mock('react-otp-input', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid='otp-input'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}))
vi.mock('react-bootstrap-icons', () => ({
  Envelope: () => <span data-testid='envelope-icon' />
}))

const defaultUser = { email: 'a@b.c', cellphone: '555', country_phone_code: '1' }
const emailConfigs = {
  configs: {
    verification_email_required: { value: '1' },
    verification_phone_required: { value: '0' }
  }
}
const phoneConfigs = {
  configs: {
    verification_email_required: { value: '0' },
    verification_phone_required: { value: '1' }
  }
}

const renderVerify = (overrides = {}) => {
  const { verificationType = 'email', ...uiOverrides } = overrides
  verifyUIPropsRef.current = {
    ...baseUserVerificationUIProps,
    sendVerifyEmailCode: vi.fn(),
    sendVerifyPhoneCode: vi.fn(),
    checkVerifyEmailCode: vi.fn(),
    checkVerifyPhoneCode: vi.fn(),
    cleanErrorsState: vi.fn(),
    ...uiOverrides
  }

  return renderWithProviders(
    <UserVerification
      verificationType={verificationType}
      generalUtilities={() => ({})}
    />
  )
}

describe('UserVerification', () => {
  beforeEach(() => {
    sessionRef.current = { auth: true, user: { ...defaultUser } }
    configRef.current = emailConfigs
    verifyUIPropsRef.current = null
  })

  it('renders email verification and sends a code', () => {
    const { getByText, getByPlaceholderText } = renderVerify({
      verificationType: 'email',
      verifyEmailState: { loadingSendCode: false, loadingCheckCode: false }
    })

    expect(getByText('Verification Code')).toBeInTheDocument()
    expect(getByText('In order to continue using our platform please verify your email')).toBeInTheDocument()
    expect(getByPlaceholderText('a@b.c')).toBeInTheDocument()

    fireEvent.click(getByText('Send code'))
    expect(verifyUIPropsRef.current.sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'a@b.c' })
  })

  it('disables send while email verification is loading and alerts on error', () => {
    const { getByText, getByTestId } = renderVerify({
      verificationType: 'email',
      verifyEmailState: {
        loadingSendCode: true,
        loadingCheckCode: false,
        errorSendCode: ['Could not send email code']
      }
    })

    expect(getByText('Send code')).toBeDisabled()
    expect(getByTestId('alert')).toHaveTextContent('Could not send email code')
  })

  it('checks the email code after it is sent', async () => {
    const { findByTestId } = renderVerify({
      verificationType: 'email',
      verifyEmailState: {
        loadingSendCode: false,
        loadingCheckCode: false,
        resultSendCode: true
      }
    })

    const otpInput = await findByTestId('otp-input')
    fireEvent.change(otpInput, { target: { value: '123456' } })
    expect(verifyUIPropsRef.current.checkVerifyEmailCode).toHaveBeenCalledWith({ code: '123456' })
  })

  it('renders phone verification and sends a code', async () => {
    configRef.current = phoneConfigs
    const { findByText, getByTestId, getByText } = renderVerify({
      verificationType: 'phone',
      verifyPhoneState: { loadingSendCode: false, loadingCheckCode: false }
    })

    expect(await findByText('In order to continue using our platform please verify your phone number')).toBeInTheDocument()
    expect(getByTestId('phone-input')).toBeInTheDocument()

    fireEvent.click(getByText('Send code'))
    expect(verifyUIPropsRef.current.sendVerifyPhoneCode).toHaveBeenCalledWith({
      cellphone: '555',
      country_phone_code: '1'
    })
  })

  it('checks the phone code after it is sent', async () => {
    configRef.current = phoneConfigs
    const { findByTestId } = renderVerify({
      verificationType: 'phone',
      verifyPhoneState: {
        loadingSendCode: false,
        loadingCheckCode: false,
        resultSendCode: true
      }
    })

    const otpInput = await findByTestId('otp-input')
    fireEvent.change(otpInput, { target: { value: '1234' } })
    expect(verifyUIPropsRef.current.checkVerifyPhoneCode).toHaveBeenCalledWith({
      cellphone: '555',
      country_phone_code: 1,
      code: '1234'
    })
  })

  it('disables send while phone verification is loading', async () => {
    configRef.current = phoneConfigs
    const { findByText } = renderVerify({
      verificationType: 'phone',
      verifyPhoneState: { loadingSendCode: true, loadingCheckCode: false }
    })

    expect(await findByText('Send code')).toBeDisabled()
  })
})
