import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Favorite } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  Favorite: (props) => <div data-testid='favorite-ui' data-test-prop={props['data-test-prop']} />
}))

describe('Favorite page', () => {
  it('renders helmet tags and passes props to favorite controller', () => {
    const { getByTestId } = renderWithProviders(<Favorite data-test-prop='franchise-fav' />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'favorite')
    expect(getByTestId('favorite-ui')).toHaveAttribute('data-test-prop', 'franchise-fav')
  })
})
