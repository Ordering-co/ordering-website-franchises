import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseOrder } from '../../../../../test/ordersUiTestUtils'
import { ReviewDriver } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/md/MdClose', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/fa/FaUserAlt', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ai/AiFillStar', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ai/AiOutlineStar', () => ({ default: () => <span /> }))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  ReviewDriver: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      order={require('../../../../../test/ordersUiTestUtils').baseOrder}
      dirverReviews={{ qualification: 5, comment: '' }}
      formState={{ loading: false, result: {} }}
      setDriverReviews={() => {}}
      closeReviewDriver={() => {}}
      setIsDriverReviewed={() => {}}
      handleSendDriverReview={() => {}}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  reviewCommentList: require('../../../../../test/ordersUiTestUtils').reviewCommentListMock,
  TextArea: (props) => <textarea {...props} />
}))

describe('ReviewDriver', () => {
  it('renders send review action', () => {
    const { getByText } = renderWithProviders(<ReviewDriver order={baseOrder} />)
    expect(getByText('Send review')).toBeInTheDocument()
  })
})
