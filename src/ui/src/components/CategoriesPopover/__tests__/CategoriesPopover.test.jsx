import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CategoriesPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {} }
  })
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  useWindowSize: () => ({ width: 1200, height: 800 }),
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null),
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))

describe('CategoriesPopover', () => {
  it('renders order header and popover content when open', () => {
    const CategoriesPopoverUI = () => <div data-testid='categories-ui'>Categories content</div>
    const { getByText, getByTestId } = renderWithProviders(
      <CategoriesPopover
        open
        carts={[{ products: [{ id: 1 }, { id: 2 }] }]}
        CategoriesPopoverUI={CategoriesPopoverUI}
        onClick={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(getByText('Order')).toBeInTheDocument()
    expect(getByTestId('categories-ui')).toBeInTheDocument()
  })
})
