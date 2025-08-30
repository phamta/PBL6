export const authHelpers = {
  // Token management
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      // Also set as cookie for middleware
      document.cookie = `token=${token}; path=/; max-age=86400` // 24 hours
    }
  },
  
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      // Remove cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
  },
  
  // User management
  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
      // Also set as cookie for middleware
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400` // 24 hours
    }
  },
  
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },
  
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      // Remove cookie
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
  },
  
  // Authentication checks
  isAuthenticated: () => {
    // Check if user is authenticated by looking for token in localStorage
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token')
    }
    return false
  },
  
  requireAuth: () => {
    return { isLoading: false, user: null }
  },
  
  // Role and permission checks
  hasRole: (requiredRole: string, userRole?: string) => {
    return userRole === requiredRole || userRole === 'admin'
  },
  
  hasPermission: (permission: string, userRole?: string) => {
    // Simple permission check - admin has all permissions
    return userRole === 'admin'
  },
  
  // Mock login for demo (keeping this for backward compatibility)
  mockLogin: (role: string) => {
    const mockUser = {
      id: 1,
      username: 'demo_user',
      email: 'demo@example.com',
      role: role,
      name: 'Demo User'
    }
    const mockToken = 'mock_token_' + Date.now()
    
    authHelpers.setToken(mockToken)
    authHelpers.setUser(mockUser)
  },
  
  // Logout
  logout: () => {
    authHelpers.removeToken()
    authHelpers.removeUser()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}

export default authHelpers
