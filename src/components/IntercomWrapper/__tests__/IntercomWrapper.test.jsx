import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { IntercomWrapper } from '../index'

const intercomFn = vi.fn()
const session = { user: { email: 'user@example.com', name: 'Jane', lastname: 'Doe', cellphone: '5551234567', country_phone_code: '1' }, auth: true }
const config = { configs: { intercom_enabled: { value: '1' }, intercom_app_id: { value: 'app-123' } } }

vi.mock('~components', () => ({
  useSession: () => [session],
  useConfig: () => [config]
}))

describe('IntercomWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.Intercom = intercomFn
    window.intercomSettings = undefined
    document.getElementById('intercom_widget')?.remove()
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' })
    session.auth = true
    session.user.email = 'user@example.com'
    config.configs.intercom_enabled = { value: '1' }
    config.configs.intercom_app_id = { value: 'app-123' }
  })

  it('renders children and injects the widget when enabled', () => {
    const { getByText } = renderWithProviders(
      <IntercomWrapper><span>boot-child</span></IntercomWrapper>
    )
    expect(getByText('boot-child')).toBeInTheDocument()
    expect(document.getElementById('intercom_widget')).toBeTruthy()
    expect(window.intercomSettings).toMatchObject({
      app_id: 'app-123',
      email: 'user@example.com'
    })
  })

  it('shuts down intercom when the feature is disabled', () => {
    config.configs.intercom_enabled = { value: '0' }
    renderWithProviders(<IntercomWrapper><span>off</span></IntercomWrapper>)
    expect(intercomFn).toHaveBeenCalledWith('shutdown')
    expect(document.getElementById('intercom_widget')).toBeFalsy()
  })

  it('skips the widget for internal ordering.co emails', () => {
    session.user.email = 'agent@ordering.co'
    renderWithProviders(<IntercomWrapper><span>blocked</span></IntercomWrapper>)
    expect(document.getElementById('intercom_widget')).toBeFalsy()
  })
})
