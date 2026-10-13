import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CancellationComponent } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

const ButtonComponent = ({ children }) => (
  <button type='button'>{children}</button>
)
const InputComponent = (props) => (
  <input data-testid='cancellation-email' {...props} />
)

describe('CancellationComponent', () => {
  it('renders archived site copy and contact controls', () => {
    const { getByText, getByAltText, getByTestId, getAllByRole } = renderWithProviders(
      <CancellationComponent
        bgUrl='bg.png'
        logoUrl='logo.png'
        ButtonComponent={ButtonComponent}
        InputComponent={InputComponent}
      />
    )
    expect(getByText('SITE OUT OF SERVICE')).toBeInTheDocument()
    expect(getByAltText('bg')).toHaveAttribute('src', 'bg.png')
    expect(getByAltText('logo')).toHaveAttribute('src', 'logo.png')
    expect(getByText('Contact us')).toBeInTheDocument()
    expect(getByText('Send')).toBeInTheDocument()
    expect(getByTestId('cancellation-email')).toHaveAttribute('placeholder', 'Email')
    expect(getAllByRole('button')).toHaveLength(2)
  })

  it('falls back to theme images when urls are omitted', () => {
    const { getByAltText } = renderWithProviders(
      <CancellationComponent />,
      {
        themeOverrides: {
          images: {
            general: { businessHero: 'hero.png' },
            logos: { logotype: 'mark.png' }
          }
        }
      }
    )
    expect(getByAltText('bg')).toHaveAttribute('src', 'hero.png')
    expect(getByAltText('logo')).toHaveAttribute('src', 'mark.png')
  })
})
