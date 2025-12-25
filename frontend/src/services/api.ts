import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Users API
export const usersAPI = {
  updateLocation: (data: { latitude: number; longitude: number }) =>
    api.put('/users/location', data),
  updateAvailability: (data: { isAvailable: boolean }) =>
    api.put('/users/availability', data),
  getStats: () =>
    api.get('/users/stats'),
};

// Missions API
export const missionsAPI = {
  create: (data: any) =>
    api.post('/missions', data),
  getById: (id: string) =>
    api.get(`/missions/${id}`),
  getNearby: (params?: { latitude?: number; longitude?: number; radius?: number }) =>
    api.get('/missions/nearby', { params }),
  getMyMissions: (params?: { role?: string; status?: string }) =>
    api.get('/missions/my-missions', { params }),
  accept: (id: string) =>
    api.post(`/missions/${id}/accept`),
  updateStatus: (id: string, data: { status: string }) =>
    api.put(`/missions/${id}/status`, data),
  sendMessage: (id: string, data: { content: string }) =>
    api.post(`/missions/${id}/messages`, data),
  getMessages: (id: string) =>
    api.get(`/missions/${id}/messages`),
};

// Payments API
export const paymentsAPI = {
  createIntent: (data: { missionId: string; amount: number }) =>
    api.post('/payments/create-intent', data),
  confirm: (data: { paymentIntentId: string; missionId: string }) =>
    api.post('/payments/confirm', data),
  getByMission: (missionId: string) =>
    api.get(`/payments/mission/${missionId}`),
  getEarnings: () =>
    api.get('/payments/earnings'),
};

// Ratings API
export const ratingsAPI = {
  create: (data: { missionId: string; rating: number; comment?: string }) =>
    api.post('/ratings', data),
  getByProvider: (providerId: string) =>
    api.get(`/ratings/provider/${providerId}`),
  getByMission: (missionId: string) =>
    api.get(`/ratings/mission/${missionId}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard'),
  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/users', { params }),
  getMissions: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/missions', { params }),
  getPayments: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/payments', { params }),
  blockUser: (userId: string, data: { isBlocked: boolean }) =>
    api.put(`/admin/users/${userId}/block`, data),
  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`),
};

export default api;
