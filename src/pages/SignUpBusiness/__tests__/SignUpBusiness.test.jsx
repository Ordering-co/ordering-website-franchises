import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { SignUpBusiness } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  SignUpBusiness: (props) => (
    <div
      data-testid='signup-business-ui'
      data-driver-signup={String(!!props.isDriverSignup)}
    />
  )
}))

describe('SignUpBusiness page', () => {
  it('renders helmet tags and wires the business signup controller', () => {
    const { getByTestId } = renderWithProviders(<SignUpBusiness />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'signup_business')
    expect(getByTestId('signup-business-ui')).toHaveAttribute('data-driver-signup', 'false')
  })
})
