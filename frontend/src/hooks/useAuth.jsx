import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

// Session lifetime: 24 hours
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('token_expiry')
}

function isSessionExpired() {
  const expiry = localStorage.getItem('token_expiry')
  return !expiry || Date.now() > Number(expiry)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !isSessionExpired()) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => clearSession())
        .finally(() => setLoading(false))
    } else {
      clearSession()
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    localStorage.setItem('access_token', res.data.access_token)
    localStorage.setItem('token_expiry', String(Date.now() + SESSION_DURATION_MS))
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
