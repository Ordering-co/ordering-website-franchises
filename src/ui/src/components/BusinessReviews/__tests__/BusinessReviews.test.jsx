import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessReviews } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessReviews: ({ UIComponent, ...rest }) => (
    <UIComponent
      reviewsList={{ loading: false, reviews: [{ id: 1, name: 'Jane', quality: 5, created_at: '2026-01-01', comment: 'Great' }] }}
      totalReviews={1}
      stars={5}
      onChangeReview={vi.fn()}
      handleClickOption={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

describe('BusinessReviews', () => {
  it('renders reviews section title', () => {
    const { getByText } = renderWithProviders(<BusinessReviews businessId={1} />)
    expect(getByText('Reviews')).toBeInTheDocument()
  })
})
