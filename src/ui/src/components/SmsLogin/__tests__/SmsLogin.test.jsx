import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SmsLoginButton } from '../index'

const handleSmsLogin = vi.fn()

vi.mock('~components', () => ({
  LoginForm: ({ UIComponent, ...rest }) => (
    <UIComponent handleSmsLogin={handleSmsLogin} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('SmsLoginButton', () => {
  it('renders the SMS label and triggers login', () => {
    const { getByText } = renderWithProviders(<SmsLoginButton />)
    fireEvent.click(getByText('Login with SMS'))
    expect(handleSmsLogin).toHaveBeenCalled()
  })
})
