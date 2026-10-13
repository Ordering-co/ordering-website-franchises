import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SearchBar } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('searches immediately and can clear the value', () => {
    const onSearch = vi.fn()
    const view = renderWithProviders(
      <SearchBar
        search='pizza'
        placeholder='Search'
        onSearch={onSearch}
      />
    )
    const input = view.getByLabelText('search')
    expect(input).toHaveValue('pizza')
    fireEvent.keyUp(input, { target: { value: 'burgers' }, keyCode: 66 })
    expect(onSearch).toHaveBeenCalledWith('burgers')
    view.rerender(
      <SearchBar
        search='pizza'
        placeholder='Search'
        onSearch={onSearch}
      />
    )
    fireEvent.click(view.getByText('Clear'))
    expect(onSearch).toHaveBeenCalledWith('')

    view.rerender(
      <SearchBar search='' placeholder='Search' onSearch={onSearch} />
    )
    expect(view.getByLabelText('search')).toHaveValue('')
  })

  it('debounces lazy search and handles enter plus click', () => {
    const onSearch = vi.fn()
    const handleCustomEnter = vi.fn()
    const forwardRef = { current: null }
    const { getByLabelText } = renderWithProviders(
      <SearchBar
        lazyLoad
        isCustomLayout
        starbucksStyle
        forceFocus
        placeholder='Find'
        forwardRef={forwardRef}
        handleCustomEnter={handleCustomEnter}
        onSearch={onSearch}
      />
    )
    const input = getByLabelText('search')
    expect(forwardRef.current).toBe(input)
    fireEvent.click(input)
    expect(handleCustomEnter).toHaveBeenCalled()
    fireEvent.keyUp(input, { target: { value: 'tacos' }, keyCode: 13 })
    expect(handleCustomEnter).toHaveBeenCalledWith('tacos')
    expect(onSearch).not.toHaveBeenCalled()

    fireEvent.keyUp(input, { target: { value: 'sushi' }, keyCode: 83 })
    expect(onSearch).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(750)
    })
    expect(onSearch).toHaveBeenCalledWith('sushi')
  })
})
