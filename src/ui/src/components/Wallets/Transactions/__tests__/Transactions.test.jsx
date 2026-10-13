import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { Transactions } from '../index'

const transactionsPropsRef = { current: {} }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('../functions', () => ({
  TransactionsController: ({ UIComponent, ...rest }) => (
    <UIComponent
      walletsIds={[
        { id: 10, type: 'cash' },
        { id: 11, type: 'points' }
      ]}
      transactions={{ loading: false, list: {}, error: null }}
      walletSelected={10}
      setWalletSelected={vi.fn()}
      {...rest}
      {...transactionsPropsRef.current}
    />
  )
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value
  }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  capitalize: (value) => (value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : '')
}))

describe('Transactions', () => {
  it('renders an empty state when there are no transactions', () => {
    transactionsPropsRef.current = {
      transactions: { loading: false, list: { 'wallet:10': [] }, error: null }
    }
    const { getByTestId } = renderWithProviders(<Transactions />)
    expect(getByTestId('not-found')).toHaveTextContent('No transactions to show at this time.')
  })

  it('lists transactions and switches wallets', () => {
    const setWalletSelected = vi.fn()
    transactionsPropsRef.current = {
      walletSelected: 10,
      setWalletSelected,
      transactions: {
        loading: false,
        error: null,
        list: {
          'wallet:10': [{
            amount: 8,
            created_at: '2026-02-01',
            description: 'Cash in',
            event_type: 'credit'
          }]
        }
      }
    }
    const { getByText } = renderWithProviders(<Transactions />)
    expect(getByText('Cash in')).toBeInTheDocument()
    expect(getByText(/\+ \$8/)).toBeInTheDocument()
    fireEvent.click(getByText('Points'))
    expect(setWalletSelected).toHaveBeenCalledWith(11)
  })

  it('shows skeletons while loading and an error message on failure', () => {
    transactionsPropsRef.current = {
      transactions: { loading: true, list: {}, error: null }
    }
    const { getAllByTestId, rerender, getByTestId } = renderWithProviders(<Transactions />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)

    transactionsPropsRef.current = {
      transactions: { loading: false, list: {}, error: ['failed'] }
    }
    rerender(<Transactions />)
    expect(getByTestId('not-found')).toHaveTextContent('Sorry, an error has occurred')
  })
})
