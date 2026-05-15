import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'

const defaultProps = {
  id: '1',
  name: 'Laptop',
  description: 'Una laptop genial',
  price: 999,
  stock: 5,
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el nombre del producto', () => {
    render(<ProductCard {...defaultProps} />)
    expect(screen.getByText('Laptop')).toBeInTheDocument()
  })

  it('muestra la descripción', () => {
    render(<ProductCard {...defaultProps} />)
    expect(screen.getByText('Una laptop genial')).toBeInTheDocument()
  })

  it('muestra el precio', () => {
    render(<ProductCard {...defaultProps} />)
    expect(screen.getByText('$999')).toBeInTheDocument()
  })

  it('muestra el stock', () => {
    render(<ProductCard {...defaultProps} />)
    expect(screen.getByText('Stock: 5')).toBeInTheDocument()
  })

  it('muestra input y botón Add to Cart cuando hay stock', () => {
    render(<ProductCard {...defaultProps} />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  it('muestra Out of Stock cuando stock es 0', () => {
    render(<ProductCard {...defaultProps} stock={0} />)
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('no muestra input ni botón cuando stock es 0', () => {
    render(<ProductCard {...defaultProps} stock={0} />)
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument()
  })

  it('llama onAddToCart con quantity 1 por defecto', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(onAddToCart).toHaveBeenCalledWith(1)
  })

  it('llama onAddToCart con la cantidad correcta después de cambiarla', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)
    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '3')
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(onAddToCart).toHaveBeenCalledWith(3)
  })

  it('resetea la cantidad a 1 después de agregar al carrito', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)
    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '4')
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(input).toHaveValue(1)
  })
})
