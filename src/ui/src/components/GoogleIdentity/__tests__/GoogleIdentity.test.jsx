import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { GoogleIdentityButton } from '../index'

vi.mock('~components', () => ({
  GoogleIdentityButton: ({ UIComponent, ...rest }) => (
    <UIComponent
      initParams={{ client_id: 'client-1' }}
      handleSigninSuccess={vi.fn()}
      formState={{}}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('GoogleIdentityButton', () => {
  it('renders the Google identity button with the client id', () => {
    const { container } = renderWithProviders(<GoogleIdentityButton />)
    expect(container.querySelector('#g_id_onload')).toHaveAttribute('data-client_id', 'client-1')
  })
})
