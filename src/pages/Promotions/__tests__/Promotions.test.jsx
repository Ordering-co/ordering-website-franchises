import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Promotions } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  Promotions: () => <div data-testid='promotions-ui' />
}))

describe('Promotions page', () => {
  it('renders helmet tags and promotions controller', () => {
    const { getByTestId } = renderWithProviders(<Promotions />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'promotions')
    expect(getByTestId('promotions-ui')).toBeInTheDocument()
  })
})
