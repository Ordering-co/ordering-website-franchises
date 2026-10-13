import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { AutoScroll } from '../index'

const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth')

describe('AutoScroll', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollBy = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get () {
        if (this.id === 'autoscroll' || this.id === 'promo-scroll') return 50
        if (this.firstElementChild?.id === 'autoscroll' || this.firstElementChild?.id === 'promo-scroll') {
          return 400
        }
        return 100
      }
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get () {
        return 400
      }
    })
  })

  afterEach(() => {
    delete HTMLElement.prototype.scrollBy
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
    }
    if (originalScrollWidth) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth)
    }
  })

  it('renders children only when horizontal scroll is disabled', () => {
    const { getByText, queryByRole } = renderWithProviders(
      <AutoScroll disableHorizontalScroll>
        <span>plain children</span>
      </AutoScroll>
    )
    expect(getByText('plain children')).toBeInTheDocument()
    expect(queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders overflow arrows and scrolls on mouse down', () => {
    const { getByText, container } = renderWithProviders(
      <AutoScroll modal>
        <span>scrolled</span>
      </AutoScroll>
    )
    expect(getByText('scrolled')).toBeInTheDocument()
    const left = container.querySelector('.left-autoscroll')
    const right = container.querySelector('.right-autoscroll')
    expect(left).not.toBeNull()
    expect(right).not.toBeNull()
    fireEvent.mouseDown(left)
    fireEvent.mouseDown(right)
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalled()
  })

  it('hides arrows in column mode and uses a custom scroll id', () => {
    const { getByText, container } = renderWithProviders(
      <AutoScroll isColumnMode scrollId='promo-scroll'>
        <span>column</span>
      </AutoScroll>
    )
    expect(getByText('column')).toBeInTheDocument()
    expect(container.querySelector('#promo-scroll')).not.toBeNull()
    expect(container.querySelector('.left-autoscroll')).toBeNull()
  })

  it('handles rtl overflow and fires the right-end callback', () => {
    const onHandleRightEnd = vi.fn()
    renderWithProviders(
      <AutoScroll special onHandleRightEnd={onHandleRightEnd}>
        <span>rtl</span>
      </AutoScroll>,
      { themeOverrides: { rtl: true } }
    )
    expect(onHandleRightEnd).toHaveBeenCalled()
  })
})
