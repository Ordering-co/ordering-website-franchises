import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LinkableText } from '../index'

describe('LinkableText', () => {
  it('renders plain text without turning it into a link', () => {
    const { getByText, queryByRole } = renderWithProviders(
      <LinkableText text='Thanks for your order' />
    )
    expect(getByText('Thanks for your order')).toBeInTheDocument()
    expect(queryByRole('link')).not.toBeInTheDocument()
  })

  it('turns urls into links', () => {
    const { getByRole } = renderWithProviders(
      <LinkableText text='Visit https://www.finitless.com for help' />
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.finitless.com')
    expect(link).toHaveAttribute('target', 'blank')
    expect(link).toHaveTextContent('https://www.finitless.com')
  })
})
