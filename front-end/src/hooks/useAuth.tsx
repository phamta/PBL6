'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import apiClient from '@/lib/api-client'

interface User {
  id: string
  email: string
  fullName?: string
  role: string
  avatar?: string
  department?: string
  phone?: string
  status: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get('auth-token')
      if (savedToken) {
        setToken(savedToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        
        try {
          const response = await apiClient.get('/users/profile')
          setUser(response.data)
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          Cookies.remove('auth-token')
          setToken(null)
          delete apiClient.defaults.headers.common['Authorization']
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { access_token, user: userData } = response.data
      
      setToken(access_token)
      setUser(userData)
      
      Cookies.set('auth-token', access_token, { expires: 7 })
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove('auth-token')
    delete apiClient.defaults.headers.common['Authorization']
  }

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const response = await apiClient.get('/users/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
