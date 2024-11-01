import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'

describe('Dashboard', () => {
  it('should render add link button', () => {
    render(<Dashboard />)
    expect(screen.getByText('Add New Link')).toBeInTheDocument()
  })

  // Add more tests...
}) 