import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Cms } from '../index'

const push = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  Cms: (props) => (
    <div data-testid='cms-ui' data-page-slug={props.pageSlug} />
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ pageSlug: 'about' }),
    useHistory: () => ({ push })
  }
})

describe('Cms page', () => {
  it('renders helmet tags and passes page slug to cms controller', () => {
    const { getByTestId } = renderWithProviders(<Cms />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'pages')
    expect(getByTestId('cms-ui')).toHaveAttribute('data-page-slug', 'about')
  })
})
