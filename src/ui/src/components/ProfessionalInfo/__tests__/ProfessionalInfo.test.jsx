import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProfessionalInfo } from '../index'

const infoPropsRef = { current: {} }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  ProfessionalInfo: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../test/addressUiTestUtils').baseProfessionalInfoProps}
      {...rest}
      {...infoPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ optimizeImage: (value) => `opt-${value}` }]
}))

describe('ProfessionalInfo', () => {
  it('renders a professional and review comments', () => {
    infoPropsRef.current = {}
    const { getByText, getAllByText } = renderWithProviders(<ProfessionalInfo userId={7} />)
    expect(getByText('Alex Rivera')).toBeInTheDocument()
    expect(getByText('Barber')).toBeInTheDocument()
    expect(getByText('Cuts hair')).toBeInTheDocument()
    expect(getByText('Reviews')).toBeInTheDocument()
    expect(getByText('Great cut')).toBeInTheDocument()
    expect(getByText('Almost great')).toBeInTheDocument()
    expect(getAllByText('Terrible').length).toBeGreaterThan(0)
  })

  it('shows skeletons while user and reviews load', () => {
    infoPropsRef.current = {
      userState: { loading: true, user: {} },
      userReviewState: { loading: true, reviews: [] }
    }
    const { getAllByTestId } = renderWithProviders(<ProfessionalInfo />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('shows an empty review state and a dummy photo', () => {
    infoPropsRef.current = {
      userState: {
        loading: false,
        user: { name: 'Sam', occupation: { name: 'Stylist' } }
      },
      userReviewState: { loading: false, reviews: [] }
    }
    const { getByText } = renderWithProviders(<ProfessionalInfo />)
    expect(getByText('Sam')).toBeInTheDocument()
    expect(getByText('The review does not exist.')).toBeInTheDocument()
  })
})
