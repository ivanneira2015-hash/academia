import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import { productsApi } from '../services/api'

const mockNavigate = vi.fn()
const mockAddItem = vi.fn()
let mockIsAuthenticated = false

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

vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: mockIsAuthenticated }),
}))

vi.mock('../stores/cartStore', () => ({
  useCartStore: () => ({ addItem: mockAddItem }),
}))

const fakeProducts = [
  { id: '1', name: 'Laptop', description: 'Buena laptop', price: 999, stock: 5 },
  { id: '2', name: 'Mouse', description: 'Mouse inalámbrico', price: 29, stock: 10 },
]

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated = false
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('muestra "Loading products..." mientras carga', () => {
    vi.mocked(productsApi.getAll).mockReturnValue(new Promise(() => {}))
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading products...')).toBeInTheDocument()
  })

  it('muestra los productos después de cargar', async () => {
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: fakeProducts } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument()
      expect(screen.getByText('Mouse')).toBeInTheDocument()
    })
  })

  it('renderiza un ProductCard por cada producto', async () => {
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: fakeProducts } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /add to cart/i })).toHaveLength(2)
    })
  })

  it('no muestra loading después de cargar productos', async () => {
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: fakeProducts } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
    })
  })

  it('navega a /login si usuario no autenticado intenta agregar al carrito', async () => {
    const user = userEvent.setup()
    mockIsAuthenticated = false
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: [fakeProducts[0]] } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('llama addItem cuando usuario autenticado agrega al carrito', async () => {
    const user = userEvent.setup()
    mockIsAuthenticated = true
    mockAddItem.mockResolvedValue(undefined)
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: [fakeProducts[0]] } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(mockAddItem).toHaveBeenCalledWith('1', 1)
  })

  it('muestra alerta de éxito al agregar al carrito', async () => {
    const user = userEvent.setup()
    mockIsAuthenticated = true
    mockAddItem.mockResolvedValue(undefined)
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: [fakeProducts[0]] } as any)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Added to cart!')
    })
  })

  it('maneja error de API silenciosamente y deja de cargar', async () => {
    vi.mocked(productsApi.getAll).mockRejectedValue(new Error('Server error'))
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
    })
  })
})
