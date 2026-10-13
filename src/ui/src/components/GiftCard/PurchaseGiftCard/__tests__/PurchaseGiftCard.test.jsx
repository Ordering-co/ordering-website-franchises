import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import {
  giftCardProduct,
  giftCardProducts
} from '../../../../../../test/giftCardUiTestUtils'
import { PurchaseGiftCard } from '../index'

const purchasePropsRef = { current: null }
const setSelectedProduct = vi.fn()
const handleAccept = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('@meronex/icons/ri/RiRadioButtonFill', () => ({
  default: () => <span>selected</span>
}))
vi.mock('@meronex/icons/md/MdRadioButtonUnchecked', () => ({
  default: () => <span>unselected</span>
}))
vi.mock('~components', () => ({
  ...require('../../../../../../test/giftCardUiTestUtils').baseGiftCardHooks,
  PurchaseGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../../test/giftCardUiTestUtils').basePurchaseGiftCardUIProps}
      setSelectedProduct={setSelectedProduct}
      handleAccept={handleAccept}
      {...rest}
      {...purchasePropsRef.current}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  NotFoundSource: ({ content, children }) => <div>{content}{children}Not found</div>
}))

describe('PurchaseGiftCard', () => {
  it('renders options and accepts the selected card', () => {
    purchasePropsRef.current = null
    const { getByText, getAllByText } = renderWithProviders(<PurchaseGiftCard />)
    expect(getByText('Gift card')).toBeInTheDocument()
    expect(getByText('Select one option')).toBeInTheDocument()
    expect(getByText('Card $25')).toBeInTheDocument()
    expect(getByText('Card $50')).toBeInTheDocument()
    expect(getByText('selected')).toBeInTheDocument()
    expect(getByText('unselected')).toBeInTheDocument()
    fireEvent.click(getByText('Card $50'))
    expect(setSelectedProduct).toHaveBeenCalledWith(giftCardProducts[1])
    fireEvent.click(getAllByText('Accept')[0])
    expect(handleAccept).toHaveBeenCalled()
  })

  it('disables accept when no product is selected', () => {
    purchasePropsRef.current = {
      selectedProduct: null
    }
    const { getByText } = renderWithProviders(<PurchaseGiftCard />)
    expect(getByText('Accept')).toBeDisabled()
    purchasePropsRef.current = null
  })

  it('shows skeletons while products load', () => {
    purchasePropsRef.current = {
      productsListState: { loading: true, products: [] },
      selectedProduct: null
    }
    const { getAllByTestId, queryByText } = renderWithProviders(<PurchaseGiftCard />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
    expect(queryByText('Not found')).not.toBeInTheDocument()
    purchasePropsRef.current = null
  })

  it('shows an empty state when no products exist', () => {
    purchasePropsRef.current = {
      productsListState: { loading: false, products: [] },
      selectedProduct: giftCardProduct
    }
    const { getByText } = renderWithProviders(<PurchaseGiftCard />)
    expect(getByText('Not found')).toBeInTheDocument()
    purchasePropsRef.current = null
  })
})
