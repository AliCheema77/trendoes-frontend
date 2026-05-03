'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, fetchUserProfile, refreshAccessToken } from '@/lib/api'

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
    const stored = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    if (!stored || !refresh) {
      setIsLoading(false)
      return
    }
    try {
      const profile = await fetchUserProfile(stored)
      setUser(profile['user information '])
      setAccessToken(stored)
    } catch {
      // Access token expired — try refresh
      try {
        const refreshed = await refreshAccessToken(refresh)
        storeTokens(refreshed.access, refresh)
        const profile = await fetchUserProfile(refreshed.access)
        setUser(profile['user information '])
        setAccessToken(refreshed.access)
      } catch {
        clearTokens()
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password)
    storeTokens(data.access, data.refresh)
    setAccessToken(data.access)
    const profile = await fetchUserProfile(data.access)
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