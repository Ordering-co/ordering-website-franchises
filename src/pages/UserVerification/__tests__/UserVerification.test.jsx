import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { UserVerification } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  UserVerification: (props) => (
    <div data-testid='user-verification-ui' data-props={JSON.stringify(Object.keys(props))} />
  )
}))

describe('UserVerification page', () => {
  it('renders helmet tags and passes props to the controller', () => {
    const { getByTestId } = renderWithProviders(
      <UserVerification verificationType='email' />
    )
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'user-verification')
    expect(getByTestId('user-verification-ui')).toBeInTheDocument()
  })
})
