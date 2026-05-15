import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'
import { authApi } from '../services/api'

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
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
}

describe('authStore', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('estado inicial: no autenticado', () => {
    const { user, token, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('login guarda token y usuario en el store', async () => {
    const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' }
    vi.mocked(authApi.login).mockResolvedValue({
      data: { token: 'abc123', user: fakeUser },
    } as any)

    await useAuthStore.getState().login('test@test.com', '1234')

    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBe('abc123')
    expect(user).toEqual(fakeUser)
    expect(isAuthenticated).toBe(true)
  })

  it('login guarda token en localStorage', async () => {
    const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' }
    vi.mocked(authApi.login).mockResolvedValue({
      data: { token: 'abc123', user: fakeUser },
    } as any)

    await useAuthStore.getState().login('test@test.com', '1234')

    expect(localStorage.getItem('token')).toBe('abc123')
    expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeUser))
  })

  it('logout limpia el store', async () => {
    const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' }
    vi.mocked(authApi.login).mockResolvedValue({
      data: { token: 'abc123', user: fakeUser },
    } as any)
    await useAuthStore.getState().login('test@test.com', '1234')

    useAuthStore.getState().logout()

    const { user, token, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('logout limpia localStorage', async () => {
    localStorage.setItem('token', 'abc123')
    localStorage.setItem('user', JSON.stringify({ id: '1' }))

    useAuthStore.getState().logout()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('initializeAuth restaura sesión desde localStorage', () => {
    const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' }
    localStorage.setItem('token', 'saved-token')
    localStorage.setItem('user', JSON.stringify(fakeUser))

    useAuthStore.getState().initializeAuth()

    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBe('saved-token')
    expect(user).toEqual(fakeUser)
    expect(isAuthenticated).toBe(true)
  })

  it('initializeAuth no hace nada si no hay datos en localStorage', () => {
    useAuthStore.getState().initializeAuth()

    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('register llama a authApi.register', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ data: {} } as any)

    await useAuthStore.getState().register('new@test.com', '1234', 'Nuevo')

    expect(authApi.register).toHaveBeenCalledWith('new@test.com', '1234', 'Nuevo')
  })

  it('login lanza error cuando la API falla', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Unauthorized'))

    await expect(
      useAuthStore.getState().login('bad@test.com', 'wrong')
    ).rejects.toThrow('Unauthorized')
  })
})
