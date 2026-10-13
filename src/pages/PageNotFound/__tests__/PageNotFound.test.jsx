import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import PageNotFound from '../index'

vi.mock('~ui', () => ({
  PageNotFound: (props) => (
    <div data-testid='page-not-found-ui' {...props} />
  )
}))

describe('PageNotFound page', () => {
  it('renders the page not found controller', () => {
    const { getByTestId } = renderWithProviders(<PageNotFound />)
    expect(getByTestId('page-not-found-ui')).toBeInTheDocument()
  })
})
