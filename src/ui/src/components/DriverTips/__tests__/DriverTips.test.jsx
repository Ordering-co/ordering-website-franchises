import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseDriverTipsProps } from '../../../../../test/cartUiTestUtils'
import { DriverTips } from '../index'

const uiPropsRef = { current: null }
const handlerChangeOption = vi.fn()

vi.mock('~components', () => ({
  DriverTips: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...baseDriverTipsProps}
      driverTip={0}
      driverTipsOptions={[10, 15, 20]}
      isDriverTipUseCustom
      handlerChangeOption={handlerChangeOption}
      cart={{ total: 20, driver_tip: 0 }}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }],
  useConfig: () => [{ configs: uiPropsRef.current?.configs || { driver_tip_type: { value: '2' } } }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('DriverTips', () => {
  it('renders tip chips', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<DriverTips />)
    expect(getByText('10%')).toBeInTheDocument()
    expect(getByText('Custom')).toBeInTheDocument()
  })

  it('handles tip selection', () => {
    handlerChangeOption.mockClear()
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<DriverTips />)
    fireEvent.click(getByText('10%'))
    expect(handlerChangeOption).toHaveBeenCalledWith(10)
  })

  it('opens custom tip input and applies amount', () => {
    handlerChangeOption.mockClear()
    uiPropsRef.current = {}
    const { getByText, getByPlaceholderText } = renderWithProviders(<DriverTips />)
    fireEvent.click(getByText('Custom'))
    const input = getByPlaceholderText('0%')
    fireEvent.change(input, { target: { value: '12' } })
    fireEvent.click(getByText('Apply Tip'))
    expect(handlerChangeOption).toHaveBeenCalledWith('12')
  })

  it('renders fixed price tip options', () => {
    uiPropsRef.current = {
      driverTipsOptions: [2, 4, 6],
      driverTip: 2,
      configs: {
        driver_tip_type: { value: '1' },
        currency_position: { value: 'left' },
        format_number_currency: { value: '$' }
      }
    }
    const { getByText } = renderWithProviders(<DriverTips />)
    expect(getByText('$2')).toBeInTheDocument()
  })
})
