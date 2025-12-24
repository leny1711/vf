import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'CLIENT' | 'PROVIDER';
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Users
  async updateLocation(latitude: number, longitude: number) {
    const response = await this.client.put('/users/location', { latitude, longitude });
    return response.data;
  }

  async toggleAvailability(isAvailable: boolean) {
    const response = await this.client.put('/users/availability', { isAvailable });
    return response.data;
  }

  async getStats() {
    const response = await this.client.get('/users/stats');
    return response.data;
  }

  // Missions
  async createMission(data: {
    title: string;
    description: string;
    address: string;
    price: number;
    urgent?: boolean;
  }) {
    const response = await this.client.post('/missions', data);
    return response.data;
  }

  async getMissionById(id: string) {
    const response = await this.client.get(`/missions/${id}`);
    return response.data;
  }

  async getNearbyMissions(maxDistance?: number) {
    const response = await this.client.get('/missions/nearby', {
      params: { maxDistance },
    });
    return response.data;
  }

  async getMyMissions() {
    const response = await this.client.get('/missions/my-missions');
    return response.data;
  }

  async acceptMission(id: string) {
    const response = await this.client.post(`/missions/${id}/accept`);
    return response.data;
  }

  async updateMissionStatus(id: string, status: string) {
    const response = await this.client.put(`/missions/${id}/status`, { status });
    return response.data;
  }

  async sendMessage(missionId: string, receiverId: string, content: string) {
    const response = await this.client.post(`/missions/${missionId}/messages`, {
      receiverId,
      content,
    });
    return response.data;
  }

  async getMessages(missionId: string) {
    const response = await this.client.get(`/missions/${missionId}/messages`);
    return response.data;
  }

  // Payments
  async createPaymentIntent(missionId: string) {
    const response = await this.client.post('/payments/create-intent', { missionId });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string) {
    const response = await this.client.post('/payments/confirm', { paymentIntentId });
    return response.data;
  }

  async getPaymentByMission(missionId: string) {
    const response = await this.client.get(`/payments/mission/${missionId}`);
    return response.data;
  }

  async getProviderEarnings() {
    const response = await this.client.get('/payments/earnings');
    return response.data;
  }

  // Ratings
  async createRating(data: { missionId: string; score: number; comment?: string }) {
    const response = await this.client.post('/ratings', data);
    return response.data;
  }

  async getProviderRatings(providerId: string) {
    const response = await this.client.get(`/ratings/provider/${providerId}`);
    return response.data;
  }

  async getRatingByMission(missionId: string) {
    const response = await this.client.get(`/ratings/mission/${missionId}`);
    return response.data;
  }

  // Admin
  async getAdminDashboard() {
    const response = await this.client.get('/admin/dashboard');
    return response.data;
  }

  async getAllUsers(page?: number, limit?: number) {
    const response = await this.client.get('/admin/users', { params: { page, limit } });
    return response.data;
  }

  async getAllMissions(page?: number, limit?: number) {
    const response = await this.client.get('/admin/missions', { params: { page, limit } });
    return response.data;
  }

  async getAllPayments(page?: number, limit?: number) {
    const response = await this.client.get('/admin/payments', { params: { page, limit } });
    return response.data;
  }

  async blockUser(userId: string, isBlocked: boolean) {
    const response = await this.client.put(`/admin/users/${userId}/block`, { isBlocked });
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.client.delete(`/admin/users/${userId}`);
    return response.data;
  }
}

export default new ApiClient();
