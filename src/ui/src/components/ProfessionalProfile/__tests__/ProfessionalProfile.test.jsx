import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { professionalUser, secondProfessional } from '../../../../../test/addressUiTestUtils'
import { ProfessionalProfile } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ optimizeImage: (value) => `opt-${value}` }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  BusinessPreorder: ({ business }) => (
    <div data-testid='business-preorder'>{business?.name} schedule</div>
  )
}))

describe('ProfessionalProfile', () => {
  it('renders a scheduled professional and books them', () => {
    const handleChangeProfessionalSelected = vi.fn()
    const onClose = vi.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <ProfessionalProfile
        currentProfessional={professionalUser}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        onClose={onClose}
      />
    )
    expect(getByText('Alex Rivera')).toBeInTheDocument()
    expect(getByText('Schedule')).toBeInTheDocument()
    expect(getByTestId('business-preorder')).toBeInTheDocument()
    fireEvent.click(getByText('Book'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(professionalUser)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows no schedule when a professional has none', () => {
    const { getByText } = renderWithProviders(
      <ProfessionalProfile
        currentProfessional={secondProfessional}
        handleChangeProfessionalSelected={vi.fn()}
      />
    )
    expect(getByText('Sam Lee')).toBeInTheDocument()
    expect(getByText('No schedule')).toBeInTheDocument()
    fireEvent.click(getByText('Book'))
  })
})
