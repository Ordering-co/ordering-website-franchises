import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { PlaceSpot } from '../index'

const uiPropsRef = { current: null }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  PlaceSpot: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      cart={{
        ...baseCartUIProps.cart,
        ...(rest.cart || {}),
        delivery_type: 3,
        place: { place_group_id: 1, id: 1 },
        place_id: 1
      }}
      orderTypes={{ 3: 'Eat in' }}
      placesState={{
        loading: false,
        placeGroups: [{ id: 1, name: 'Tables', enabled: true }],
        places: [{ id: 1, name: 'Table 1', enabled: true, place_group_id: 1 }]
      }}
      spotNumber=''
      spotState={{}}
      isCheckout={false}
      vehicle={{}}
      isInputMode={false}
      onClose={vi.fn()}
      setSpotNumber={vi.fn()}
      setVehicle={vi.fn()}
      setSpotState={vi.fn()}
      handleChangeSpot={vi.fn()}
      setHasBusinessPlaces={vi.fn()}
      setPlaceSpotNumber={vi.fn()}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [{ options: { type: 3 } }, {}]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  Select: ({ options = [], placeholder }) => (
    <div data-testid='select' data-placeholder={placeholder}>
      {options.map((opt) => <span key={opt.content}>{opt.content}</span>)}
    </div>
  )
}))

describe('PlaceSpot', () => {
  it('renders place group and spot selection', async () => {
    uiPropsRef.current = {}
    const { findByText, getByText } = renderWithProviders(<PlaceSpot cart={baseCartUIProps.cart} />)
    expect(await findByText(/Select your table/i)).toBeInTheDocument()
    expect(getByText('Tables')).toBeInTheDocument()
  })

  it('renders checkout spot title when isCheckout is true', async () => {
    uiPropsRef.current = { isCheckout: true }
    const { findByText } = renderWithProviders(<PlaceSpot cart={baseCartUIProps.cart} isCheckout />)
    expect(await findByText(/Select your table/i)).toBeInTheDocument()
  })
})
