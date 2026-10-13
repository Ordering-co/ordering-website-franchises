import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { TaxInformation } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  SingleProductCard: ({ product }) => <div data-testid='product-card'>{product?.name}</div>
}))

describe('TaxInformation', () => {
  it('renders tax description heading', () => {
    const { getByText } = renderWithProviders(
      <TaxInformation
        type='tax'
        data={{ id: 1, description: 'City sales tax', type: 2, target: 'product' }}
        products={[]}
      />
    )
    expect(getByText(/Description:/)).toBeInTheDocument()
    expect(getByText(/City sales tax/)).toBeInTheDocument()
  })

  it('renders included-on-price label for type 1 taxes', () => {
    const { getByText } = renderWithProviders(
      <TaxInformation
        type='tax'
        data={{ id: 2, description: 'VAT', type: 1, target: 'product' }}
        products={[]}
      />
    )
    expect(getByText(/Included on price/)).toBeInTheDocument()
  })

  it('renders fee heading and matching products', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <TaxInformation
        type='fee'
        data={{ id: 3, description: 'Service fee', type: 2, target: 'product' }}
        products={[{ id: 10, name: 'Burger', code: 'BRG-1', fee: { id: 3 } }]}
      />
    )
    expect(getByText(/Other products with this/)).toBeInTheDocument()
    expect(getByText(/Fee/)).toBeInTheDocument()
    expect(getByTestId('product-card')).toHaveTextContent('Burger')
  })

  it('renders fallback heading when description is missing', () => {
    const { getByText } = renderWithProviders(
      <TaxInformation
        type='tax'
        data={{ id: null, type: 2, target: 'product' }}
        products={[]}
      />
    )
    expect(getByText('Without description')).toBeInTheDocument()
  })

  it('hides product list for offer target types', () => {
    const { queryByText } = renderWithProviders(
      <TaxInformation
        type='offer_target_2'
        data={{ id: 1, description: 'Promo' }}
        products={[{ id: 1, name: 'Burger', code: 'BRG-1' }]}
      />
    )
    expect(queryByText(/Other products with this/)).not.toBeInTheDocument()
  })
})
