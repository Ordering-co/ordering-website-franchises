import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const accountUser = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  email: 'jane@example.com',
  cellphone: '5551234567',
  country_phone_code: '1',
  birthdate: '1990-01-15',
  settings: {
    email: { newsletter: false },
    sms: { newsletter: false },
    notification: { newsletter: false }
  },
  addresses: [{ id: 1, address: '123 Main St', location: { lat: 1, lng: 1 } }]
}

export const accountSession = {
  auth: true,
  user: accountUser,
  loading: false
}

export const accountWalletConfigs = {
  cash_wallet: { value: '1' },
  wallet_enabled: { value: '1' },
  wallet_cash_enabled: { value: '1' },
  wallet_credit_point_enabled: { value: '1' },
  disabled_rewards: { value: '0' },
  advanced_offers_module: { value: '0' },
  stripe_currency: { value: 'USD' },
  platform_store_giftcard_enabled: { value: '0' },
  validation_phone_number_lib: { value: '1' },
  default_country_code: { value: 'US' },
  verification_phone_required: { value: '0' },
  google_maps_api_key: { value: 'test-key' },
  google_autocomplete_selection_required: { value: '0' },
  meters_to_change_address: { value: '1000' },
  country_autocomplete: { value: '*' },
  order_types_allowed: { value: '1,2,3,4,5' }
}

export const accountLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' }
]

export const baseAccountHooks = {
  useLanguage: () => [{}, t],
  useSession: () => [accountSession, { login: vi.fn() }],
  useConfig: () => [{ loading: false, configs: accountWalletConfigs }],
  useEvent: () => [{ emit: vi.fn() }],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value,
    optimizeImage: (value) => value
  }],
  useOrder: () => [{
    loading: false,
    options: { type: 1, address: { address: '123 Main St', location: { lat: 1, lng: 1 } } }
  }, { changeType: vi.fn() }],
  useCustomer: () => [{ user: accountUser }, { setUserCustomer: vi.fn(), deleteUserCustomer: vi.fn() }],
  useToast: () => [null, { showToast: vi.fn() }],
  ToastType: { Error: 'error', Success: 'success' },
  useApi: () => [{ root: 'http://api', appId: 'app', project: 'demo' }],
  useWebsocket: () => ({ getId: () => 'socket-1' })
}

export const baseWalletList = {
  loading: false,
  error: null,
  wallets: [
    { id: 10, type: 'cash', balance: 25.5 },
    { id: 11, type: 'credit_point', balance: 120 }
  ]
}

export const baseLoyaltyLevel = {
  loyaltyLevel: {
    id: 1,
    name: 'Gold',
    loyalty_level_points: 80,
    image: 'gold.png',
    benefits: ['Free delivery', 'Bonus points']
  }
}

export const baseLevelList = {
  levels: [
    { id: 1, name: 'Gold', minimum_points: 50 },
    { id: 2, name: 'Platinum', minimum_points: 150 }
  ]
}

export const baseValidationFields = {
  loading: false,
  fields: {
    checkout: {
      email: { id: 1, code: 'email', name: 'Email', enabled: true, required: true, type: 'email' },
      name: { id: 2, code: 'name', name: 'Name', enabled: true, required: true, type: 'text' },
      cellphone: { id: 3, code: 'cellphone', name: 'Phone', enabled: true, required: false, type: 'text' },
      birthdate: { id: 4, code: 'birthdate', name: 'Birthdate', enabled: true, required: false, type: 'text' }
    }
  }
}

export const baseUserFormProps = {
  isEdit: true,
  formState: { loading: false, changes: {}, result: { error: false } },
  validationFields: baseValidationFields,
  showField: (code) => !['cellphone', 'birthdate', 'mobile_phone'].includes(code),
  isRequiredField: () => false,
  handleChangeInput: vi.fn(),
  handleButtonUpdateClick: vi.fn(),
  cleanFormState: vi.fn(),
  handleChangeNotifications: vi.fn(),
  userData: accountUser
}

export const baseAddressFormProps = {
  addressesList: [],
  googleMapsControls: {},
  formState: { loading: false, changes: {}, result: { error: false } },
  addressState: { loading: false, address: {} },
  isRequiredField: () => false,
  showField: () => true,
  updateChanges: vi.fn(),
  handleChangeInput: vi.fn(),
  saveAddress: vi.fn(),
  setIsEdit: vi.fn(),
  getNearestBusiness: vi.fn(),
  businessNearestState: { loading: false, business: { id: 1, name: 'Demo Store' } },
  onBusinessClick: vi.fn(),
  openBusinessList: false,
  setOpenBusinessList: vi.fn()
}

export const walletTransactionItem = {
  event: 'manual',
  event_type: 'credit',
  amount: 10,
  created_at: '2026-01-01T12:00:00Z',
  description: 'Accumulation credit point by order 101',
  code: 'PROMO10'
}
