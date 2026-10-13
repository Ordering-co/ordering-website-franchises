import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SpinnerLoader } from '../index'

describe('SpinnerLoader', () => {
  it('renders a spinner without extra content', () => {
    const { container } = renderWithProviders(<SpinnerLoader />)
    expect(container.querySelector('.spinner')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders a logotype, message, and custom styles', () => {
    const { getByAltText, getByText, container } = renderWithProviders(
      <SpinnerLoader
        logotype='logo.png'
        content='Loading stores'
        style={{ background: 'white' }}
        iconStyle={{ opacity: 0.5 }}
      />
    )
    expect(getByAltText('logo')).toHaveAttribute('src', 'logo.png')
    expect(getByText('Loading stores')).toBeInTheDocument()
    expect(container.querySelector('.spinner-content')).not.toBeNull()
  })
})
