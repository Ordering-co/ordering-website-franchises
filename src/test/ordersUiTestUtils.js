import { vi } from 'vitest'

export const baseOrder = {
  id: 101,
  uuid: 'order-uuid-1',
  status: 1,
  business_id: 1,
  business: {
    id: 1,
    name: 'Demo Store',
    logo: 'logo.png',
    slug: 'demo',
    address: '123 Main'
  },
  products: [{ id: 1, product_id: 1, name: 'Burger', quantity: 1, code: 'BRG-1' }],
  summary: { total: 12.99 },
  total: 12.99,
  delivery_type: 1,
  delivery_datetime: '2026-01-01T12:00:00Z',
  delivery_datetime_utc: '2026-01-01T12:00:00Z',
  created_at: '2026-01-01T11:00:00Z',
  driver: { id: 9, name: 'Sam', lastname: 'D' }
}

export const baseOrderList = {
  loading: false,
  error: null,
  orders: [baseOrder]
}

export const basePagination = {
  currentPage: 1,
  totalPages: 1
}

export const reviewCommentListMock = () => ({
  1: { title: 'What went wrong?', list: [{ key: 0, content: 'Not on-time' }] },
  2: { title: 'What went wrong?', list: [{ key: 0, content: 'Not on-time' }] },
  3: { title: 'What went wrong?', list: [{ key: 0, content: 'Not on-time' }] },
  4: { title: 'What went well?', list: [{ key: 0, content: 'On time' }] },
  5: { title: 'What went well?', list: [{ key: 0, content: 'On time' }] },
  like: [{ key: 0, content: 'Tasty' }],
  dislike: [{ key: 0, content: 'Cold' }]
})

export const baseOrdersUiHooks = {
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value,
    parseTime: (value) => value,
    optimizeImage: (value) => value
  }],
  useConfig: () => [{ configs: {} }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useSession: () => [{ auth: true, user: { id: 1, name: 'Jane' } }],
  useEvent: () => [{ emit: vi.fn() }]
}
