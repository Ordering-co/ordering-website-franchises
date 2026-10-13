import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { PagesList } from '../index'

vi.mock('~ui', () => ({
  PagesList: ({ routes }) => (
    <div data-testid='pages-list-ui' data-route-count={routes?.length ?? 0}>
      {routes?.map((route) => (
        <span key={route.slug}>{route.name}</span>
      ))}
    </div>
  )
}))

describe('PagesList page', () => {
  it('passes franchise route catalog to pages list controller', () => {
    const { getByTestId, getByText } = renderWithProviders(<PagesList />)
    expect(getByTestId('pages-list-ui')).toHaveAttribute('data-route-count', '10')
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Checkout')).toBeInTheDocument()
  })
})
