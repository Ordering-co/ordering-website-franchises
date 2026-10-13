import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ReviewProfessional } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/md/MdClose', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/fa/FaUserAlt', () => ({ default: () => <span /> }))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  ReviewDriver: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      order={{
        products: [{ calendar_event: { professional: { name: 'Pro', photo: null } } }]
      }}
      dirverReviews={{ qualification: 5, comment: '' }}
      formState={{ loading: false, result: {} }}
      setDriverReviews={() => {}}
      closeReviewProfessional={() => {}}
      setIsProfessionalReviewed={() => {}}
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

describe('ReviewProfessional', () => {
  it('renders professional service review', () => {
    const { getByText } = renderWithProviders(<ReviewProfessional />)
    expect(getByText('How was your service?')).toBeInTheDocument()
  })
})
