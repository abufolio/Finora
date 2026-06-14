import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loginUser, registerUser, fetchCurrentUser, logout, updateUserProfile, updateUserPassword, uploadUserAvatar } from '../features/authSlice'

export const useReduxAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('finance_manager_token')
    if (token && !auth.user) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, auth.user])

  const login = (email, password) => {
    return dispatch(loginUser({ email, password }))
  }

  const register = (fullname, email, password) => {
    return dispatch(registerUser({ fullname, email, password }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const updateProfile = (fullname, email) => {
    return dispatch(updateUserProfile({ fullname, email }))
  }

  const updatePassword = (currentPassword, newPassword) => {
    return dispatch(updateUserPassword({ currentPassword, newPassword }))
  }

  const uploadAvatar = (formData) => {
    return dispatch(uploadUserAvatar(formData))
  }

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    register,
    updateProfile,
    updatePassword,
    uploadAvatar,
    logout: handleLogout,
  }
}
