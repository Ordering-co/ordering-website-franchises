import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PageBanner } from '../index'

const emit = vi.fn()
const handleCustomProductBannerClick = vi.fn()
const siteRef = { current: { site: {} } }
const bannerStateRef = {
  current: {
    banner: {
      items: []
    }
  }
}

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children, onClick }) => (
    <button type='button' data-testid='swiper-slide' onClick={onClick}>{children}</button>
  )
}))
vi.mock('swiper/modules', () => ({ Navigation: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~components', () => ({
  PageBanner: ({ UIComponent, ...rest }) => (
    <UIComponent
      pageBannerState={bannerStateRef.current}
      handleCustomProductBannerClick={handleCustomProductBannerClick}
      {...rest}
    />
  ),
  useSite: () => [siteRef.current],
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  checkSiteUrl: (url, fallback) => url || fallback
}))

const pizza = { id: 9, name: 'Pizza' }
const business = {
  slug: 'pizza-place',
  categories: [{ id: 3, products: [pizza] }]
}

describe('PageBanner', () => {
  beforeEach(() => {
    emit.mockClear()
    handleCustomProductBannerClick.mockClear()
    siteRef.current = { site: {} }
    bannerStateRef.current = { banner: { items: [] } }
  })

  it('renders nothing without banner items', () => {
    const { queryByTestId } = renderWithProviders(<PageBanner />)
    expect(queryByTestId('swiper')).not.toBeInTheDocument()
  })

  it('opens a business from a banner using the default store template', () => {
    bannerStateRef.current = {
      banner: {
        items: [{ url: 'banner.png', action: { type: 'business', url: 'https://app.example/store/pizza-place' } }]
      }
    }
    const { getByTestId, getByAltText } = renderWithProviders(<PageBanner />)
    expect(getByAltText('')).toHaveAttribute('src', 'banner.png')
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'pizza-place' },
      replace: false
    })
  })

  it('opens a business in customer mode and through a query template', () => {
    bannerStateRef.current = {
      banner: {
        items: [{ url: 'a.png', action: { type: 'business', url: 'https://app.example/store/taco-town' } }]
      }
    }
    const { getByTestId, rerender } = renderWithProviders(<PageBanner isCustomerMode />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'business', params: { store: 'taco-town' } })

    siteRef.current = { site: { business_url_template: '/search?store=:business_slug' } }
    rerender(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      search: '?store=taco-town',
      replace: false
    })
  })

  it('uses an in-business product banner click when the product is on the current store', () => {
    bannerStateRef.current = {
      banner: {
        items: [{
          url: 'p.png',
          action: {
            type: 'product',
            url: 'https://app.example/store/pizza-place?category=3&product=9'
          }
        }]
      }
    }
    const { getByTestId } = renderWithProviders(<PageBanner business={business} />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(handleCustomProductBannerClick).toHaveBeenCalledWith(pizza)
    expect(emit).not.toHaveBeenCalled()
  })

  it('redirects product banners for another store and customer mode', () => {
    bannerStateRef.current = {
      banner: {
        items: [{
          url: 'p.png',
          action: {
            type: 'product',
            url: 'https://app.example/store/other-shop?category=1&product=2'
          }
        }]
      }
    }
    const { getByTestId, rerender } = renderWithProviders(
      <PageBanner isCustomerMode business={business} />
    )
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('product_banner_clicked')
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { store: 'other-shop' },
      search: '?category=1&product=2',
      replace: true
    })

    siteRef.current = {
      site: {
        product_url_template: '/store/:business_slug/:category_slug/:product_slug'
      }
    }
    rerender(<PageBanner business={business} />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'product',
      params: {
        business_slug: 'other-shop',
        category_slug: '1',
        product_slug: '2'
      },
      replace: false
    })
  })

  it('covers the remaining product url templates', () => {
    bannerStateRef.current = {
      banner: {
        items: [{
          url: 'p.png',
          action: {
            type: 'product',
            url: 'https://app.example/store/other-shop?category=1&product=2'
          }
        }]
      }
    }

    siteRef.current = {
      site: {
        business_url_template: '/store?store=:business_slug',
        product_url_template: '/store/:category_slug/:product_slug'
      }
    }
    const { getByTestId, rerender } = renderWithProviders(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'product',
      params: { category_slug: '1', product_slug: '2' },
      search: '?store=other-shop',
      replace: false
    })

    siteRef.current = {
      site: {
        product_url_template: '/store/:business_slug?category_id=:category_id&product_id=:product_id'
      }
    }
    rerender(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'product',
      params: { business_slug: 'other-shop' },
      search: '?category_id=1&product_id=2',
      replace: false
    })

    siteRef.current = {
      site: {
        product_url_template: '/:business_slug?category_id=:category_id&product_id=:product_id'
      }
    }
    rerender(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'product',
      params: { business_slug: 'other-shop' },
      search: '?category_id=1&product_id=2',
      replace: false
    })
  })

  it('ignores banner actions without a url', () => {
    bannerStateRef.current = {
      banner: {
        items: [{ url: 'x.png', action: { type: 'business' } }]
      }
    }
    const { getByTestId } = renderWithProviders(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).not.toHaveBeenCalled()
  })
})
