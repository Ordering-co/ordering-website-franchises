import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { SignUpDriver } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  SignUpDriver: (props) => (
    <div
      data-testid='signup-driver-ui'
      data-driver-signup={String(!!props.isDriverSignup)}
    />
  )
}))

describe('SignUpDriver page', () => {
  it('renders helmet tags and passes isDriverSignup to the controller', () => {
    const { getByTestId } = renderWithProviders(<SignUpDriver />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'signup_driver')
    expect(getByTestId('signup-driver-ui')).toHaveAttribute('data-driver-signup', 'true')
  })
})
