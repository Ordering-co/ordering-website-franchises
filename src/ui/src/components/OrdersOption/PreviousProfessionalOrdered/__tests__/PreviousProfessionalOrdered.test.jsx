import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { PreviousProfessionalOrdered } from '../index'

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
  SingleProfessionalCard: ({ professional }) => <div>{professional?.name}</div>
}))

describe('PreviousProfessionalOrdered', () => {
  it('renders previously ordered professionals', () => {
    const { getByText } = renderWithProviders(
      <PreviousProfessionalOrdered professionals={[{ id: 1, name: 'Pro' }]} />
    )
    expect(getByText('Pro')).toBeInTheDocument()
  })
})
