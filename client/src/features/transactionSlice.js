import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as transactionApi from '../services/transactionApi'

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await transactionApi.getTransactions(filters)
      return data // { transactions, totalCount, totalPages, page }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const data = await transactionApi.createTransaction(transactionData)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await transactionApi.updateTransaction(id, data)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionApi.deleteTransaction(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  transactions: [],
  pagination: {
    page: 1,
    totalCount: 0,
    totalPages: 1,
  },
  isLoading: false,
  error: null,
  filters: {},
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload.transactions
        state.pagination = {
          page: action.payload.page,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create transaction — server dan qaytgan yangi ob'ekt ro'yxatning boshiga qo'shiladi
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions.unshift(action.payload)
        state.pagination.totalCount += 1
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.transactions.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = state.transactions.filter((t) => t.id !== action.payload)
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, clearError } = transactionSlice.actions
export default transactionSlice.reducer
