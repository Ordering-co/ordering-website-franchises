import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { OrderActionsSection } from './OrderActionsSection'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../test/franchiseUiMock').franchiseUiMock
}))

describe('OrderActionsSection', () => {
  it('navigates to the orders list', () => {
    const handleGoToPage = vi.fn()
    const { getByText } = renderWithProviders(
      <OrderActionsSection handleGoToPage={handleGoToPage} />
    )
    fireEvent.click(getByText('Your Orders'))
    expect(handleGoToPage).toHaveBeenCalledWith({ page: 'orders' })
  })

  it('shows appointments for service orders', () => {
    const { getByText } = renderWithProviders(
      <OrderActionsSection isService handleGoToPage={() => {}} />
    )
    expect(getByText('Your appointments')).toBeInTheDocument()
  })

  it('hides actions for customer impersonation', () => {
    const { queryByText } = renderWithProviders(
      <OrderActionsSection userCustomerId={9} handleGoToPage={() => {}} />
    )
    expect(queryByText('Your Orders')).toBeNull()
  })
})
