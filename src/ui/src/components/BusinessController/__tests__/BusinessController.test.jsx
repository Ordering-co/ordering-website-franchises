import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessController } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessController: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={{
        id: 1,
        name: 'Demo Store',
        open: true,
        enabled: true,
        address: '123 Main',
        delivery_price: 5,
        delivery_time: 30,
        pickup_time: 15,
        distance: 1.2,
        today: { enabled: true, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }] },
        timezone: 'UTC'
      }}
      isBusinessOpen
      orderType={1}
      handleClick={vi.fn()}
      businessState={{ business: { favorite: false } }}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useSession: () => [{ auth: true }, { login: vi.fn() }],
  useConfig: () => [{ configs: { preorder_status_enabled: { value: '1' } } }],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDistance: (v) => `${v} mi`, parseTime: (v) => String(v) }],
  useOrder: () => [{ options: { type: 1 } }, {}]
}))
vi.mock('~ui', () => ({
  Alert: () => null,
  Modal: () => null,
  LoginForm: () => null,
  SignUpForm: () => null,
  ForgotPasswordForm: () => null,
  generalUtilities: () => ({ convertHoursToMinutes: (v) => v }),
  lightenDarkenColor: (c) => c,
  shape: {},
  Button: ({ children }) => <button type='button'>{children}</button>
}))

describe('BusinessController', () => {
  it('renders business card with store name', () => {
    const { getByText } = renderWithProviders(<BusinessController />)
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('Order Now')).toBeInTheDocument()
  })
})
