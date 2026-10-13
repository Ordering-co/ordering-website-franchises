import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { FloatingButton } from '../index'

vi.mock('~components', () => ({
  FloatingButton: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('FloatingButton', () => {
  it('renders the label and value and handles a click', () => {
    const handleButtonClick = vi.fn()
    const { getByText } = renderWithProviders(
      <FloatingButton
        btnText='View cart'
        btnValue='3'
        handleButtonClick={handleButtonClick}
      />
    )
    expect(getByText('View cart')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
    fireEvent.click(getByText('View cart'))
    expect(handleButtonClick).toHaveBeenCalled()
  })

  it('can render a disabled secondary action', () => {
    const handleButtonClick = vi.fn()
    const { getByRole } = renderWithProviders(
      <FloatingButton
        btnText='Checkout'
        btnValue='$12'
        isSecondaryBtn
        disabled
        handleButtonClick={handleButtonClick}
      />
    )
    expect(getByRole('button')).toBeDisabled()
    expect(getByRole('button')).toHaveTextContent('Checkout')
  })
})
