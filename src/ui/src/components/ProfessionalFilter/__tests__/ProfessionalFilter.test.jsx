import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { professionalList, professionalUser } from '../../../../../test/addressUiTestUtils'
import { ProfessionalFilter } from '../index'

const handleChangeProfessionalSelected = vi.fn()
const handleUpdateProfessionals = vi.fn()

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  AutoScroll: ({ children }) => <div data-testid='auto-scroll'>{children}</div>,
  ProfessionalProfile: ({ currentProfessional, onClose, handleChangeProfessionalSelected: onSelect }) => (
    <div data-testid='professional-profile'>
      <span>{currentProfessional?.name}</span>
      <button type='button' onClick={() => onSelect(currentProfessional)}>book-pro</button>
      <button type='button' onClick={onClose}>close-profile</button>
    </div>
  ),
  ProfessionalInfo: () => <div data-testid='professional-info' />,
  SingleProfessionalCard: ({ professional, handleProfessionalClick, handleUpdateProfessionals: onUpdate }) => (
    <div>
      <button type='button' onClick={(e) => handleProfessionalClick(e, professional)}>
        {professional.name}
      </button>
      <button
        type='button'
        className='favorite'
        onClick={() => onUpdate(professional.id, { favorite: true })}
      >
        fav-{professional.name}
      </button>
    </div>
  )
}))

describe('ProfessionalFilter', () => {
  it('renders professionals and selects any member', () => {
    const { getByText } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionalList}
        professionalSelected={null}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        handleUpdateProfessionals={handleUpdateProfessionals}
      />
    )
    expect(getByText('Professionals')).toBeInTheDocument()
    expect(getByText('Any professional member')).toBeInTheDocument()
    fireEvent.click(getByText('Any professional member'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(null)
  })

  it('opens a profile, updates favorites, and books', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionalList}
        professionalSelected={professionalUser}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        handleUpdateProfessionals={handleUpdateProfessionals}
      />
    )
    fireEvent.click(getByText('fav-Alex'))
    expect(handleUpdateProfessionals).toHaveBeenCalledWith({ ...professionalUser, favorite: true })
    fireEvent.click(getByText('Alex'))
    expect(getByTestId('professional-profile')).toHaveTextContent('Alex')
    fireEvent.click(getByText('book-pro'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(professionalUser)
    fireEvent.click(getByText('close-profile'))
    expect(queryByTestId('professional-profile')).not.toBeInTheDocument()
  })
})
