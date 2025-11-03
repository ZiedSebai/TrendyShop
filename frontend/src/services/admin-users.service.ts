import { apiClient } from '@/lib/api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminUsersService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminUsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiClient(`/api/admin/users${query ? `?${query}` : ''}`);
  },

  async getUserById(id: string): Promise<AdminUser> {
    return apiClient(`/api/admin/users/${id}`);
  },

  async toggleAdminStatus(
    id: string,
    isAdmin: boolean
  ): Promise<{ message: string; user: AdminUser }> {
    return apiClient(`/api/admin/users/${id}/admin`, {
      method: 'PUT',
      body: JSON.stringify({ isAdmin }),
    });
  },
};
