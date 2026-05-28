'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, fetchUserProfile } from '@/lib/api'

interface UserInfo {
  id: number
  username: string
  email: string
}

interface AuthContextProps {
  user: UserInfo | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, password2: string, phone?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const storeTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  const clearTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const restoreSession = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) {
      setIsLoading(false)
      return
    }
    try {
      // apiFetchAuth handles expired access tokens automatically (refresh + retry)
      const profile = await fetchUserProfile()
      setUser(profile['user information '])
      setAccessToken(localStorage.getItem('access_token'))
    } catch {
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  // Keep React state in sync when apiFetchAuth silently refreshes the token mid-session
  useEffect(() => {
    const onRefreshed = (e: Event) => setAccessToken((e as CustomEvent<string>).detail)
    const onLogout = () => { setUser(null); setAccessToken(null) }
    window.addEventListener('auth:token-refreshed', onRefreshed)
    window.addEventListener('auth:logout', onLogout)
    return () => {
      window.removeEventListener('auth:token-refreshed', onRefreshed)
      window.removeEventListener('auth:logout', onLogout)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password)
    storeTokens(data.access, data.refresh)
    setAccessToken(data.access)
    const profile = await fetchUserProfile()
    setUser(profile['user information '])
  }

  const register = async (username: string, email: string, password: string, password2: string, phone?: string) => {
    const data = await registerUser({ username, email, password, password2, phone_number: phone })
    storeTokens(data.access, data.refresh)
    setAccessToken(data.access)
    setUser(data.user)
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}