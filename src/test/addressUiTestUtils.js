import { vi } from 'vitest'

export const t = (_key, fallback) => fallback ?? _key

export const addressUser = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  email: 'jane@example.com'
}

export const savedAddress = {
  id: 1,
  address: '123 Main St',
  address_notes: 'Gate',
  zipcode: '33101',
  internal_number: '2',
  location: { lat: 25.7, lng: -80.1 },
  tag: 'home',
  default: true
}

export const secondAddress = {
  id: 2,
  address: '456 Oak Ave',
  address_notes: '',
  zipcode: '33102',
  internal_number: '',
  location: { lat: 25.8, lng: -80.2 },
  tag: 'office',
  default: false
}

export const nearbyBusiness = {
  id: 9,
  name: 'Demo Store',
  address: '9 Pine St',
  cellphone: '5551112222'
}

export const addressConfigs = {
  google_maps_api_key: { value: 'test-key' },
  google_autocomplete_selection_required: { value: '0' },
  meters_to_change_address: { value: '1000' },
  country_autocomplete: { value: '*' },
  order_types_allowed: { value: '1|2|3|4|5' },
  use_alternative_to_google_maps: { value: '0' },
  preorder_status_enabled: { value: '1' },
  max_days_preorder: { value: '6' },
  dates_moment_format: { value: 'YYYY-MM-DD HH:mm' },
  general_hour_format: { value: 'HH:mm' },
  stripe_currency: { value: 'USD' }
}

export const emit = vi.fn()
export const saveAddress = vi.fn()
export const handleChangeInput = vi.fn()
export const updateChanges = vi.fn()
export const handleSetDefault = vi.fn()
export const handleDeleteAddress = vi.fn()
export const setAddressList = vi.fn()
export const handleChangeOrderType = vi.fn()
export const handleAsap = vi.fn()
export const handleChangeDate = vi.fn()
export const handleChangeTime = vi.fn()
export const onCloseMoment = vi.fn()

export const baseAddressHooks = {
  useLanguage: () => [{}, t],
  useSession: () => [{ auth: true, user: addressUser }, {}],
  useOrder: () => [{
    loading: false,
    options: {
      type: 1,
      address_id: 1,
      address: savedAddress,
      moment: null
    },
    carts: {}
  }, {}],
  useConfig: () => [{ loading: false, configs: addressConfigs }],
  useEvent: () => [{ emit }],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value,
    parseTime: (value) => String(value ?? ''),
    optimizeImage: (value) => value
  }],
  useCustomer: () => [{ user: addressUser }, {}],
  useApi: () => [{
    pages: () => ({
      get: async () => ({
        response: { data: { result: [] } },
        content: { error: false, result: { body: '' } }
      })
    })
  }]
}

export const baseAddressFormProps = {
  addressesList: [],
  googleMapsControls: {},
  formState: { loading: false, changes: {}, result: { error: false } },
  addressState: { loading: false, address: {} },
  isRequiredField: () => false,
  showField: () => true,
  updateChanges,
  handleChangeInput,
  handleChangeAddress: vi.fn(),
  saveAddress,
  setIsEdit: vi.fn(),
  userCustomerSetup: null
}

export const baseAddressListProps = {
  actionStatus: { loading: false },
  addressList: { loading: false, error: null, addresses: [savedAddress, secondAddress] },
  handleDelete: handleDeleteAddress,
  setAddressList,
  handleSetDefault,
  isModal: true,
  isPopover: false,
  isProductForm: false,
  userId: 1,
  userCustomerSetup: null,
  isEnableContinueButton: false,
  setCustomerModalOpen: vi.fn(),
  isCustomerMode: false,
  isFromCheckout: false,
  setIsAddressFormOpen: vi.fn(),
  isProfile: false,
  isMobile: false,
  onCancel: vi.fn(),
  isOpenUserData: false,
  isHideTitle: false,
  setAddingNewAddress: vi.fn(),
  avoidLoading: false
}

export const momentDatesList = [
  '2026-09-07',
  '2026-09-08',
  '2026-09-09',
  '2026-09-10',
  '2026-09-11',
  '2026-09-12'
]

export const momentHoursList = [
  { startTime: '10:00', endTime: '10:30' },
  { startTime: '12:00', endTime: '12:30' },
  { startTime: '14:00', endTime: '14:30' }
]

export const momentTimeList = [
  { value: '10:00', text: '10:00' },
  { value: '12:00', text: '12:00' },
  { value: '14:00', text: '14:00' }
]

export const baseMomentControlProps = {
  isAsap: true,
  datesList: momentDatesList,
  hoursList: momentHoursList,
  dateSelected: '2026-09-07',
  timeSelected: '10:00',
  handleAsap,
  handleChangeDate,
  handleChangeTime,
  onClose: onCloseMoment,
  isAppoint: false,
  cateringPreorder: false,
  isCart: false,
  preorderLeadTime: 0,
  preorderMinimumDays: 0,
  preorderMaximumDays: 6,
  business: {},
  getActualSchedule: () => ({
    enabled: true,
    lapses: [{ open: { hour: 8, minute: 0 }, close: { hour: 22, minute: 0 } }]
  })
}

export const professionalUser = {
  id: 7,
  name: 'Alex',
  lastname: 'Rivera',
  last_name: 'Rivera',
  photo: 'alex.png',
  occupation: { name: 'Barber', description: 'Cuts hair' },
  favorite: false,
  schedule: { 0: { enabled: true } }
}

export const secondProfessional = {
  id: 8,
  name: 'Sam',
  lastname: 'Lee',
  last_name: 'Lee',
  photo: null,
  occupation: { name: 'Stylist' },
  favorite: true
}

export const professionalList = [professionalUser, secondProfessional]

export const professionalReviews = [
  { id: 1, qualification: 5, comment: 'Great cut' },
  { id: 2, qualification: 3, comment: 'Okay' },
  { id: 3, qualification: 1, comment: 'Terrible' },
  { id: 4, qualification: 2, comment: 'Bad' },
  { id: 5, qualification: 4, comment: 'Good' },
  { id: 6, qualification: 4.5, comment: 'Almost great' }
]

export const baseProfessionalInfoProps = {
  userState: {
    loading: false,
    user: {
      name: 'Alex Rivera',
      photo: 'alex.png',
      occupation: { name: 'Barber', description: 'Cuts hair' }
    }
  },
  userReviewState: {
    loading: false,
    reviews: professionalReviews
  }
}

export const professionalSortOptions = [
  { value: 'name', content: 'Name' },
  { value: 'price', content: 'Price' }
]

export const stripeCart = {
  total: 25.5,
  balance: 25.5,
  business: { name: 'Demo Store' }
}

export const stripeCartGroup = {
  total: 40,
  balance: 40,
  carts: [
    { business: { name: 'Store A' } },
    { business: { name: 'Store B' } }
  ]
}

export const stripePaymethods = [
  { value: 'ideal', name: 'iDEAL' },
  { value: 'bancontact', name: 'Bancontact' }
]

export const stripeUser = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com'
}

export const resetAddressUiSpies = () => {
  emit.mockClear()
  saveAddress.mockClear()
  handleChangeInput.mockClear()
  updateChanges.mockClear()
  handleSetDefault.mockClear()
  handleDeleteAddress.mockClear()
  setAddressList.mockClear()
  handleChangeOrderType.mockClear()
  handleAsap.mockClear()
  handleChangeDate.mockClear()
  handleChangeTime.mockClear()
  onCloseMoment.mockClear()
}
