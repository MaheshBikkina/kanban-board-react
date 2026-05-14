import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Avatar from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renders initials when no src provided', () => {
    render(<Avatar name="Alex Morgan" />)
    expect(screen.getByText('AM')).toBeInTheDocument()
  })

  it('renders an img when src is provided', () => {
    render(<Avatar name="Alex Morgan" src="https://example.com/avatar.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'Alex Morgan')
  })

  it('uses correct size class for sm', () => {
    const { container } = render(<Avatar name="Alex Morgan" size="sm" />)
    expect(container.firstChild).toHaveClass('w-7')
  })
})
