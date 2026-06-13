import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as budgetApi from '../services/budgetApi'

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const data = await budgetApi.getBudgets()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const data = await budgetApi.createBudget(budgetData)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await budgetApi.updateBudget(id, data)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await budgetApi.deleteBudget(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  budgets: [],
  isLoading: false,
  error: null,
}

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets.push(action.payload)
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.budgets.findIndex((b) => b.id === action.payload.id)
        if (index !== -1) {
          state.budgets[index] = action.payload
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = state.budgets.filter((b) => b.id !== action.payload)
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = budgetSlice.actions
export default budgetSlice.reducer
