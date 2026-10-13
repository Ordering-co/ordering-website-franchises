import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { QueryLoginSpoonity } from '../index'

const emit = vi.fn()
const login = vi.fn()
const setAuthModalOpen = vi.fn()
const setModalPageToShow = vi.fn()
const spoonityPropsRef = { current: null }

vi.mock('~components', () => ({
  QueryLoginSpoonity: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...spoonityPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ auth: false }, { login }],
  useEvent: () => [{ emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('QueryLoginSpoonity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    spoonityPropsRef.current = {
      userState: { loading: false },
      notificationState: {},
      authModalOpen: true,
      setAuthModalOpen,
      modalPageToShow: 'login',
      setModalPageToShow
    }
    delete window.location
    window.location = { pathname: '/store/demo-store' }
  })

  it('renders the auth modal with login form', () => {
    const { getByTestId } = renderWithProviders(<QueryLoginSpoonity />)
    expect(getByTestId('modal')).toBeInTheDocument()
    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('shows a spinner while the user state loads', () => {
    spoonityPropsRef.current = {
      ...spoonityPropsRef.current,
      userState: { loading: true }
    }
    const { getByTestId } = renderWithProviders(<QueryLoginSpoonity />)
    expect(getByTestId('spinner')).toBeInTheDocument()
  })

  it('closes the modal and redirects to the business page', () => {
    const { getByText } = renderWithProviders(<QueryLoginSpoonity />)
    fireEvent.click(getByText('close'))
    expect(setAuthModalOpen).toHaveBeenCalledWith(false)
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
  })
})
