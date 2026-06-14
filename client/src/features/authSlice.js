import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../services/authApi'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, password)
      localStorage.setItem('finance_manager_token', data.token)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ fullname, email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register(fullname, email, password)
      localStorage.setItem('finance_manager_token', data.token)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('finance_manager_token')
      if (!token) return null
      const data = await authApi.getProfile()
      return data
    } catch (error) {
      localStorage.removeItem('finance_manager_token')
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ fullname, email }, { rejectWithValue }) => {
    try {
      const data = await authApi.updateProfile(fullname, email)
      return data // updated user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'auth/updateUserPassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authApi.updatePassword(currentPassword, newPassword)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const uploadUserAvatar = createAsyncThunk(
  'auth/uploadUserAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await authApi.uploadAvatar(formData)
      return data // updated user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('finance_manager_token') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('finance_manager_token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('finance_manager_token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update Password
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Upload Avatar
    builder
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
