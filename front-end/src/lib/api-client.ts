import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },
  
  loginByUsername: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    })
    return response.data
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },
  
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },
}

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/users')
    return response.data
  },
  
  getUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },
  
  createUser: async (userData: any) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },
  
  updateUser: async (id: string, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },
  
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },
}

// Visitors API
export const visitorsAPI = {
  getVisitors: async () => {
    const response = await apiClient.get('/visitors')
    return response.data
  },
  
  getVisitor: async (id: string) => {
    const response = await apiClient.get(`/visitors/${id}`)
    return response.data
  },
  
  createVisitor: async (visitorData: any) => {
    const response = await apiClient.post('/visitors', visitorData)
    return response.data
  },
  
  updateVisitor: async (id: string, visitorData: any) => {
    const response = await apiClient.put(`/visitors/${id}`, visitorData)
    return response.data
  },
  
  deleteVisitor: async (id: string) => {
    const response = await apiClient.delete(`/visitors/${id}`)
    return response.data
  },
}

// Translation Requests API
export const translationAPI = {
  getTranslationRequests: async () => {
    const response = await apiClient.get('/translation-requests')
    return response.data
  },
  
  getTranslationRequest: async (id: string) => {
    const response = await apiClient.get(`/translation-requests/${id}`)
    return response.data
  },
  
  createTranslationRequest: async (requestData: any) => {
    const response = await apiClient.post('/translation-requests', requestData)
    return response.data
  },
  
  updateTranslationRequest: async (id: string, requestData: any) => {
    const response = await apiClient.put(`/translation-requests/${id}`, requestData)
    return response.data
  },
  
  deleteTranslationRequest: async (id: string) => {
    const response = await apiClient.delete(`/translation-requests/${id}`)
    return response.data
  },
}

export default apiClient