import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { AddressList } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useSession: () => [{ user: { addresses: [{ id: 1, address: '123 Main St' }] } }],
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  AddressList: (props) => (
    <div
      data-testid='address-list-ui'
      data-is-profile={String(props.isProfile)}
      data-count={props.addressList?.length ?? 0}
    />
  ),
  ProfileOptions: ({ value }) => <div data-testid='profile-options' data-value={value} />
}))

describe('AddressList page', () => {
  it('renders saved places heading and address list controller', () => {
    const { getByText, getByTestId } = renderWithProviders(<AddressList />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'addresses')
    expect(getByText('Saved places')).toBeInTheDocument()
    expect(getByTestId('address-list-ui')).toHaveAttribute('data-is-profile', 'true')
    expect(getByTestId('address-list-ui')).toHaveAttribute('data-count', '1')
  })

  it('shows profile options when theme layout uses new_page', () => {
    const { getByTestId } = renderWithProviders(<AddressList />, {
      themeOverrides: {
        profile: {
          components: {
            address_list: {
              components: {
                layout: { position: 'new_page' }
              }
            }
          }
        }
      }
    })
    expect(getByTestId('profile-options')).toHaveAttribute('data-value', 'addresses')
  })
})
