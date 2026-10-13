import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { OrderTypes } from '../index'

const emit = vi.fn()
const onChangeBusinessSelected = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useSession: () => [{ user: { addresses: [{ id: 1 }] } }],
  useEvent: () => [{ emit }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  OrderTypeSelector: (props) => (
    <div
      data-testid='order-types-ui'
      data-is-profile={String(!!props.isProfile)}
      data-is-modal={String(!!props.isModal)}
    >
      <button
        type='button'
        onClick={() => props.onBusinessClick?.({ slug: 'demo-store' })}
      >
        business
      </button>
    </div>
  ),
  ProfileOptions: ({ value }) => <div data-testid='profile-options' data-value={value} />,
  useBusinessSelected: () => [null, { onChangeBusinessSelected }]
}))

const themeWithProfileOptions = {
  profile: {
    components: {
      address_list: {
        components: {
          layout: {
            position: 'new_page'
          }
        }
      }
    }
  }
}

describe('OrderTypes page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order types helmet tags and controller props', () => {
    const { getByTestId } = renderWithProviders(<OrderTypes />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'order_types')
    expect(getByTestId('order-types-ui')).toHaveAttribute('data-is-profile', 'true')
    expect(getByTestId('order-types-ui')).toHaveAttribute('data-is-modal', 'true')
  })

  it('shows profile options when theme layout is new_page', () => {
    const { getByTestId } = renderWithProviders(<OrderTypes />, {
      themeOverrides: themeWithProfileOptions
    })
    expect(getByTestId('profile-options')).toHaveAttribute('data-value', 'order_types')
  })

  it('emits business navigation on business click', () => {
    const { getByText } = renderWithProviders(<OrderTypes />)
    getByText('business').click()
    expect(onChangeBusinessSelected).toHaveBeenCalledWith({ slug: 'demo-store' })
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
  })
})
