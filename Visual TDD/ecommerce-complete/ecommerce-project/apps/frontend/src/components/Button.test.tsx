import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza el texto del botón', () => {
    render(<Button>Comprar</Button>)
    expect(screen.getByText('Comprar')).toBeInTheDocument()
  })

  it('aplica clase bg-blue-600 cuando variant es primary', () => {
    render(<Button variant="primary">OK</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })

  it('aplica clase bg-gray-300 cuando variant es secondary', () => {
    render(<Button variant="secondary">Cancel</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-300')
  })

  it('aplica opacity-50 cuando está disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toHaveClass('opacity-50')
  })

  it('llama onClick al hacer click', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('no llama onClick cuando está disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>No click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('usa type submit cuando se le pasa', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('usa variant primary por defecto', () => {
    render(<Button>Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })
})
