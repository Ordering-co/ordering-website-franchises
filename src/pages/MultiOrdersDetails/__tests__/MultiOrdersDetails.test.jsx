import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { MultiOrdersDetails } from '../index'

const emit = vi.fn()
const push = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  MultiOrdersDetails: (props) => (
    <div data-testid='multi-orders-details-ui' data-order-id={props.orderId}>
      <button type='button' onClick={props.onRedirectPage}>search</button>
      <button type='button' onClick={props.handleOrderRedirect}>orders</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ orderId: 'multi-9' }),
    useHistory: () => ({ push })
  }
})

describe('MultiOrdersDetails page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders multi orders helmet tags and order id', () => {
    const { getByTestId } = renderWithProviders(<MultiOrdersDetails />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'multi_orders')
    expect(getByTestId('multi-orders-details-ui')).toHaveAttribute('data-order-id', 'multi-9')
  })

  it('emits search redirect and pushes profile orders from callbacks', () => {
    const { getByText } = renderWithProviders(<MultiOrdersDetails />)
    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
    getByText('orders').click()
    expect(push).toHaveBeenCalledWith('/profile/orders')
  })
})
