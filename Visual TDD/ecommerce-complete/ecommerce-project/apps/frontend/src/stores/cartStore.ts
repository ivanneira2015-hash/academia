import { create } from 'zustand'
import { cartApi } from '../services/api'

interface CartItem {
  productId: string
  quantity: number
  price: number
  subtotal: number
}

interface CartStore {
  items: CartItem[]
  total: number
  loading: boolean
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true })
      const response = await cartApi.view()
      set({ items: response.data.items, total: response.data.total })
    } catch (error) {
      console.error('Failed to fetch cart', error)
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (productId: string, quantity: number) => {
    await cartApi.addItem(productId, quantity)
    const store = useCartStore.getState()
    await store.fetchCart()
  },

  removeItem: async (productId: string) => {
    await cartApi.removeItem(productId)
    const store = useCartStore.getState()
    await store.fetchCart()
  },
}))
