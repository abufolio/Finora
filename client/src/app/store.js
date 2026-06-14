import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import transactionReducer from '../features/transactionSlice'
import budgetReducer from '../features/budgetSlice'
import analyticsReducer from '../features/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    analytics: analyticsReducer,
  },
})
