import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Confirm, Alert } from '../index'

vi.mock('~components', () => ({
  Popup: ({ UIComponent, ...rest }) => (
    <UIComponent open title='Hello' onClose={vi.fn()} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  getTraduction: (value) => `t:${value}`
}))

describe('Confirm', () => {
  it('renders a string message and accept or cancel actions', () => {
    const onAccept = vi.fn()
    const onCancel = vi.fn()
    const onClose = vi.fn()
    const { getByText } = renderWithProviders(
      <Confirm
        open
        title='Delete item'
        content='Are you sure?'
        onAccept={onAccept}
        onCancel={onCancel}
        onClose={onClose}
      />
    )
    expect(getByText('Delete item')).toBeInTheDocument()
    expect(getByText('Are you sure?')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel'))
    fireEvent.click(getByText('Accept'))
    expect(onCancel).toHaveBeenCalled()
    expect(onAccept).toHaveBeenCalled()
  })

  it('renders list content, links, children, and custom action labels', () => {
    const { getByText } = renderWithProviders(
      <Confirm
        open
        content={['ERROR_INVALID_COUPON', 'INTERNAL_ERROR']}
        links={[<span key='help'>Need help</span>]}
        acceptText='Continue'
        cancelText='Go back'
        onAccept={vi.fn()}
        onCancel={vi.fn()}
      >
        <p>Extra note</p>
      </Confirm>
    )
    expect(getByText('t:ERROR_INVALID_COUPON')).toBeInTheDocument()
    expect(getByText('t:INTERNAL_ERROR')).toBeInTheDocument()
    expect(getByText('Need help')).toBeInTheDocument()
    expect(getByText('Extra note')).toBeInTheDocument()
    expect(getByText('Continue')).toBeInTheDocument()
    expect(getByText('Go back')).toBeInTheDocument()
  })

  it('closes on escape or enter and exports Alert as Confirm', () => {
    const onClose = vi.fn()
    const { container } = renderWithProviders(
      <Alert open content='Saved' onClose={onClose} />
    )
    expect(container.querySelector('.popup-dialog')).not.toBeNull()
    fireEvent.keyDown(window, { keyCode: 27 })
    fireEvent.keyDown(window, { keyCode: 13 })
    expect(onClose).toHaveBeenCalledTimes(2)
    fireEvent.click(container.querySelector('svg'))
    expect(onClose).toHaveBeenCalledTimes(3)
  })
})
