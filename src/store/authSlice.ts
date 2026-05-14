import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import type { AuthState, LoginCredentials, SignupData, User } from '@/types'

const storedUser = localStorage.getItem('pf_user')
const storedToken = localStorage.getItem('pf_token')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoading: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('pf_token', response.token)
      localStorage.setItem('pf_user', JSON.stringify(response.user))
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data)
      localStorage.setItem('pf_token', response.token)
      localStorage.setItem('pf_user', JSON.stringify(response.user))
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      return rejectWithValue(message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('pf_token')
      localStorage.removeItem('pf_user')
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('pf_user', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const { logout, updateUser } = authSlice.actions
export default authSlice.reducer
