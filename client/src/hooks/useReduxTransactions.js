import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
} from '../features/transactionSlice'

export const useReduxTransactions = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const pagination = useSelector((state) => state.transactions.pagination)
  const isLoading = useSelector((state) => state.transactions.isLoading)
  const error = useSelector((state) => state.transactions.error)
  const filters = useSelector((state) => state.transactions.filters)

  const loadTransactions = (filterOptions) => {
    dispatch(fetchTransactions(filterOptions))
  }

  const add = (transactionData) => {
    return dispatch(createTransaction(transactionData))
  }

  const update = (id, transactionData) => {
    return dispatch(updateTransaction({ id, data: transactionData }))
  }

  const remove = (id) => {
    return dispatch(deleteTransaction(id))
  }

  const setFilter = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  return {
    transactions,
    pagination,
    isLoading,
    error,
    filters,
    loadTransactions,
    add,
    update,
    remove,
    setFilter,
  }
}
