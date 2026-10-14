import React from 'react'
import settings from '../../../config'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { ListenPageChanges } from '../index'

vi.mock('../../../config', () => ({ default: { localProjectPinned: false } }))

const emit = vi.fn()
const on = vi.fn()
const off = vi.fn()
const push = vi.fn()
const merge = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({
      listen: vi.fn(() => vi.fn()),
      location: { pathname: '/home', search: '' },
      push,
      replace: vi.fn()
    })
  }
})

vi.mock('~components', () => ({
  useEvent: () => [{ emit, on, off }],
  useLanguage: () => [{ language: { rtl: true } }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug', product_url_template: '/store/:business_slug' } }]
}))

vi.mock('~ui', () => ({
  useTheme: () => [{ rtl: false }, { merge }],
  checkSiteUrl: (template) => template
}))

describe('ListenPageChanges', () => {
  it('maps local catalogue navigation without changing production routes', () => {
    settings.localProjectPinned = true
    renderWithProviders(<ListenPageChanges />)
    const handler = on.mock.calls.filter(([event]) => event === 'go_to_page').at(-1)[1]
    handler({ page: 'search' })
    expect(push).toHaveBeenLastCalledWith('/search')
    settings.localProjectPinned = false
  })

  it('renders children and wires event listeners', () => {
    const { getByText } = renderWithProviders(
      <ListenPageChanges><span>page-child</span></ListenPageChanges>
    )
    expect(getByText('page-child')).toBeInTheDocument()
    expect(on).toHaveBeenCalledWith('go_to_page', expect.any(Function))
    expect(on).toHaveBeenCalledWith('get_current_view', expect.any(Function))
    expect(merge).toHaveBeenCalledWith({ rtl: true })
  })

  it('navigates on go_to_page for business_search', () => {
    renderWithProviders(<ListenPageChanges><span>x</span></ListenPageChanges>)
    const handler = on.mock.calls.find(([event]) => event === 'go_to_page')?.[1]
    handler({ page: 'business_search', search: '?q=pizza' })
    expect(push).toHaveBeenCalledWith('/business_search?q=pizza')
  })
})
