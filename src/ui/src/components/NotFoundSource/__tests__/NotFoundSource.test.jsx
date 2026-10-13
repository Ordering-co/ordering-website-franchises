import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { NotFoundSource } from '../index'

vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('NotFoundSource', () => {
  it('renders content and children when no button is provided', () => {
    const { getByText, container } = renderWithProviders(
      <NotFoundSource content='No stores nearby'>
        <p>Try another address</p>
      </NotFoundSource>
    )
    expect(container.querySelector('#not-found-source')).not.toBeNull()
    expect(getByText('No stores nearby')).toBeInTheDocument()
    expect(getByText('Try another address')).toBeInTheDocument()
  })

  it('renders conditioned content and a button action', () => {
    const onClickButton = vi.fn()
    const { getByText, queryByText } = renderWithProviders(
      <NotFoundSource
        content='Nothing here'
        conditioned
        btnTitle='Go home'
        onClickButton={onClickButton}
      >
        <p>Should stay hidden</p>
      </NotFoundSource>
    )
    expect(getByText('Nothing here')).toBeInTheDocument()
    expect(queryByText('Should stay hidden')).not.toBeInTheDocument()
    fireEvent.click(getByText('Go home'))
    expect(onClickButton).toHaveBeenCalled()
  })
})
