import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import {
  headerAddress,
  headerCart,
  headerConfigs,
  headerOrderState,
  headerSession,
  headerThemeOverrides,
  otherCart,
  stubWindowLocation
} from '../../../../../test/headerUiTestUtils'
import { Header } from '../index'

const emit = vi.fn()
const login = vi.fn()
const refreshOrderOptions = vi.fn()
const deleteUserCustomer = vi.fn()
const getDistance = vi.fn(() => 1)
const getCateringValues = vi.fn(() => ({ preorderLead: 2 }))

const sessionRef = { current: { ...headerSession } }
const orderRef = {
  current: {
    carts: { ...headerOrderState.carts },
    options: { ...headerOrderState.options, address: { ...headerAddress } }
  }
}
const configRef = { current: { ...headerConfigs } }
const customerRef = { current: { user: null, loading: false } }
const businessRef = { current: { business: { id: 7, slug: 'demo-store', configs: {} } } }
const windowSizeRef = { current: { width: 1200, height: 800 } }
const onlineStatusRef = { current: true }
const userCustomerRef = { current: null }
const geoRef = {
  current: (success) => success({ coords: { latitude: 10, longitude: 20 } })
}

vi.mock('~/utils/siteBranding', () => ({
  getSiteLogoUrl: (api, fallback) => api || fallback || 'logo.png'
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => userCustomerRef.current
}))
vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2]
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current, { login }],
  useOrder: () => [orderRef.current, { refreshOrderOptions }],
  useEvent: () => [{ emit }],
  useConfig: () => [{ configs: configRef.current }],
  useCustomer: () => [customerRef.current, { deleteUserCustomer }],
  useBusiness: () => [businessRef.current],
  useUtils: () => [{ parseDate: (value) => value, parsePrice: (value) => `$${value}` }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  getDistance: (...args) => getDistance(...args),
  getCateringValues: (...args) => getCateringValues(...args),
  useWindowSize: () => windowSizeRef.current,
  useOnlineStatus: () => onlineStatusRef.current,
  HeaderOption: ({ variant, onClick, totalCarts }) => (
    <div>
      <button
        type='button'
        data-testid={`header-option-${variant}`}
        onClick={() => onClick?.(variant)}
      >
        {variant}:{totalCarts || 0}
      </button>
      {variant === 'cart' && (
        <>
          <button type='button' onClick={() => onClick?.('address')}>open-address</button>
          <button type='button' onClick={() => onClick?.('moment')}>open-moment</button>
          <button type='button' onClick={() => onClick?.('delivery')}>open-delivery</button>
        </>
      )}
    </div>
  ),
  SidebarMenu: () => <div data-testid='sidebar-menu' />,
  CartPopover: ({ onClick, onClose, setPreorderBusiness, carts }) => (
    <div data-testid='cart-popover'>
      <span>carts:{carts?.length || 0}</span>
      <button type='button' onClick={onClick}>toggle-cart</button>
      <button type='button' onClick={onClose}>close-cart</button>
      <button
        type='button'
        onClick={() => setPreorderBusiness?.({ id: 9, slug: 'preorder-store' })}
      >
        open-preorder
      </button>
    </div>
  ),
  CartContent: ({ carts, onClose }) => (
    <div data-testid='cart-content'>
      carts:{carts?.length || 0}
      <button type='button' onClick={onClose}>done-cart</button>
    </div>
  ),
  MomentContent: ({ onClose }) => (
    <div data-testid='moment-content'>
      <button type='button' onClick={onClose}>done-moment</button>
    </div>
  ),
  AddressList: () => <div data-testid='address-list' />,
  AddressForm: ({ onCancel, onSaveAddress }) => (
    <div data-testid='address-form'>
      <button type='button' onClick={onCancel}>cancel-address</button>
      <button type='button' onClick={onSaveAddress}>save-address</button>
    </div>
  ),
  UserDetails: () => <div data-testid='user-details' />,
  OrderTypeSelectorContent: ({ onClose }) => (
    <div data-testid='order-type-content'>
      <button type='button' onClick={onClose}>done-delivery</button>
    </div>
  ),
  BusinessPreorder: ({ handleClick, business }) => (
    <div data-testid='business-preorder'>
      <button type='button' onClick={() => handleClick(business)}>go-business</button>
    </div>
  ),
  LanguageSelector: () => <div>Language</div>,
  LogoutButton: () => <button type='button'>Logout</button>,
  LoginForm: ({ handleSuccessLogin, elementLinkToSignup, elementLinkToForgotPassword }) => (
    <div data-testid='login-form'>
      {elementLinkToSignup}
      {elementLinkToForgotPassword}
      <button type='button' onClick={() => handleSuccessLogin({ id: 1 })}>finish-login</button>
    </div>
  ),
  SignUpForm: ({ handleSuccessSignup, elementLinkToLogin }) => (
    <div data-testid='signup-form'>
      {elementLinkToLogin}
      <button
        type='button'
        onClick={() => handleSuccessSignup({ id: 8, session: { access_token: 'tok' } })}
      >
        finish-signup
      </button>
    </div>
  ),
  ForgotPasswordForm: ({ elementLinkToLogin }) => (
    <div data-testid='forgot-form'>{elementLinkToLogin}</div>
  )
}))

const renderHeader = (props = {}, options = {}) => {
  const { themeOverrides, route = '/', ...rest } = options
  return renderWithProviders(
    <Header {...props} />,
    {
      themeOverrides: {
        ...headerThemeOverrides,
        ...themeOverrides
      },
      route,
      ...rest
    }
  )
}

describe('Header', () => {
  beforeEach(() => {
    emit.mockClear()
    login.mockClear()
    refreshOrderOptions.mockClear()
    deleteUserCustomer.mockClear()
    getDistance.mockClear()
    getDistance.mockReturnValue(1)
    getCateringValues.mockClear()
    getCateringValues.mockReturnValue({ preorderLead: 2 })
    sessionRef.current = { ...headerSession }
    orderRef.current = {
      carts: { 1: headerCart, 2: otherCart },
      options: { type: 1, address: { ...headerAddress } }
    }
    configRef.current = { ...headerConfigs }
    customerRef.current = { user: null, loading: false }
    businessRef.current = { business: { id: 7, slug: 'demo-store', configs: {} } }
    windowSizeRef.current = { width: 1200, height: 800 }
    onlineStatusRef.current = true
    userCustomerRef.current = null
    geoRef.current = (success) => success({ coords: { latitude: 10, longitude: 20 } })
    window.scrollTo = vi.fn()
    window.history.back = vi.fn()
    window.sessionStorage.clear()
    stubWindowLocation({ pathname: '/', search: '' })
    navigator.geolocation = {
      getCurrentPosition: (success, error, options) => geoRef.current(success, error, options)
    }
  })

  it('renders home chrome and navigates from logo, account, and rewards', () => {
    const { getByAltText, getByText, getByTestId } = renderHeader()
    expect(getByTestId('sidebar-menu')).toBeInTheDocument()
    expect(getByAltText('Logotype')).toHaveAttribute('src', 'logotype.png')
    expect(getByAltText('Isotype')).toHaveAttribute('src', 'isotype.png')
    expect(getByText('Account')).toBeInTheDocument()
    expect(getByText('Rewards')).toBeInTheDocument()
    expect(getByText('Language')).toBeInTheDocument()
    expect(getByTestId('cart-popover')).toHaveTextContent('carts:2')

    fireEvent.click(getByAltText('Logotype'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
    fireEvent.click(getByText('Account'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'account' })
    fireEvent.click(getByText('Rewards'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'wallets' })
  })

  it('toggles the cart popover and opens a preorder business', () => {
    const { getByText, getByTestId, queryByTestId } = renderHeader()
    fireEvent.click(getByText('toggle-cart'))
    fireEvent.click(getByText('close-cart'))
    fireEvent.click(getByText('open-preorder'))
    expect(getByTestId('business-preorder')).toBeInTheDocument()
    fireEvent.click(getByText('go-business'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'preorder-store' },
      replace: true
    })
    fireEvent.click(getByText('close'))
    expect(queryByTestId('business-preorder')).not.toBeInTheDocument()
  })

  it('opens cart, address, moment, and delivery modals on mobile', () => {
    windowSizeRef.current = { width: 500, height: 800 }
    userCustomerRef.current = { id: 4, name: 'Pat' }
    const { getByText, getByTestId, queryByTestId, rerender } = renderHeader()
    expect(getByTestId('header-option-cart')).toHaveTextContent('cart:2')

    fireEvent.click(getByTestId('header-option-cart'))
    expect(getByTestId('cart-content')).toBeInTheDocument()
    fireEvent.click(getByText('done-cart'))
    expect(queryByTestId('cart-content')).not.toBeInTheDocument()

    fireEvent.click(getByTestId('header-option-cart'))
    fireEvent.click(getByText('close'))

    fireEvent.click(getByText('open-address'))
    expect(getByTestId('address-list')).toBeInTheDocument()
    fireEvent.click(getByText('close'))

    fireEvent.click(getByText('open-moment'))
    expect(getByTestId('moment-content')).toBeInTheDocument()
    expect(getCateringValues).toHaveBeenCalled()
    fireEvent.click(getByText('done-moment'))

    fireEvent.click(getByText('open-delivery'))
    expect(getByTestId('order-type-content')).toBeInTheDocument()
    fireEvent.click(getByText('done-delivery'))

    sessionRef.current = { auth: false, user: null }
    rerender(<Header />)
    fireEvent.click(getByText('open-address'))
    expect(getByTestId('address-form')).toBeInTheDocument()
    expect(getByText("What's your address?")).toBeInTheDocument()
    fireEvent.click(getByText('save-address'))
  })

  it('shows path titles and uses back to reach home, order types, or history', () => {
    const titles = [
      ['/profile/orders', '', 'Orders'],
      ['/messages', '', 'Messages'],
      ['/favorite', '', 'Favorites'],
      ['/wallets', '', 'Rewards'],
      ['/reward/transactions', '', 'Transactions list'],
      ['/sessions', '', 'Sessions'],
      ['/order_types', '', 'Delivering to'],
      ['/profile', '?view=savedPlaces', 'My saved places']
    ]

    titles.forEach(([pathname, search, title]) => {
      stubWindowLocation({ pathname, search })
      const { getAllByText, getByText, unmount } = renderHeader({}, { route: pathname + search })
      expect(getAllByText(title).length).toBeGreaterThan(0)
      expect(getByText('Back')).toBeInTheDocument()
      unmount()
    })

    orderRef.current = {
      ...orderRef.current,
      options: { ...orderRef.current.options, type: 2 }
    }
    stubWindowLocation({ pathname: '/order_types' })
    const pickupView = renderHeader({}, { route: '/order_types' })
    expect(pickupView.getByText('Picking up from')).toBeInTheDocument()
    fireEvent.click(pickupView.getByText('Back'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home', replace: true })
    pickupView.unmount()

    stubWindowLocation({ pathname: '/store/demo' })
    const storeView = renderHeader({}, { route: '/store/demo' })
    fireEvent.click(storeView.getByText('Back'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'order_types', replace: true })
    storeView.unmount()

    stubWindowLocation({ pathname: '/messages' })
    const historyView = renderHeader({}, { route: '/messages' })
    fireEvent.click(historyView.getByText('Back'))
    expect(window.history.back).toHaveBeenCalled()
    historyView.unmount()

    window.sessionStorage.setItem('order-redirect', 'true')
    stubWindowLocation({ pathname: '/account' })
    const redirectView = renderHeader({}, { route: '/account' })
    fireEvent.click(redirectView.getByText('Back'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders', replace: true })
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home', replace: true })
    expect(window.sessionStorage.getItem('order-redirect')).toBeNull()
    redirectView.unmount()
  })

  it('sends checkout without a business back home and uses the center logo', () => {
    businessRef.current = { business: {} }
    stubWindowLocation({ pathname: '/checkout' })
    const { getByText, getAllByAltText } = renderHeader({}, { route: '/checkout' })
    expect(getAllByAltText('Logotype').length).toBeGreaterThan(0)
    fireEvent.click(getByText('Back'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home', replace: true })
  })

  it('clears a customer on orders navigation and reads geolocation on search', () => {
    stubWindowLocation({ pathname: '/profile/orders' })
    const { getByText } = renderHeader(
      { isCustomerMode: true },
      { route: '/profile/orders' }
    )
    fireEvent.click(getByText('Account'))
    expect(deleteUserCustomer).toHaveBeenCalledWith(true)
    expect(refreshOrderOptions).toHaveBeenCalled()
    expect(getDistance).not.toHaveBeenCalled()
  })

  it('marks the current location as far away or ignored on search', () => {
    getDistance.mockReturnValue(25)
    stubWindowLocation({ pathname: '/search' })
    renderHeader({}, { route: '/search' })
    expect(getDistance).toHaveBeenCalled()

    getDistance.mockClear()
    getDistance.mockReturnValue(1)
    geoRef.current = (success) => success({ coords: { latitude: 1, longitude: 2 } })
    renderHeader({}, { route: '/search' })
    expect(getDistance).toHaveBeenCalled()

    getDistance.mockClear()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    geoRef.current = (_success, error) => error({ code: 1, message: 'denied' })
    renderHeader({}, { route: '/search' })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('hides rewards, languages, sidebar, and offline actions from theme and config', () => {
    configRef.current = {
      ...headerConfigs,
      disabled_rewards: { value: '1' }
    }
    stubWindowLocation({ pathname: '/account' })
    const hiddenView = renderHeader(
      { isShowOrderOptions: false },
      {
        route: '/account',
        themeOverrides: {
          ...headerThemeOverrides,
          header: {
            components: {
              language_selector: { hidden: true }
            }
          }
        }
      }
    )
    expect(hiddenView.queryByTestId('sidebar-menu')).not.toBeInTheDocument()
    expect(hiddenView.queryByText('Rewards')).not.toBeInTheDocument()
    expect(hiddenView.queryByText('Language')).not.toBeInTheDocument()
    expect(hiddenView.getByText('Account')).toBeDisabled()
    hiddenView.unmount()

    stubWindowLocation({ pathname: '/' })
    onlineStatusRef.current = false
    const offlineView = renderHeader()
    expect(offlineView.queryByText('Account')).not.toBeInTheDocument()
    expect(offlineView.queryByTestId('cart-popover')).not.toBeInTheDocument()
    offlineView.unmount()

    onlineStatusRef.current = true
    stubWindowLocation({ pathname: '/multi-checkout' })
    const multiView = renderHeader({}, { route: '/multi-checkout' })
    expect(multiView.queryByTestId('cart-popover')).not.toBeInTheDocument()
    multiView.unmount()
  })

  it('filters carts by slug and uses catering values on store paths', () => {
    windowSizeRef.current = { width: 500, height: 800 }
    orderRef.current = {
      carts: { 1: headerCart, 2: otherCart },
      options: { type: 7, address: { ...headerAddress } }
    }
    const deliveryView = renderHeader(
      { businessSlug: 'demo-store', singleBusinessConfig: { isActive: true } },
      { route: '/store/demo-store' }
    )
    expect(deliveryView.getByTestId('header-option-cart')).toHaveTextContent('cart:1')
    fireEvent.click(deliveryView.getByText('open-moment'))
    expect(getCateringValues).toHaveBeenCalledWith('catering_delivery', {})
    deliveryView.unmount()

    orderRef.current = {
      carts: { 1: headerCart },
      options: { type: 8, address: { ...headerAddress } }
    }
    const pickupView = renderHeader(
      { businessSlug: 7, isHideSignup: true, notificationState: { permission: true } },
      { route: '/home' }
    )
    fireEvent.click(pickupView.getByText('open-moment'))
    expect(getCateringValues).toHaveBeenCalledWith('catering_pickup', headerConfigs)
  })
})
