import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { HomeHero } from '../index'

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
  useOrder: () => [{ options: { type: 1 } }, { changeType: vi.fn() }],
  useLanguage: () => [{}, (_k, f) => f],
  useEvent: () => [{ emit: vi.fn() }],
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
  OrderProgress: () => <div data-testid='order-progress' />,
  useConfigFile: () => [{ franchiseSlug: 'franchise-a' }],
  generalUtilities: () => ({ handleCreateGuestUser: vi.fn(async () => true) })
}))

describe('HomeHero', () => {
  it('renders hero order now button without banners', () => {
    const { getByText, getByTestId } = renderWithProviders(<HomeHero />)
    expect(getByText('Order Now')).toBeInTheDocument()
    expect(getByTestId('order-progress')).toBeInTheDocument()
  })

  it('starts a guest order from the hero', () => {
    const { getByText } = renderWithProviders(<HomeHero />)
    fireEvent.click(getByText('Order Now'))
    expect(getByText('Order Now')).toBeInTheDocument()
  })
})
