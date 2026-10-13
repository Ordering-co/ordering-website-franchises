import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Help } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  LastOrders: () => <div>Last orders</div>,
  HelpStaticPage: ({ slug }) => <div data-testid='help-static'>{slug}</div>
}))

describe('Help', () => {
  it('renders the help menu and last orders', () => {
    const { getByText } = renderWithProviders(<Help />)
    expect(getByText('Help')).toBeInTheDocument()
    expect(getByText('Help with an order')).toBeInTheDocument()
    expect(getByText('Account and Payment Options')).toBeInTheDocument()
    expect(getByText('Guide to Ordering')).toBeInTheDocument()
    expect(getByText('Last orders')).toBeInTheDocument()
  })

  it('opens static pages from the menu and returns via breadcrumb', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(<Help />)
    fireEvent.click(getByText('Help with an order'))
    expect(getByTestId('help-static')).toHaveTextContent('helpOrder')
    fireEvent.click(getByText('Help'))
    expect(queryByTestId('help-static')).not.toBeInTheDocument()

    fireEvent.click(getByText('Account and Payment Options'))
    expect(getByTestId('help-static')).toHaveTextContent('helpAccountAndPayment')
    fireEvent.click(getByText('Help'))

    fireEvent.click(getByText('Guide to Ordering'))
    expect(getByTestId('help-static')).toHaveTextContent('helpOrderingGuide')
  })
})
