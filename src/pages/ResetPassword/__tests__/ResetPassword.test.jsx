import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { ResetPassword } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  ResetPassword: ({ code, random, redirectResetPassword }) => (
    <div
      data-testid='reset-password-ui'
      data-code={code}
      data-random={random}
    >
      <button
        type='button'
        onClick={() => redirectResetPassword({ code: 'new-code', random: 'new-random' })}
      >
        redirect
      </button>
    </div>
  )
}))

describe('ResetPassword page', () => {
  it('parses code and random from the query string', () => {
    const { getByTestId } = renderWithProviders(<ResetPassword />, {
      route: '/reset-password?code=abc123&random=xyz789'
    })
    const ui = getByTestId('reset-password-ui')
    expect(ui).toHaveAttribute('data-code', 'abc123')
    expect(ui).toHaveAttribute('data-random', 'xyz789')
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'resetpassword')
  })

  it('emits go_to_page when redirectResetPassword is called', () => {
    const { getByText } = renderWithProviders(<ResetPassword />, {
      route: '/reset-password?code=one&random=two'
    })
    getByText('redirect').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'reset_password',
      search: '?code=new-code&random=new-random'
    })
  })
})
