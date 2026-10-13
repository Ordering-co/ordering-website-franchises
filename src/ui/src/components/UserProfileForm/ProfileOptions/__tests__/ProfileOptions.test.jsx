import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { ProfileOptions } from '../index'

const emit = vi.fn()

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('ProfileOptions', () => {
  it('emits navigation for account and orders tabs', () => {
    const { getByText, queryByText } = renderWithProviders(
      <ProfileOptions value='account' />
    )
    expect(getByText('My Account')).toBeInTheDocument()
    expect(getByText('My orders')).toBeInTheDocument()
    expect(queryByText('My Addresses')).not.toBeInTheDocument()
    fireEvent.click(getByText('My Account'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'profile' })
    fireEvent.click(getByText('My orders'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders' })
  })

  it('shows the address tab when theme places it on a new page', () => {
    const { getByText } = renderWithProviders(
      <ProfileOptions value='addresses' />,
      {
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
      }
    )
    fireEvent.click(getByText('My Addresses'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'addresses' })
  })
})
