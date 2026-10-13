import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Image } from '../index'

describe('Image', () => {
  it('renders the source image when provided', () => {
    const { getByAltText } = renderWithProviders(
      <Image src='photo.png' className='avatar' style={{ border: '1px solid red' }} />
    )
    const image = getByAltText('profile-image')
    expect(image).toHaveAttribute('src', 'photo.png')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveClass('avatar')
  })

  it('renders a node fallback when there is no source', () => {
    const { getByText, queryByAltText } = renderWithProviders(
      <Image fallback={<span>No photo</span>} />
    )
    expect(getByText('No photo')).toBeInTheDocument()
    expect(queryByAltText('profile-image')).not.toBeInTheDocument()
  })

  it('swaps to a string fallback after the source fails, then removes it', () => {
    const { getByAltText, container } = renderWithProviders(
      <Image src='broken.png' fallback='fallback.png' className='pic' />
    )
    fireEvent.error(getByAltText('profile-image'))
    expect(getByAltText('profile-image')).toHaveAttribute('src', 'fallback.png')
    fireEvent.error(getByAltText('profile-image'))
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.pic')).not.toBeNull()
  })

  it('renders a node fallback after the source fails', () => {
    const { getByAltText, getByText } = renderWithProviders(
      <Image src='broken.png' fallback={<span>User icon</span>} />
    )
    fireEvent.error(getByAltText('profile-image'))
    expect(getByText('User icon')).toBeInTheDocument()
  })
})
