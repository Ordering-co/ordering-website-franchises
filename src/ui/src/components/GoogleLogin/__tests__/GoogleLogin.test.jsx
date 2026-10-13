import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { GoogleLoginButton } from '../index'

const signInWithGoogle = vi.fn()

vi.mock('~components', () => ({
  FirebaseGoogleLoginButton: ({ UIComponent, ...rest }) => (
    <UIComponent signInWithGoogle={signInWithGoogle} actionState={{ loading: false }} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('GoogleLoginButton', () => {
  it('renders the Google label and triggers sign in', () => {
    const { getByText } = renderWithProviders(<GoogleLoginButton />)
    fireEvent.click(getByText('Continue with Google'))
    expect(signInWithGoogle).toHaveBeenCalled()
  })
})
