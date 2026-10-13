import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { SessionsList } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui', () => ({
  SessionsList: (props) => (
    <div data-testid='sessions-list-ui' data-props={JSON.stringify(Object.keys(props))} />
  )
}))

describe('SessionsList page', () => {
  it('renders helmet tags and passes props to the controller', () => {
    const { getByTestId } = renderWithProviders(
      <SessionsList onNavigationRedirect={vi.fn()} />
    )
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'sessions')
    expect(getByTestId('sessions-list-ui')).toBeInTheDocument()
  })
})
