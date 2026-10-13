import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import {
  emptyGiftCardList,
  loadingGiftCardList,
  pendingGiftCard
} from '../../../../../../test/giftCardUiTestUtils'
import { VerticalGiftCardOrdersLayout } from '../index'

const layoutPropsRef = { current: null }
const setIsEmpty = vi.fn()
const loadMoreOrders = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('../../SingleGiftCard', () => ({
  SingleGiftCard: ({ card, isSkeleton }) => (
    <div data-testid={isSkeleton ? 'gift-card-skeleton' : 'gift-card'}>
      {isSkeleton ? 'skeleton card' : card?.order_product?.name}
    </div>
  )
}))
vi.mock('~components', () => ({
  ...require('../../../../../../test/giftCardUiTestUtils').baseGiftCardHooks,
  GiftCardOrdersList: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../../test/giftCardUiTestUtils').baseGiftCardOrdersLayoutUIProps}
      setIsEmpty={setIsEmpty}
      loadMoreOrders={loadMoreOrders}
      {...rest}
      {...layoutPropsRef.current}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('VerticalGiftCardOrdersLayout', () => {
  it('renders cards and the section title', () => {
    layoutPropsRef.current = null
    const { getByText, queryByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout title='Pending' />
    )
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Gift Card $25')).toBeInTheDocument()
    expect(queryByText('Load more orders')).not.toBeInTheDocument()
  })

  it('shows skeletons while gift cards load', () => {
    layoutPropsRef.current = {
      giftCards: loadingGiftCardList
    }
    const { getAllByTestId, queryByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout title='Pending' />
    )
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
    expect(getAllByTestId('gift-card-skeleton').length).toBe(10)
    expect(queryByText('Pending')).not.toBeInTheDocument()
    layoutPropsRef.current = null
  })

  it('marks the section empty when the list is empty', async () => {
    layoutPropsRef.current = {
      giftCards: emptyGiftCardList,
      setIsEmpty
    }
    renderWithProviders(<VerticalGiftCardOrdersLayout setIsEmpty={setIsEmpty} />)
    await waitFor(() => {
      expect(setIsEmpty).toHaveBeenCalledWith(true)
    })
    layoutPropsRef.current = null
  })

  it('loads more orders when another page exists', () => {
    layoutPropsRef.current = {
      giftCards: { loading: false, list: [pendingGiftCard] },
      paginationProps: { currentPage: 1, totalPages: 2 },
      loadMoreOrders
    }
    const { getByText } = renderWithProviders(<VerticalGiftCardOrdersLayout />)
    fireEvent.click(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
    layoutPropsRef.current = null
  })
})
