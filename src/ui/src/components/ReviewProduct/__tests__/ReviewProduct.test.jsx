import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ReviewProduct } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  ReviewProduct: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      order={{
        products: [{ id: 1, product_id: 1, name: 'Burger' }]
      }}
      formState={{ loading: false, changes: [{ product_id: 1 }], result: {} }}
      closeReviewProduct={() => {}}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  reviewCommentList: require('../../../../../test/ordersUiTestUtils').reviewCommentListMock,
  TextArea: (props) => <textarea {...props} />
}))

describe('ReviewProduct', () => {
  it('renders additional comments and continue', () => {
    const { getByText } = renderWithProviders(<ReviewProduct />)
    expect(getByText('Additional comments')).toBeInTheDocument()
    expect(getByText('Continue')).toBeInTheDocument()
  })
})
