import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
}

export const productsApi = {
  getAll: () => apiClient.get('/products'),
  create: (name: string, description: string, price: number, stock: number) =>
    apiClient.post('/products', { name, description, price, stock }),
}

export const cartApi = {
  view: () => apiClient.get('/cart'),
  addItem: (productId: string, quantity: number) =>
    apiClient.post('/cart/items', { productId, quantity }),
  removeItem: (productId: string) =>
    apiClient.delete(`/cart/items/${productId}`),
}

export const ordersApi = {
  create: () => apiClient.post('/orders'),
  listMine: () => apiClient.get('/orders'),
  listAll: () => apiClient.get('/admin/orders'),
}

export default apiClient
