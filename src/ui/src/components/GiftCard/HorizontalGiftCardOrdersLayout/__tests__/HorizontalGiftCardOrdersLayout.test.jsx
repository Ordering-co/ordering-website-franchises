import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import {
  emptyGiftCardList,
  loadingGiftCardList,
  pendingGiftCard
} from '../../../../../../test/giftCardUiTestUtils'
import { HorizontalGiftCardOrdersLayout } from '../index'

const layoutPropsRef = { current: null }
const setIsEmpty = vi.fn()
const goToPage = vi.fn()

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
      goToPage={goToPage}
      {...rest}
      {...layoutPropsRef.current}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  AutoScroll: ({ children, scrollId }) => <div data-testid={scrollId}>{children}</div>,
  Pagination: ({ currentPage, totalPages, handleChangePage }) => (
    <button
      type='button'
      data-testid='pagination'
      onClick={() => handleChangePage(2)}
    >
      page {currentPage} of {totalPages}
    </button>
  )
}))

describe('HorizontalGiftCardOrdersLayout', () => {
  it('renders cards and the section title', () => {
    layoutPropsRef.current = null
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <HorizontalGiftCardOrdersLayout title='Pending' scrollId='pendingGifts' />
    )
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Gift Card $25')).toBeInTheDocument()
    expect(getByTestId('pendingGifts')).toBeInTheDocument()
    expect(queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('shows skeletons while gift cards load', () => {
    layoutPropsRef.current = {
      giftCards: loadingGiftCardList,
      title: 'Pending'
    }
    const { getAllByTestId, queryByText } = renderWithProviders(
      <HorizontalGiftCardOrdersLayout title='Pending' />
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
    renderWithProviders(<HorizontalGiftCardOrdersLayout setIsEmpty={setIsEmpty} />)
    await waitFor(() => {
      expect(setIsEmpty).toHaveBeenCalledWith(true)
    })
    layoutPropsRef.current = null
  })

  it('paginates when more than one page exists', () => {
    layoutPropsRef.current = {
      giftCards: { loading: false, list: [pendingGiftCard] },
      paginationProps: { currentPage: 1, totalPages: 3 },
      goToPage
    }
    const { getByTestId } = renderWithProviders(<HorizontalGiftCardOrdersLayout />)
    fireEvent.click(getByTestId('pagination'))
    expect(goToPage).toHaveBeenCalledWith(2)
    layoutPropsRef.current = null
  })
})
