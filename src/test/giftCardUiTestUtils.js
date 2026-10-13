import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const giftCardProduct = {
  id: 1,
  name: 'Card $25',
  price: 25,
  image: 'card.png'
}

export const giftCardProducts = [
  giftCardProduct,
  { id: 2, name: 'Card $50', price: 50, image: 'card-50.png' }
]

export const pendingGiftCard = {
  id: 10,
  status: 'pending',
  created_at: '2026-01-01T12:00:00Z',
  order_product: {
    order_id: 101,
    name: 'Gift Card $25',
    price: 25,
    images: 'gift-25.png'
  }
}

export const sentGiftCard = {
  id: 11,
  status: 'sent',
  created_at: '2026-01-02T12:00:00Z',
  order_product: {
    order_id: 102,
    name: 'Gift Card $50',
    price: 50,
    images: 'gift-50.png'
  }
}

export const activatedGiftCard = {
  id: 12,
  status: 'activated',
  created_at: '2026-01-03T12:00:00Z',
  order_product: {
    order_id: 103,
    name: 'Gift Card $100',
    price: 100,
    images: 'gift-100.png'
  }
}

export const giftCardList = {
  loading: false,
  list: [pendingGiftCard]
}

export const emptyGiftCardList = {
  loading: false,
  list: []
}

export const loadingGiftCardList = {
  loading: true,
  list: []
}

export const giftCardPagination = {
  currentPage: 1,
  totalPages: 1
}

export const redeemedGiftCard = {
  type: 'digital',
  amount: 25,
  receiver: { name: 'Jane', lastname: 'Doe' },
  title: 'Happy birthday',
  message: 'Enjoy your meal'
}

export const emit = vi.fn()

export const baseGiftCardHooks = {
  useLanguage: () => [{}, t],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value,
    optimizeImage: (value) => value
  }],
  useEvent: () => [{ emit }]
}

export const basePurchaseGiftCardUIProps = {
  productsListState: { loading: false, products: giftCardProducts },
  selectedProduct: giftCardProduct,
  setSelectedProduct: vi.fn(),
  handleAccept: vi.fn()
}

export const baseRedeemGiftCardUIProps = {
  actionState: { loading: false, error: null },
  redeemedGiftCard: null,
  handleApply: vi.fn(),
  onClose: vi.fn()
}

export const baseSendGiftCardUIProps = {
  actionState: { loading: false, error: null },
  handleSendGiftCard: vi.fn()
}

export const baseGiftCardOrdersLayoutUIProps = {
  giftCards: giftCardList,
  paginationProps: giftCardPagination,
  goToPage: vi.fn(),
  loadMoreOrders: vi.fn(),
  title: 'Pending',
  setIsEmpty: vi.fn(),
  scrollId: 'pendingGifts'
}

export const giftCardThemeOverrides = {
  images: {
    general: { giftCard: 'gift-card.png' },
    dummies: { product: 'dummy-product.png' }
  }
}
