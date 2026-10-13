import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { baseLevelList, baseLoyaltyLevel } from '../../../../../../test/accountUiTestUtils'
import { Status } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('Status', () => {
  it('shows progress toward the next loyalty level', () => {
    const { getByText } = renderWithProviders(
      <Status
        userLoyaltyLevel={baseLoyaltyLevel}
        levelList={baseLevelList}
      />
    )
    expect(getByText('Gold')).toBeInTheDocument()
    expect(getByText('80')).toBeInTheDocument()
    expect(getByText(/You need 70 to reach Platinum/)).toBeInTheDocument()
  })

  it('opens benefits and reports the last level', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <Status
        userLoyaltyLevel={{
          loyaltyLevel: {
            ...baseLoyaltyLevel.loyaltyLevel,
            id: 2,
            name: 'Platinum',
            loyalty_level_points: 200
          }
        }}
        levelList={baseLevelList}
      />
    )
    expect(getByText('You already reach the last level')).toBeInTheDocument()
    fireEvent.click(getByText('View Benefits'))
    expect(getByTestId('modal')).toBeInTheDocument()
    expect(getByText('Free delivery')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
    expect(queryByTestId('modal')).not.toBeInTheDocument()
  })
})
