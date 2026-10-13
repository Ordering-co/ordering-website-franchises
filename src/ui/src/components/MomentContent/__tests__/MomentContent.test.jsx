import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { MomentContent } from '../index'

const orderRef = { current: { loading: false, options: { address: { location: { lat: 1, lng: 1 } } } } }
const configRef = { current: { loading: false, configs: { max_days_preorder: { value: '4' } } } }
const windowSizeRef = { current: { width: 1024, height: 768 } }

vi.mock('~components', () => ({
  useOrder: () => [orderRef.current],
  useConfig: () => [configRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  useWindowSize: () => windowSizeRef.current,
  MomentControl: (props) => (
    <div
      data-testid='moment-control'
      data-cart={String(!!props.isCart)}
      data-catering={String(!!props.cateringPreorder)}
    >
      Moment control
    </div>
  )
}))

describe('MomentContent', () => {
  it('renders moment control with a computed max date', () => {
    orderRef.current = { loading: false, options: { address: { location: { lat: 1, lng: 1 } } } }
    configRef.current = { loading: false, configs: { max_days_preorder: { value: '4' } } }
    const { getByTestId, queryByTestId } = renderWithProviders(
      <MomentContent onClose={() => {}} />
    )
    expect(getByTestId('moment-control')).toBeInTheDocument()
    expect(queryByTestId('spinner')).not.toBeInTheDocument()
  })

  it('shows a loading overlay and still renders catering control after config loads', () => {
    orderRef.current = { loading: true, options: { address: { location: { lat: 1, lng: 1 } } } }
    configRef.current = { loading: false, configs: { max_days_preorder: { value: '1' } } }
    windowSizeRef.current = { width: 500, height: 700 }
    const { getByTestId } = renderWithProviders(
      <MomentContent cateringPreorder isCart business={{ id: 1 }} />
    )
    expect(getByTestId('moment-control')).toHaveAttribute('data-catering', 'true')
    expect(getByTestId('moment-control')).toHaveAttribute('data-cart', 'true')
    expect(getByTestId('spinner')).toBeInTheDocument()
    windowSizeRef.current = { width: 1024, height: 768 }
  })

  it('hides moment control while catering config is loading', () => {
    orderRef.current = { loading: false, options: { address: {} } }
    configRef.current = { loading: true, configs: {} }
    const { queryByTestId } = renderWithProviders(
      <MomentContent cateringPreorder isHeader />
    )
    expect(queryByTestId('moment-control')).not.toBeInTheDocument()
    expect(queryByTestId('spinner')).not.toBeInTheDocument()
  })
})
