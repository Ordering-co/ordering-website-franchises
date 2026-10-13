import React from 'react'
import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const baseLanguageMock = () => [{}, t]

export const baseOrderMock = () => [{
  loading: false,
  options: {
    type: 1,
    city_id: 1,
    address: { address: '123 Main St', location: { lat: 1, lng: 2 } }
  }
}, { changeType: vi.fn() }]

export const baseSessionMock = () => [{ auth: false, user: null }, { login: vi.fn() }]

export const baseUtilsMock = () => [{
  parsePrice: (value) => `$${value}`,
  parseDistance: (value) => `${value} mi`,
  parseTime: (value) => String(value ?? ''),
  parseDate: () => 'Jan 1, 2026',
  optimizeImage: (url) => url
}]

export const baseSiteMock = () => [{
  site: {
    business_url_template: '/store/:business_slug',
    product_url_template: '/store/:business_slug/:category_slug/:product_slug'
  }
}]

export const baseConfigMock = () => [{
  configs: {
    google_maps_api_key: { value: 'test-key' },
    preorder_status_enabled: { value: '1' },
    meters_to_change_address: { value: '100' }
  }
}]

export const baseEventMock = () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]

export const sampleBusiness = {
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  open: true,
  enabled: true,
  address: '123 Main St',
  delivery_price: 5,
  delivery_time: 30,
  pickup_time: 15,
  distance: 1.2,
  reviews: { total: 5, quality: 4.5 },
  today: {
    enabled: true,
    lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }]
  },
  timezone: 'UTC'
}

export const registerSkeletonMock = () => {
  vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
  vi.mock('react-loading-skeleton', () => ({
    default: () => <div data-testid='skeleton' />
  }))
}

export const registerSwiperMock = () => {
  vi.mock('swiper/react', () => ({
    Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
    SwiperSlide: ({ children }) => <div data-testid='swiper-slide'>{children}</div>
  }))
  vi.mock('swiper/modules', () => ({ Navigation: {} }))
  vi.mock('swiper/css', () => ({}))
  vi.mock('swiper/css/navigation', () => ({}))
}

export const registerPopperMock = () => {
  vi.mock('react-popper', () => ({
    usePopper: () => ({
      styles: { popper: {}, arrow: {} },
      attributes: { popper: {} }
    })
  }))
}
