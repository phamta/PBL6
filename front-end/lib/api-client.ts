import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      Cookies.remove('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string
    password: string
    fullName: string
    department: string
  }) =>
    apiClient.post('/auth/register', data),
}

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.patch('/users/profile', data),
  getUsers: () => apiClient.get('/users'),
}

export const mouAPI = {
  getMOUs: () => apiClient.get('/mou'),
  getMOU: (id: string) => apiClient.get(`/mou/${id}`),
  createMOU: (data: any) => apiClient.post('/mou', data),
  updateMOU: (id: string, data: any) => apiClient.patch(`/mou/${id}`, data),
  deleteMOU: (id: string) => apiClient.delete(`/mou/${id}`),
}

export const visaAPI = {
  getVisaApplications: () => apiClient.get('/visa'),
  getMyApplications: () => apiClient.get('/visa/my-applications'),
  getVisaApplication: (id: string) => apiClient.get(`/visa/${id}`),
  createVisaApplication: (data: any) => apiClient.post('/visa', data),
  updateVisaApplication: (id: string, data: any) => apiClient.patch(`/visa/${id}`, data),
  deleteVisaApplication: (id: string) => apiClient.delete(`/visa/${id}`),
}

export const visitorAPI = {
  getVisitors: () => apiClient.get('/visitor'),
  getVisitor: (id: string) => apiClient.get(`/visitor/${id}`),
  createVisitor: (data: any) => apiClient.post('/visitor', data),
  updateVisitor: (id: string, data: any) => apiClient.patch(`/visitor/${id}`, data),
  deleteVisitor: (id: string) => apiClient.delete(`/visitor/${id}`),
}

export const translationAPI = {
  getTranslations: () => apiClient.get('/translation'),
  getTranslation: (id: string) => apiClient.get(`/translation/${id}`),
  createTranslation: (data: any) => apiClient.post('/translation', data),
  updateTranslation: (id: string, data: any) => apiClient.patch(`/translation/${id}`, data),
  deleteTranslation: (id: string) => apiClient.delete(`/translation/${id}`),
}
