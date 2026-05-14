import { mockDelay, MOCK_USERS } from './mockData'
import type { LoginCredentials, SignupData, AuthResponse } from '@/types'

// Simulated auth — swap for real API calls later
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await mockDelay(600)

    const user = MOCK_USERS.find((u) => u.email === credentials.email)

    if (!user || credentials.password.length < 6) {
      throw new Error('Invalid email or password')
    }

    const token = `mock_jwt_${user.id}_${Date.now()}`

    return { user, token }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    await mockDelay(800)

    if (MOCK_USERS.find((u) => u.email === data.email)) {
      throw new Error('An account with this email already exists')
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'member' as const,
      createdAt: new Date().toISOString(),
    }

    const token = `mock_jwt_${newUser.id}_${Date.now()}`

    return { user: newUser, token }
  },

  async getCurrentUser(token: string) {
    await mockDelay(300)

    const userId = token.split('_')[2]
    const user = MOCK_USERS.find((u) => u.id === userId)

    if (!user) throw new Error('Session expired')

    return user
  },

  async logout() {
    await mockDelay(200)
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_user')
  },
}
