import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { WebsocketStatus } from '../index'

const socketPropsRef = {
  current: {
    socketStatus: 1,
    reconnectAttemptCount: 0,
    connectedDate: '2020-01-01T00:00:00Z'
  }
}
const configRef = { current: {} }

vi.mock('~components', () => ({
  WebsocketStatus: ({ UIComponent, ...rest }) => (
    <UIComponent {...socketPropsRef.current} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parseDate: () => 'Jan 1, 2020' }],
  useConfig: () => [{ configs: configRef.current }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  IconButton: ({ children }) => (
    <button type='button' data-testid='icon-button'>{children}</button>
  ),
  Alert: ({ open, title, content, onAccept, acceptText }) => (
    open
      ? (
        <div data-testid='alert'>
          {title}
          {content}
          <button type='button' onClick={onAccept}>{acceptText || 'Accept'}</button>
        </div>
        )
      : null
  )
}))

describe('WebsocketStatus', () => {
  beforeEach(() => {
    socketPropsRef.current = {
      socketStatus: 1,
      reconnectAttemptCount: 0,
      connectedDate: '2020-01-01T00:00:00Z'
    }
    configRef.current = {}
  })

  it('shows customer support copy and opens the status modal', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(
      <WebsocketStatus />
    )
    expect(getByTestId('icon-button')).toBeInTheDocument()
    expect(getByText(/Verify the server connection by date and time/)).toBeInTheDocument()
    expect(getByText('Customer support')).toHaveAttribute('href', 'https://www.ordering.co/contact-ordering')
    fireEvent.click(getByText('Connection status'))
    expect(getByText('Last update: Jan 1, 2020')).toBeInTheDocument()
    expect(getByText('The websocket works normally.')).toBeInTheDocument()
    expect(getByText('The websocket is connecting.')).toBeInTheDocument()
    expect(getByText('The server is slow, please reload.')).toBeInTheDocument()
    fireEvent.click(getByText('Close'))
    expect(queryByText('Last update: Jan 1, 2020')).not.toBeInTheDocument()
  })

  it('uses white label copy and reloads from update', () => {
    configRef.current = { white_label_module: { value: true } }
    const reload = vi.fn()
    const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    })
    const { getByText, queryByText } = renderWithProviders(<WebsocketStatus />)
    expect(getByText(/Need help\? Contact our Customer support team\.$/)).toBeInTheDocument()
    expect(queryByText('Customer support')).not.toBeInTheDocument()
    fireEvent.click(getByText('Connection status'))
    fireEvent.click(getByText('Update'))
    expect(reload).toHaveBeenCalled()
    if (locationDescriptor) {
      Object.defineProperty(window, 'location', locationDescriptor)
    }
  })

  it('alerts after repeated reconnect failures and reloads on accept', () => {
    socketPropsRef.current = {
      socketStatus: 2,
      reconnectAttemptCount: 4,
      connectedDate: '2020-01-01T00:00:00Z'
    }
    const reload = vi.fn()
    const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    })
    const { getByText, getByTestId } = renderWithProviders(<WebsocketStatus />)
    expect(getByTestId('alert')).toHaveTextContent('There appears to be an error in establishing the WebSocket connection')
    fireEvent.click(getByText('Accept'))
    expect(reload).toHaveBeenCalled()
    if (locationDescriptor) {
      Object.defineProperty(window, 'location', locationDescriptor)
    }
  })
})
