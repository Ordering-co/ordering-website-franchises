import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Help } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('../../../config', () => ({
  __esModule: true,
  default: { franchiseSlug: 'franchise-demo' }
}))
vi.mock('~ui', () => ({
  Help: (props) => (
    <div data-testid='help-ui' data-franchise-id={props.franchiseId} />
  )
}))

describe('Help page', () => {
  it('renders helmet tags and passes franchise slug to help controller', () => {
    const { getByTestId } = renderWithProviders(<Help />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'help')
    expect(getByTestId('help-ui')).toHaveAttribute('data-franchise-id', 'franchise-demo')
  })
})
