import { apiClient, setAuthToken, removeAuthToken } from '@/lib/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.token);
    return response;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.token);
    return response;
  },

  async getMe(): Promise<User> {
    return apiClient('/api/auth/me');
  },

  async logout(): Promise<void> {
    await apiClient('/api/auth/logout', { method: 'POST' });
    removeAuthToken();
  },

  async adminLogin(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.token);
    return response;
  },
};
