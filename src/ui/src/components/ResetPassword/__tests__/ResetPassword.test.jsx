import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseResetPasswordUIProps } from '../../../../../test/authTestUtils'
import { ResetPassword } from '../index'

const resetPropsRef = { current: null }

vi.mock('~components', () => ({
  ResetPassword: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...resetPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('ResetPassword UI', () => {
  it('renders the reset password form when code and random exist', () => {
    resetPropsRef.current = { ...baseResetPasswordUIProps }
    const { getByText } = renderWithProviders(<ResetPassword code='abc' random='xyz' />)
    expect(getByText('Reset password')).toBeInTheDocument()
    expect(getByText('Change password')).toBeInTheDocument()
  })

  it('renders the code entry form when code and random are missing', () => {
    resetPropsRef.current = {
      ...baseResetPasswordUIProps,
      code: null,
      random: null
    }
    const { getByText } = renderWithProviders(<ResetPassword />)
    expect(getByText('Please insert the codes')).toBeInTheDocument()
  })
})
