import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { HomeHero } from '../index'

const state = vi.hoisted(() => ({ localProjectPinned: false, emit: vi.fn(), changeType: vi.fn(), usersSave: vi.fn(async () => true) }))

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~components', () => ({
  PageBanner: ({ UIComponent, ...rest }) => (
    <UIComponent
      pageBannerState={{ banner: { items: [] }, error: false }}
      notificationState={{}}
      {...rest}
    />
  ),
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useOrder: () => [{ options: { type: 1 } }, { changeType: state.changeType }],
  useLanguage: () => [{}, (_k, f) => f],
  useEvent: () => [{ emit: state.emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Modal: () => null,
  LoginForm: () => null,
  SignUpForm: () => null,
  ForgotPasswordForm: () => null,
  useWindowSize: () => ({ width: 1200, height: 800 }),
  checkSiteUrl: (_t, fallback) => fallback,
  OrderProgress: ({ franchiseId }) => <div data-testid='order-progress' data-franchise={franchiseId} />,
  useConfigFile: () => [{ franchiseSlug: 23, localProjectConfigured: state.localProjectPinned, localProjectPinned: state.localProjectPinned }],
  generalUtilities: () => ({ handleCreateGuestUser: async () => state.usersSave() })
}))

describe('HomeHero', () => {
  beforeEach(() => { state.localProjectPinned = false; vi.clearAllMocks() })

  it('opens the local catalogue without any guest user save or order mutation', () => {
    state.localProjectPinned = true
    const { getByText } = renderWithProviders(<HomeHero />)
    fireEvent.click(getByText('Order Now'))
    expect(state.emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
    expect(state.usersSave).not.toHaveBeenCalled()
    expect(state.changeType).not.toHaveBeenCalled()
  })
  it('renders hero order now button without banners', () => {
    const { getByText, getByTestId } = renderWithProviders(<HomeHero />)
    expect(getByText('Order Now')).toBeInTheDocument()
    expect(getByTestId('order-progress')).toBeInTheDocument()
    expect(getByTestId('order-progress')).toHaveAttribute('data-franchise', '23')
  })

  it('preserves guest creation and order type navigation in production', async () => {
    const { getByText } = renderWithProviders(<HomeHero />)
    fireEvent.click(getByText('Order Now'))
    await waitFor(() => expect(state.usersSave).toHaveBeenCalledTimes(1))
    expect(state.emit).toHaveBeenCalledWith('go_to_page', { page: 'order_types' })
  })
})
