import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Promotions } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  PromotionsController: ({ UIComponent, ...rest }) => (
    <UIComponent
      offersState={{
        loading: false,
        offers: [{
          id: 1,
          name: 'Summer Deal',
          description: '10% off',
          type: 2,
          coupon: 'SUMMER',
          target: 1,
          rate_type: 1,
          rate: 10,
          end: '2026-12-01',
          businesses: [{ id: 1, name: 'Cafe', slug: 'cafe', logo: '' }]
        }]
      }}
      searchValue=''
      handleSearchValue={vi.fn()}
      offerSelected={null}
      setOfferSelected={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parseDate: () => 'Jan 1', parsePrice: (v) => `$${v}` }],
  useEvent: () => [{ emit: vi.fn() }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui', () => ({
  SearchBar: ({ placeholder, onSearch }) => (
    <input data-testid='search' placeholder={placeholder} onChange={(e) => onSearch?.(e.target.value)} />
  ),
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null),
  NotFoundSource: ({ content }) => <div>{content}</div>,
  checkSiteUrl: (_t, fallback) => fallback
}))

describe('Promotions', () => {
  it('renders promotions list and opens offer modal', () => {
    const { getByText, getByTestId } = renderWithProviders(<Promotions />)
    expect(getByText('Promotions')).toBeInTheDocument()
    expect(getByText('Summer Deal')).toBeInTheDocument()
    fireEvent.click(getByText('View offer'))
    expect(getByTestId('modal')).toBeInTheDocument()
  })
})
