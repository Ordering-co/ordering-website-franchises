import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { GoogleGpsButton } from '../index'

const uiPropsRef = { current: null }

vi.mock('~components', () => ({
  GpsButton: ({ UIComponent, ...rest }) => {
    uiPropsRef.current = {
      handleGPS: vi.fn(),
      googleReady: true,
      isLoading: false,
      IconButton: () => <span>GPS</span>
    }
    return <UIComponent {...uiPropsRef.current} {...rest} />
  }
}))

describe('GoogleGpsButton', () => {
  it('renders gps button and handles click', () => {
    const { getByText } = renderWithProviders(<GoogleGpsButton />)
    fireEvent.click(getByText('GPS'))
    expect(uiPropsRef.current.handleGPS).toHaveBeenCalled()
  })
})
