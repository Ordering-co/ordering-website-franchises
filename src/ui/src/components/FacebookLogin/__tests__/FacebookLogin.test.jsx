import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { FacebookLoginButton } from '../index'

const handleFacebookLogin = vi.fn()

vi.mock('~components', () => ({
  FacebookLoginButton: ({ UIComponent, ...rest }) => (
    <UIComponent handleFacebookLogin={handleFacebookLogin} formState={{ loading: false }} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('FacebookLoginButton', () => {
  it('renders the Facebook label and triggers login', () => {
    const { getByText } = renderWithProviders(<FacebookLoginButton />)
    fireEvent.click(getByText('Continue with Facebook'))
    expect(handleFacebookLogin).toHaveBeenCalled()
  })
})
