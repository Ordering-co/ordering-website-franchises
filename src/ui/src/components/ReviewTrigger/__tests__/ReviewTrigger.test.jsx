import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseOrder } from '../../../../../test/ordersUiTestUtils'
import { ReviewTrigger } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/bs/BsArrowRight', () => ({
  default: () => <span />
}))
vi.mock('react-bootstrap-icons', () => ({
  Star: () => <span />,
  StarFill: () => <span />
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('ReviewTrigger', () => {
  it('renders the review call to action', () => {
    const { queryByText } = renderWithProviders(
      <ReviewTrigger order={baseOrder} handleOpenOrderReview={() => {}} />
    )
    expect(
      queryByText('Go to review') || queryByText(/Do not forget to rate/)
    ).toBeTruthy()
  })
})
