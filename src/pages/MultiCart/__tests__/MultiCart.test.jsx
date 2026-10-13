import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { MultiCart } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  MultiCart: (props) => (
    <div
      data-testid='multi-cart-ui'
      data-cart-uuid={props.cartUuid}
      data-cart-group={props.cartGroup}
    >
      <button type='button' onClick={() => props.handleOnRedirectCheckout('cart-1')}>checkout</button>
      <button type='button' onClick={() => props.handleOnRedirectMultiCheckout('cart-2')}>multi-checkout</button>
      <button type='button' onClick={() => props.onRedirectPage({ page: 'search' })}>search</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ cartUuid: 'cart-9', cartGroup: 'group-1' })
  }
})

describe('MultiCart page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders multi cart helmet tags and route params', () => {
    const { getByTestId } = renderWithProviders(<MultiCart />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'multi_cart')
    expect(getByTestId('multi-cart-ui')).toHaveAttribute('data-cart-uuid', 'cart-9')
    expect(getByTestId('multi-cart-ui')).toHaveAttribute('data-cart-group', 'group-1')
  })

  it('emits navigation events from multi cart callbacks', () => {
    const { getByText } = renderWithProviders(<MultiCart />)

    getByText('checkout').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'checkout',
      params: { cartUuid: 'cart-1' },
      replace: true
    })

    getByText('multi-checkout').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'multi_checkout',
      params: { cartUuid: 'cart-2' },
      replace: true
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
  })
})
