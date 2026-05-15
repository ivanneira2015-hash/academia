import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import { authApi } from '../services/api'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

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
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el formulario de login', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('permite escribir en el campo email', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'test@test.com')
    expect(emailInput).toHaveValue('test@test.com')
  })

  it('permite escribir en el campo password', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, 'secret')
    expect(passwordInput).toHaveValue('secret')
  })

  it('navega a / después de login exitoso', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'test@test.com')
    await user.type(screen.getByLabelText(/password/i), '1234')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('llama login con email y password correctos', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'test@test.com')
    await user.type(screen.getByLabelText(/password/i), '1234')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', '1234')
    })
  })

  it('muestra "Login failed" cuando el login falla', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('Unauthorized'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'bad@test.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument()
    })
  })

  it('no navega cuando el login falla', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('Unauthorized'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'bad@test.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

// authApi imported to satisfy noUnusedLocals — used indirectly via the API mock module
void authApi
