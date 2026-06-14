import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSummary } from '../services/analyticsApi'

export const fetchSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getSummary()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  summary: null,   // { balance, income, expense, savings }
  isLoading: false,
  error: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = analyticsSlice.actions
export default analyticsSlice.reducer
