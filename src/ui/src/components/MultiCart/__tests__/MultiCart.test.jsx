import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseMultiCartUIProps } from '../../../../../test/cartUiTestUtils'
import { MultiCart } from '../index'

const uiPropsRef = { current: null }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  MultiCartCreate: ({ UIComponent, ...rest }) => (
    <UIComponent {...baseMultiCartUIProps} {...rest} {...uiPropsRef.current} />
  )
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('MultiCart', () => {
  it('renders skeleton placeholder layout', () => {
    uiPropsRef.current = {}
    const { getAllByTestId } = renderWithProviders(<MultiCart />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
