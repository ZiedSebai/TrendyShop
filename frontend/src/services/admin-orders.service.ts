import { apiClient } from '@/lib/api';

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    selectedSize: string;
    selectedColor: string;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminOrdersService = {
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<AdminOrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiClient(`/api/admin/orders${query ? `?${query}` : ''}`);
  },

  async getOrderById(id: string): Promise<AdminOrder> {
    return apiClient(`/api/admin/orders/${id}`);
  },

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<{ message: string; order: AdminOrder }> {
    return apiClient(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
