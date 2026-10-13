import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { ReviewOrder } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/md/MdClose', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ai/AiFillStar', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ai/AiOutlineStar', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/bs/BsArrowRight', () => ({ default: () => <span /> }))
vi.mock('~components', () => ({
  ...require('../../../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  OrderReview: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      order={require('../../../../../../../test/ordersUiTestUtils').baseOrder}
      stars={{ quality: 5, punctuality: 5, service: 5, packaging: 5, comments: '' }}
      formState={{ loading: false, result: {} }}
      handleSendReview={() => {}}
      closeReviewOrder={() => {}}
      setIsReviewed={() => {}}
      setStars={() => {}}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  reviewCommentList: require('../../../../../../../test/ordersUiTestUtils').reviewCommentListMock,
  TextArea: (props) => <textarea {...props} />
}))

describe('ReviewOrder Simple', () => {
  it('renders simple order review heading', () => {
    const { getByText } = renderWithProviders(<ReviewOrder />)
    expect(getByText('How was your order?')).toBeInTheDocument()
  })
})
