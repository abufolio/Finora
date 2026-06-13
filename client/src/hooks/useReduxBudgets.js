import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../features/budgetSlice'

export const useReduxBudgets = () => {
  const dispatch = useDispatch()
  const budgets = useSelector((state) => state.budgets.budgets)
  const isLoading = useSelector((state) => state.budgets.isLoading)
  const error = useSelector((state) => state.budgets.error)

  const loadBudgets = () => {
    dispatch(fetchBudgets())
  }

  const add = (budgetData) => {
    return dispatch(createBudget(budgetData))
  }

  const update = (id, budgetData) => {
    return dispatch(updateBudget({ id, data: budgetData }))
  }

  const remove = (id) => {
    return dispatch(deleteBudget(id))
  }

  return {
    budgets,
    isLoading,
    error,
    loadBudgets,
    add,
    update,
    remove,
  }
}
