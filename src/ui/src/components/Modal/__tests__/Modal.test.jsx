import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Modal } from '../index'

vi.mock('~components', () => ({
  Popup: ({ UIComponent, ...rest }) => (
    <UIComponent open title='Hello' onClose={vi.fn()} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('Modal', () => {
  it('renders title, children, and accept or cancel actions', () => {
    const onAccept = vi.fn()
    const onCancel = vi.fn()
    const { getByText } = renderWithProviders(
      <Modal
        open
        title='Cart'
        onAccept={onAccept}
        onCancel={onCancel}
        width='40%'
        height='200px'
        minHeight='80px'
        padding='8px'
      >
        <p>Modal body</p>
      </Modal>
    )
    expect(getByText('Cart')).toBeInTheDocument()
    expect(getByText('Modal body')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel'))
    fireEvent.click(getByText('Accept'))
    expect(onCancel).toHaveBeenCalled()
    expect(onAccept).toHaveBeenCalled()
  })

  it('closes from the default icon and from escape', () => {
    const onClose = vi.fn()
    const { container } = renderWithProviders(
      <Modal open title='Close me' onClose={onClose} />
    )
    fireEvent.click(container.querySelector('svg'))
    fireEvent.keyDown(window, { keyCode: 27 })
    expect(onClose).toHaveBeenCalled()
  })

  it('uses onRemove for auth modals and can hide the header and close icon', () => {
    const onRemove = vi.fn()
    const onClose = vi.fn()
    const { getByText, queryByText, rerender, container } = renderWithProviders(
      <Modal
        open
        authModal
        isProductForm
        title='Sign in'
        onRemove={onRemove}
        onClose={onClose}
        acceptText='Continue'
        cancelText='Back'
        onAccept={vi.fn()}
        onCancel={vi.fn()}
        isTransparent
        isSlideBar
        slideBarPosition='right'
        disableOverflowX
        closeIconRight
      />
    )
    expect(getByText('Sign in')).toBeInTheDocument()
    expect(getByText('Continue')).toBeInTheDocument()
    expect(getByText('Back')).toBeInTheDocument()
    fireEvent.click(container.querySelector('svg'))
    expect(onRemove).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()

    rerender(
      <Modal
        open
        hideCloseDefault
        disableHeader
        title='Hidden title'
      >
        <p>Only body</p>
      </Modal>
    )
    expect(getByText('Only body')).toBeInTheDocument()
    expect(queryByText('Hidden title')).not.toBeInTheDocument()
  })
})
