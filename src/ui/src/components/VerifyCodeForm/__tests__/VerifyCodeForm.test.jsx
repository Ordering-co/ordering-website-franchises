import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { VerifyCodeForm } from '../index'

const handleCheckPhoneCode = vi.fn()
const handleSendOtp = vi.fn()

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)
vi.mock('react-otp-input', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid='otp-input'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}))

describe('VerifyCodeForm', () => {
  it('submits OTP when four digits are entered', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <VerifyCodeForm
        otpLeftTime={120}
        handleSendOtp={handleSendOtp}
        handleCheckPhoneCode={handleCheckPhoneCode}
        credentials={{ cellphone: '5551234567', country_phone_code: '+1' }}
        email='user@example.com'
        isPhone
      />
    )
    fireEvent.change(getByTestId('otp-input'), { target: { value: '1234' } })
    expect(handleCheckPhoneCode).toHaveBeenCalledWith({
      cellphone: '5551234567',
      country_phone_code: '+1',
      code: '1234'
    })
    fireEvent.click(getByText('Resend code'))
    expect(handleSendOtp).toHaveBeenCalled()
  })
})
