import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Messages } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/bs/BsCardImage', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ri/RiUser2Fill', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/fa/FaUserAlt', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/md/MdClose', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/mdc/MdcCloseOctagonOutline', () => ({ default: () => <span /> }))
vi.mock('@meronex/icons/ios/IosSend', () => ({ default: () => <span /> }))
vi.mock('../MapMessages', () => ({
  MapMessages: () => <div>mapped messages</div>
}))

const buildOrder = (status) => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrder,
  status
})

vi.mock('~components', () => {
  const { baseOrdersUiHooks, baseOrder } = require('../../../../../test/ordersUiTestUtils')
  return {
    ...baseOrdersUiHooks,
    Messages: ({ UIComponent, ...rest }) => (
      <UIComponent
        {...rest}
        order={rest.order || baseOrder}
        messages={rest.messages || { loading: false, messages: [] }}
        messagesToShow={{ messages: [] }}
        sendMessage={{ loading: false }}
        message={rest.message ?? ''}
        image={null}
        business
        driver={false}
        handleSend={() => {}}
        setImage={() => {}}
        setMessage={() => {}}
        setCanRead={() => {}}
        readMessages={() => {}}
        onMessages={() => {}}
        onClose={() => {}}
      />
    )
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  bytesConverter: () => 1,
  Image: () => null
}))

describe('Messages', () => {
  it('shows the ended-order chat notice', () => {
    const { getByText } = renderWithProviders(<Messages />)
    expect(getByText('Messages')).toBeInTheDocument()
    expect(getByText("You can't send messages because the order has ended")).toBeInTheDocument()
  })

  it('renders the compose form for an open order', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <Messages order={buildOrder(0)} />
    )
    expect(getByPlaceholderText('Type your message here')).toBeInTheDocument()
    fireEvent.click(getByText('Is the product ready?'))
    expect(getByText(/Order placed for/)).toBeInTheDocument()
  })
})
