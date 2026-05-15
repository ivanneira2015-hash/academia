import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CartPage from './CartPage'
import { ordersApi } from '../services/api'

const mockNavigate = vi.fn()
const mockFetchCart = vi.fn()
const mockRemoveItem = vi.fn()
let mockItems: Array<{ productId: string; quantity: number; price: number; subtotal: number }> = []
let mockTotal = 0

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
  cartApi: {
    view: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
  },
  productsApi: {
    getAll: vi.fn(),
  },
  ordersApi: {
    create: vi.fn(),
    listMine: vi.fn(),
  },
}))

vi.mock('../stores/cartStore', () => ({
  useCartStore: () => ({
    items: mockItems,
    total: mockTotal,
    fetchCart: mockFetchCart,
    removeItem: mockRemoveItem,
  }),
}))

const fakeItems = [
  { productId: 'p1', quantity: 2, price: 100, subtotal: 200 },
  { productId: 'p2', quantity: 1, price: 50, subtotal: 50 },
]

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockItems = []
    mockTotal = 0
    mockFetchCart.mockResolvedValue(undefined)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('llama fetchCart al montar', () => {
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(mockFetchCart).toHaveBeenCalledTimes(1)
  })

  it('muestra "Your cart is empty" cuando no hay items', () => {
    mockItems = []
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('muestra los items del carrito', () => {
    mockItems = fakeItems
    mockTotal = 250
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Product p1')).toBeInTheDocument()
    expect(screen.getByText('Product p2')).toBeInTheDocument()
  })

  it('muestra el total correctamente', () => {
    mockItems = fakeItems
    mockTotal = 250
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Total: $250')).toBeInTheDocument()
  })

  it('muestra botón Remove por cada item', () => {
    mockItems = fakeItems
    mockTotal = 250
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(2)
  })

  it('muestra botón Checkout cuando hay items', () => {
    mockItems = fakeItems
    mockTotal = 250
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument()
  })

  it('llama removeItem al hacer click en Remove', async () => {
    const user = userEvent.setup()
    mockItems = fakeItems
    mockTotal = 250
    mockRemoveItem.mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(mockRemoveItem).toHaveBeenCalledWith('p1')
  })

  it('checkout llama ordersApi.create y navega a /orders', async () => {
    const user = userEvent.setup()
    mockItems = fakeItems
    mockTotal = 250
    vi.mocked(ordersApi.create).mockResolvedValue({ data: {} } as any)
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: /checkout/i }))
    await waitFor(() => {
      expect(ordersApi.create).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/orders')
    })
  })

  it('checkout muestra alerta de éxito', async () => {
    const user = userEvent.setup()
    mockItems = fakeItems
    mockTotal = 250
    vi.mocked(ordersApi.create).mockResolvedValue({ data: {} } as any)
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: /checkout/i }))
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Order created successfully!')
    })
  })

  it('checkout muestra alerta de error cuando falla', async () => {
    const user = userEvent.setup()
    mockItems = fakeItems
    mockTotal = 250
    vi.mocked(ordersApi.create).mockRejectedValue(new Error('Server error'))
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: /checkout/i }))
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to create order')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
