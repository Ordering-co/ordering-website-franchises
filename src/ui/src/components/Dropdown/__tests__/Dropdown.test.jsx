import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Dropdown, DropdownToggle, DropDownMenu, DropdownItem } from '../index'

describe('Dropdown', () => {
  it('renders the toggle, menu, and extra children when open', () => {
    const { getByText } = renderWithProviders(
      <Dropdown open>
        <DropdownToggle>Open menu</DropdownToggle>
        <DropDownMenu>
          <DropdownItem>First item</DropdownItem>
        </DropDownMenu>
        <span>Extra child</span>
      </Dropdown>
    )
    expect(getByText('Open menu')).toBeInTheDocument()
    expect(getByText('First item')).toBeInTheDocument()
    expect(getByText('Extra child')).toBeInTheDocument()
  })

  it('hides extra children when closed and still mounts the menu', () => {
    const { getByText, queryByText, rerender } = renderWithProviders(
      <Dropdown open={false}>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropDownMenu>
          <DropdownItem>Hidden extra only</DropdownItem>
        </DropDownMenu>
        <span>Only when open</span>
      </Dropdown>
    )
    expect(getByText('Toggle')).toBeInTheDocument()
    expect(getByText('Hidden extra only')).toBeInTheDocument()
    expect(queryByText('Only when open')).not.toBeInTheDocument()

    rerender(
      <Dropdown open>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropDownMenu>
          <DropdownItem>Hidden extra only</DropdownItem>
        </DropDownMenu>
        <span>Only when open</span>
      </Dropdown>
    )
    expect(getByText('Only when open')).toBeInTheDocument()
  })

  it('renders a standalone dropdown item', () => {
    const { getByText } = renderWithProviders(
      <DropdownItem>Standalone</DropdownItem>
    )
    expect(getByText('Standalone')).toBeInTheDocument()
  })
})
