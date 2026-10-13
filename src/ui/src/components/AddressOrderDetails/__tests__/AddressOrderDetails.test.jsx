import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { nearbyBusiness } from '../../../../../test/addressUiTestUtils'
import { AddressOrderDetails } from '../index'

const orderRef = {
  current: { options: { type: 1, moment: null } }
}
const configRef = {
  current: {
    preorder_status_enabled: { value: '1' },
    dates_moment_format: { value: 'YYYY-MM-DD HH:mm' }
  }
}

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parseDate: (value) => `parsed-${value}` }],
  useConfig: () => [{ configs: configRef.current }],
  useOrder: () => [orderRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  MomentContent: () => <div data-testid='moment-content'>Moment</div>
}))

const businessNearestState = { business: nearbyBusiness }

describe('AddressOrderDetails', () => {
  it('renders store details and delivery ASAP', () => {
    orderRef.current = { options: { type: 1, moment: null } }
    const { getByText } = renderWithProviders(
      <AddressOrderDetails businessNearestState={businessNearestState} />
    )
    expect(getByText('ORDER DETAILS')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('9 Pine St')).toBeInTheDocument()
    expect(getByText('5551112222')).toBeInTheDocument()
    expect(getByText('Delivery')).toBeInTheDocument()
    expect(getByText('ASAP')).toBeInTheDocument()
    expect(getByText('Schedule your order')).toBeInTheDocument()
  })

  it('shows pickup and a scheduled moment, then opens preorder', () => {
    orderRef.current = { options: { type: 2, moment: '2026-09-08 10:00' } }
    const { getByText, getByTestId } = renderWithProviders(
      <AddressOrderDetails businessNearestState={businessNearestState} />
    )
    expect(getByText('Pickup')).toBeInTheDocument()
    expect(getByText(/parsed-2026-09-08 10:00/)).toBeInTheDocument()
    fireEvent.click(getByText('ASAP'))
    expect(getByTestId('moment-content')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
  })

  it('falls back to other service types and hides schedule when preorder is off', () => {
    orderRef.current = { options: { type: 3, moment: null } }
    configRef.current = { preorder_status_enabled: { value: '0' } }
    const { getByText, queryByText } = renderWithProviders(
      <AddressOrderDetails businessNearestState={{ business: { name: 'Only Name' } }} />
    )
    expect(getByText('Other')).toBeInTheDocument()
    expect(queryByText('Schedule your order')).not.toBeInTheDocument()
    configRef.current = {
      preorder_status_enabled: { value: '1' },
      dates_moment_format: { value: 'YYYY-MM-DD HH:mm' }
    }
  })
})
