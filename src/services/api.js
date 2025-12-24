import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email, password) => {
    return api.post('/api/auth/login', { email, password })
  },
}

export const couponService = {
  getAll: (params = {}) => {
    return api.get('/api/coupons', { params })
  },
  
  getById: (id) => {
    return api.get(`/api/coupons/${id}`)
  },
  
  getByCode: (code) => {
    return api.get(`/api/coupons/code/${code}`)
  },
  
  validate: (code, amount = null) => {
    return api.post('/api/coupons/validate', { code, amount })
  },
  
  create: (data) => {
    return api.post('/api/coupons', data)
  },
  
  update: (id, data) => {
    return api.put(`/api/coupons/${id}`, data)
  },
  
  delete: (id) => {
    return api.delete(`/api/coupons/${id}`)
  },
  
  toggleStatus: (id) => {
    return api.patch(`/api/coupons/${id}/toggle-status`)
  },
  
  apply: (code) => {
    return api.post('/api/coupons/apply', { code })
  },
  
  getStats: () => {
    return api.get('/api/coupons/stats')
  },
}

export const websiteService = {
  getAll: (params = {}) => {
    return api.get('/api/websites', { params })
  },
  
  getById: (id) => {
    return api.get(`/api/websites/${id}`)
  },
  
  create: (data) => {
    return api.post('/api/websites', data)
  },
  
  update: (id, data) => {
    return api.put(`/api/websites/${id}`, data)
  },
  
  delete: (id) => {
    return api.delete(`/api/websites/${id}`)
  },
}

export const userService = {
  getAll: (params = {}) => {
    return api.get('/api/users', { params })
  },
  
  getById: (id) => {
    return api.get(`/api/users/${id}`)
  },
  
  create: (data) => {
    return api.post('/api/users', data)
  },
  
  update: (id, data) => {
    return api.put(`/api/users/${id}`, data)
  },
  
  delete: (id) => {
    return api.delete(`/api/users/${id}`)
  },
  
  assignWebsites: (id, websiteIds) => {
    return api.post(`/api/users/${id}/websites`, { websiteIds })
  },
  
  assignCoupons: (id, couponIds) => {
    return api.post(`/api/users/${id}/coupons`, { couponIds })
  },
  
  getUserWebsites: (id) => {
    return api.get(`/api/users/${id}/websites`)
  },
  
  getUserCoupons: (id) => {
    return api.get(`/api/users/${id}/coupons`)
  },
  
  getUserCouponStatistics: () => {
    return api.get('/api/users/statistics/coupon-usage')
  },
}

export default api

