import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Pagination } from '../index'

describe('Pagination', () => {
  it('renders a short page list and changes pages', () => {
    const handleChangePage = vi.fn()
    const { getByText } = renderWithProviders(
      <Pagination currentPage={1} totalPages={5} handleChangePage={handleChangePage} />
    )
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
    fireEvent.click(getByText('3'))
    expect(handleChangePage).toHaveBeenCalledWith(3)
    fireEvent.click(getByText('3'))
    expect(handleChangePage).toHaveBeenCalledTimes(1)
  })

  it('shows ellipsis in the middle of a long list and moves with next or prev', () => {
    const handleChangePage = vi.fn()
    const { getByText, getAllByText, rerender, container } = renderWithProviders(
      <Pagination currentPage={6} totalPages={10} handleChangePage={handleChangePage} />
    )
    expect(getByText('6')).toBeInTheDocument()
    expect(getAllByText('...').length).toBeGreaterThan(0)
    const buttons = container.querySelectorAll('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(handleChangePage).toHaveBeenCalledWith(7)

    rerender(
      <Pagination currentPage={9} totalPages={10} handleChangePage={handleChangePage} />
    )
    expect(getByText('9')).toBeInTheDocument()
    const laterButtons = container.querySelectorAll('button')
    fireEvent.click(laterButtons[0])
    expect(handleChangePage).toHaveBeenCalledWith(8)
  })

  it('uses the leading page group and ignores clicks on the current page', () => {
    const handleChangePage = vi.fn()
    const { getByText } = renderWithProviders(
      <Pagination currentPage={2} totalPages={12} handleChangePage={handleChangePage} />
    )
    expect(getByText('5')).toBeInTheDocument()
    expect(getByText('12')).toBeInTheDocument()
    fireEvent.click(getByText('2'))
    expect(handleChangePage).not.toHaveBeenCalled()
  })

  it('renders without pages when totalPages is missing', () => {
    const { container } = renderWithProviders(
      <Pagination currentPage={1} handleChangePage={vi.fn()} />
    )
    expect(container.querySelectorAll('button').length).toBe(2)
  })
})
