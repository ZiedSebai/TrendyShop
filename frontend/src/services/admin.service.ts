import { apiClient } from '@/lib/api';
const API_BASE_URL = 'http://localhost:3000';

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface AdminProductsResponse {
  products: AdminProduct[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<AdminProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiClient(`/api/admin/products${query ? `?${query}` : ''}`);
  },

  async getProductById(id: string): Promise<AdminProduct> {
    return apiClient(`/api/admin/products/${id}`);
  },

  async createProduct(formData: FormData): Promise<{ message: string; product: AdminProduct }> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  },

  async updateProduct(
    id: string,
    formData: FormData
  ): Promise<{ message: string; product: AdminProduct }> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiClient(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },
};
