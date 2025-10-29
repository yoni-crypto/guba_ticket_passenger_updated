import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface LoginRequest {
  countryCode: string
  mobileNumber: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  countryCode: string
  mobileNumber: string
  email: string
  password: string
  gender: string
}

interface User {
  passengerGuid: string
  firstName: string
  lastName: string
  gender: string
  countryCode: string
  mobileNumber: string
  email: string
  status: string
  lastModified: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequest) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/passenger/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data.token
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterRequest) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/passenger/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data.passenger
  }
)

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState }
    const token = state.auth.token
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/profile/details`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data.passenger
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    clearError: (state) => {
      state.error = null
    },
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          state.token = token
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.isAuthenticated = true
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload)
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
  },
})

export const { logout, clearError, loadFromStorage } = authSlice.actions
export default authSlice.reducer