import { useDispatch, useSelector } from 'react-redux'
import { fetchSummary } from '../features/analyticsSlice'

export const useReduxAnalytics = () => {
  const dispatch = useDispatch()
  const summary = useSelector((state) => state.analytics.summary)
  const isLoading = useSelector((state) => state.analytics.isLoading)
  const error = useSelector((state) => state.analytics.error)

  const loadSummary = () => {
    dispatch(fetchSummary())
  }

  return {
    summary,
    isLoading,
    error,
    loadSummary,
  }
}
