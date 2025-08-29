import Cookies from 'js-cookie'

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'khoa' | 'phong' | 'user'
  department?: string
  avatar?: string
}

export const authHelpers = {
  // Get token from cookies
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || null
    }
    return null
  },

  // Set token in cookies
  setToken: (token: string): void => {
    Cookies.set('token', token, { expires: 7 }) // 7 days
  },

  // Remove token from cookies
  removeToken: (): void => {
    Cookies.remove('token')
    Cookies.remove('user')
  },

  // Get user info from cookies
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = Cookies.get('user')
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (error) {
          console.error('Error parsing user data:', error)
          return null
        }
      }
    }
    return null
  },

  // Set user info in cookies
  setUser: (user: User): void => {
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authHelpers.getToken()
  },

  // Check if user has specific role
  hasRole: (role: User['role']): boolean => {
    const user = authHelpers.getUser()
    return user?.role === role
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles: User['role'][]): boolean => {
    const user = authHelpers.getUser()
    return user ? roles.includes(user.role) : false
  },

  // Logout user
  logout: (): void => {
    authHelpers.removeToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },
}
