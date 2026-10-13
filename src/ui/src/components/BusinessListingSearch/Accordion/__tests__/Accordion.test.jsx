import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { FilterAccordion } from '../index'

describe('FilterAccordion', () => {
  it('toggles accordion content', () => {
    const { getByText, queryByText } = renderWithProviders(
      <FilterAccordion title='Filters'>
        <div>Filter body</div>
      </FilterAccordion>
    )
    expect(queryByText('Filter body')).not.toBeInTheDocument()
    fireEvent.click(getByText('Filters'))
    expect(getByText('Filter body')).toBeInTheDocument()
  })
})
