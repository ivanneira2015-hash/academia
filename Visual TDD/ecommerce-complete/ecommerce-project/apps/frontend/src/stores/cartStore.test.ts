import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import { cartApi } from '../services/api'

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

const resetStore = () => {
  useCartStore.setState({ items: [], total: 0, loading: false })
}

const fakeCartResponse = {
  data: {
    items: [
      { productId: 'p1', quantity: 2, price: 100, subtotal: 200 },
      { productId: 'p2', quantity: 1, price: 50, subtotal: 50 },
    ],
    total: 250,
  },
}

describe('cartStore', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  it('estado inicial correcto', () => {
    const { items, total, loading } = useCartStore.getState()
    expect(items).toEqual([])
    expect(total).toBe(0)
    expect(loading).toBe(false)
  })

  it('fetchCart guarda items y total', async () => {
    vi.mocked(cartApi.view).mockResolvedValue(fakeCartResponse as any)

    await useCartStore.getState().fetchCart()

    const { items, total } = useCartStore.getState()
    expect(items).toHaveLength(2)
    expect(total).toBe(250)
  })

  it('fetchCart pone loading en false al terminar', async () => {
    vi.mocked(cartApi.view).mockResolvedValue(fakeCartResponse as any)

    await useCartStore.getState().fetchCart()

    expect(useCartStore.getState().loading).toBe(false)
  })

  it('fetchCart maneja errores silenciosamente', async () => {
    vi.mocked(cartApi.view).mockRejectedValue(new Error('Network error'))

    await expect(useCartStore.getState().fetchCart()).resolves.not.toThrow()
    expect(useCartStore.getState().loading).toBe(false)
  })

  it('addItem llama a cartApi.addItem y luego fetchCart', async () => {
    vi.mocked(cartApi.addItem).mockResolvedValue({ data: {} } as any)
    vi.mocked(cartApi.view).mockResolvedValue(fakeCartResponse as any)

    await useCartStore.getState().addItem('p1', 3)

    expect(cartApi.addItem).toHaveBeenCalledWith('p1', 3)
    expect(cartApi.view).toHaveBeenCalled()
  })

  it('addItem actualiza items en el store', async () => {
    vi.mocked(cartApi.addItem).mockResolvedValue({ data: {} } as any)
    vi.mocked(cartApi.view).mockResolvedValue(fakeCartResponse as any)

    await useCartStore.getState().addItem('p1', 2)

    expect(useCartStore.getState().items).toHaveLength(2)
    expect(useCartStore.getState().total).toBe(250)
  })

  it('removeItem llama a cartApi.removeItem y luego fetchCart', async () => {
    vi.mocked(cartApi.removeItem).mockResolvedValue({ data: {} } as any)
    vi.mocked(cartApi.view).mockResolvedValue({ data: { items: [], total: 0 } } as any)

    await useCartStore.getState().removeItem('p1')

    expect(cartApi.removeItem).toHaveBeenCalledWith('p1')
    expect(cartApi.view).toHaveBeenCalled()
  })

  it('removeItem actualiza el store con la respuesta de fetchCart', async () => {
    vi.mocked(cartApi.removeItem).mockResolvedValue({ data: {} } as any)
    vi.mocked(cartApi.view).mockResolvedValue({
      data: { items: [{ productId: 'p2', quantity: 1, price: 50, subtotal: 50 }], total: 50 },
    } as any)

    await useCartStore.getState().removeItem('p1')

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().total).toBe(50)
  })
})
