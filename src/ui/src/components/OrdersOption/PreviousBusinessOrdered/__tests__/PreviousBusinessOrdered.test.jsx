import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { PreviousBusinessOrdered } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../../test/ordersUiTestUtils').baseOrdersUiHooks
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  AutoScroll: ({ children }) => children,
  BusinessController: ({ business }) => <div>{business?.name}</div>
}))

describe('PreviousBusinessOrdered', () => {
  it('renders previously ordered businesses', () => {
    const { getByText } = renderWithProviders(
      <PreviousBusinessOrdered
        businesses={{ result: [{ id: 1, name: 'Demo Store', slug: 'demo', open: true }] }}
      />
    )
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
