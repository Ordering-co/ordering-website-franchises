import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { AppleLogin } from '../index'

const initLoginApple = vi.fn()

vi.mock('~components', () => ({
  AppleLogin: ({ UIComponent, ...rest }) => (
    <UIComponent initLoginApple={initLoginApple} formState={{ loading: false }} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('AppleLogin', () => {
  it('renders the Apple label and triggers login', () => {
    const { getByText } = renderWithProviders(<AppleLogin />)
    fireEvent.click(getByText('Continue with Apple'))
    expect(initLoginApple).toHaveBeenCalled()
  })
})
