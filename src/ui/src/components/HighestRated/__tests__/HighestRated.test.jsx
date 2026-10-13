import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { HighestRated } from '../index'

vi.mock('~components', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesList={{ loading: false, businesses: [{ id: 1, name: 'Top Store', reviews: { total: 3 }, open: true, enabled: true, favorite: false }] }}
      handleBusinessClick={vi.fn()}
      setHasHighRatedBusiness={vi.fn()}
      favoriteIds={[]}
      setFavoriteIds={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 } }, {}]
}))
vi.mock('~ui', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>,
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null),
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  BusinessPreorder: () => <div data-testid='business-preorder' />,
  BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>,
  NotFoundSource: ({ content }) => <div>{content}</div>,
  getCateringValues: () => ({})
}))

describe('HighestRated', () => {
  it('renders highest rated section with business cards', () => {
    const { getByText, getByTestId } = renderWithProviders(<HighestRated />)
    expect(getByText('Highest rated')).toBeInTheDocument()
    expect(getByTestId('business-card')).toHaveTextContent('Top Store')
  })
})
