import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { setRefreshFn, setGetToken } from '../api/client'

export default function ProtectedRoute() {
  const { user, refreshToken } = useAuth()

  useEffect(() => {
    setRefreshFn(refreshToken)
    setGetToken(() => user?.accessToken)
  }, [user, refreshToken])

  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
