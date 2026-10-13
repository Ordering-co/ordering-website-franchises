import React from 'react'
import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const baseLanguageMock = () => [{}, t]

export const baseOrderMock = () => [{
  loading: false,
  options: { type: 1 },
  carts: {}
}, {}]

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

export const sampleCategory = { id: 10, name: 'Burgers', subcategories: [{ id: 11, name: 'Beef' }] }

export const sampleProduct = {
  id: 100,
  name: 'Cheeseburger',
  description: 'Tasty',
  price: 9.99,
  category_id: 10,
  inventoried: false,
  extras: [],
  featured: false
}

export const sampleCategoryState = {
  loading: false,
  products: [sampleProduct],
  pagination: { currentPage: 1, pageSize: 20, totalPages: 1, nextPageItems: 10, totalItems: 1 }
}

export const ensureStylesElement = () => {
  if (!document.getElementById('styles')) {
    document.head.appendChild(Object.assign(document.createElement('style'), { id: 'styles' }))
  }
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
  vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {}, FreeMode: {} }))
  vi.mock('swiper/css', () => ({}))
  vi.mock('swiper/css/navigation', () => ({}))
  vi.mock('swiper/css/pagination', () => ({}))
}

export const registerNanoidMock = () => {
  vi.mock('nanoid', () => ({ nanoid: () => 'test-id' }))
}

export const mockSingleProductCard = () => ({ product }) => (
  <div data-testid='product-card'>{product?.name}</div>
)
