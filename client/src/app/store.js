import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import transactionReducer from '../features/transactionSlice'
import budgetReducer from '../features/budgetSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
  },
})
