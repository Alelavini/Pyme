import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (usuario, clave) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Credenciales incorrectas')
    }

    const data = await res.json()
    const userData = {
      usuario,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    if (user?.refreshToken) {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: user.refreshToken }),
      }).catch(() => {})
    }
    localStorage.removeItem('user')
    setUser(null)
  }, [user])

  const refreshToken = useCallback(async () => {
    if (!user?.refreshToken) throw new Error('No refresh token')
    const res = await fetch('/api/refreshtoken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.refreshToken }),
    })
    if (!res.ok) {
      localStorage.removeItem('user')
      setUser(null)
      throw new Error('Session expired')
    }
    const data = await res.json()
    const updated = { ...user, accessToken: data.accessToken }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    return data.accessToken
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
