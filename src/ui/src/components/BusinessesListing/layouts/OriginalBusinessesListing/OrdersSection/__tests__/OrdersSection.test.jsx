import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../../test/renderWithProviders'
import { OrdersSection } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ carts: [] }, {}]
}))
vi.mock('~ui', () => ({
  OrdersOption: ({ titleContent }) => <div data-testid='orders-option'>{titleContent}</div>
}))

describe('OrdersSection', () => {
  it('renders order sections when redirect handler is provided', () => {
    const { getAllByTestId } = renderWithProviders(
      <OrdersSection
        onRedirectPage={vi.fn()}
        businessesIds={[]}
        businessesList={{ loading: false }}
        franchiseId='franchise-a'
        getCustomArray={() => []}
      />
    )
    expect(getAllByTestId('orders-option').length).toBe(3)
  })
})
