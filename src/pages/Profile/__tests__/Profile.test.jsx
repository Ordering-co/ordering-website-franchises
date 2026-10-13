import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { Profile } from '../index'

const intercomBoot = vi.fn()
const intercomShutdown = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('../../../components/IntercomWrapper', () => ({
  IntercomWrapper: ({ children }) => <div data-testid='intercom-wrapper'>{children}</div>
}))
vi.mock('~components', () => ({
  useConfig: () => [{ configs: { intercom_enabled: { value: '1' } } }]
}))
vi.mock('~ui', () => ({
  useWindowSize: () => ({ width: 1200, height: 800 }),
  UserProfileForm: (props) => (
    <div
      data-testid='user-profile-form'
      data-view={props.view}
      data-hide-options={String(props.hideOptions)}
      data-show-logout={String(props.showLogout)}
    />
  )
}))

describe('Profile page', () => {
  beforeEach(() => {
    window.Intercom = intercomBoot
    intercomBoot.mockImplementation((action) => {
      if (action === 'shutdown') intercomShutdown()
    })
    window.intercomSettings = { app_id: 'test' }
  })

  afterEach(() => {
    delete window.Intercom
    delete window.intercomSettings
    vi.clearAllMocks()
  })

  it('renders profile form with helmet tags', () => {
    const { getByTestId } = renderWithProviders(<Profile />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'profile')
    expect(getByTestId('user-profile-form')).toBeInTheDocument()
  })

  it('passes view query param and desktop layout props', () => {
    const { getByTestId } = renderWithProviders(<Profile />, { route: '/profile?view=orders' })
    expect(getByTestId('user-profile-form')).toHaveAttribute('data-view', 'orders')
    expect(getByTestId('user-profile-form')).toHaveAttribute('data-hide-options', 'false')
    expect(getByTestId('user-profile-form')).toHaveAttribute('data-show-logout', 'true')
  })

  it('boots intercom when enabled', () => {
    renderWithProviders(<Profile />)
    expect(intercomBoot).toHaveBeenCalledWith('boot', window.intercomSettings)
  })
})
