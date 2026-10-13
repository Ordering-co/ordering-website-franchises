import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductShare } from '../index'

vi.mock('~components', () => ({
  ProductShare: ({ UIComponent, ...rest }) => (
    <UIComponent
      updateShowValue={vi.fn()}
      showShareButton={false}
      urlToShare='https://example.com/store/demo?category=10&product=100'
      {...rest}
    />
  )
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Modal: () => null
}))
vi.mock('../ProductCopyURL', () => ({
  ProductCopyURL: () => null
}))

describe('ProductShare', () => {
  it('renders share button text', () => {
    const { getByText } = renderWithProviders(
      <ProductShare
        slug='demo'
        categoryId={10}
        productId={100}
        product={{ id: 100, name: 'Cheeseburger' }}
        withBtn
        btnText='Share'
      />
    )
    expect(getByText('Share')).toBeInTheDocument()
  })
})
