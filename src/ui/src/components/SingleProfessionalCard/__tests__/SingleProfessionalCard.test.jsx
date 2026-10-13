import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { professionalUser, secondProfessional } from '../../../../../test/addressUiTestUtils'
import { SingleProfessionalCard } from '../index'

const cardPropsRef = { current: {} }
const sessionRef = { current: { auth: true } }
const handleFavoriteProfessional = vi.fn()
const handleProfessionalClick = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  SingleProfessionalCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      professional={professionalUser}
      handleFavoriteProfessional={handleFavoriteProfessional}
      handleProfessionalClick={handleProfessionalClick}
      {...rest}
      {...cardPropsRef.current}
    />
  ),
  useSession: () => [sessionRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  ProfessionalInfo: ({ userId }) => <div data-testid='professional-info'>{userId}</div>
}))

describe('SingleProfessionalCard', () => {
  it('renders a professional and opens info', () => {
    cardPropsRef.current = { professional: professionalUser, active: true }
    sessionRef.current = { auth: true }
    const { getByText, getByTestId, container } = renderWithProviders(
      <SingleProfessionalCard />
    )
    expect(getByText('Alex Rivera')).toBeInTheDocument()
    expect(getByText('Barber')).toBeInTheDocument()
    fireEvent.click(getByText('Alex Rivera'))
    expect(handleProfessionalClick).toHaveBeenCalled()
    const info = container.querySelector('.info')
    fireEvent.click(info)
    expect(getByTestId('professional-info')).toHaveTextContent('7')
    fireEvent.click(getByText('close'))
  })

  it('toggles favorite when authenticated and ignores guests', () => {
    cardPropsRef.current = { professional: { ...professionalUser, favorite: true } }
    sessionRef.current = { auth: true }
    const { container } = renderWithProviders(<SingleProfessionalCard />)
    fireEvent.click(container.querySelector('.favorite'))
    expect(handleFavoriteProfessional).toHaveBeenCalledWith(false)
    sessionRef.current = { auth: false }
    handleFavoriteProfessional.mockClear()
    const guest = renderWithProviders(
      <SingleProfessionalCard />
    )
    fireEvent.click(guest.container.querySelector('.favorite'))
    expect(handleFavoriteProfessional).not.toHaveBeenCalled()
  })

  it('renders skeleton and dummy avatar states', () => {
    cardPropsRef.current = { isSkeleton: true, handleProfessionalClick: null }
    const { getAllByTestId } = renderWithProviders(<SingleProfessionalCard />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
    cardPropsRef.current = { professional: secondProfessional, isSmallPhoto: true }
    const loaded = renderWithProviders(<SingleProfessionalCard />)
    expect(loaded.getByText('Sam Lee')).toBeInTheDocument()
    expect(loaded.getByText('Stylist')).toBeInTheDocument()
  })
})
