import { apiClient } from '@/lib/api';

export interface OrderItem {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  total: number;
  itemCount?: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
}

export const ordersService = {
  async createOrder(data: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }): Promise<{ message: string; order: Order }> {
    return apiClient('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getUserOrders(): Promise<Order[]> {
    return apiClient('/api/orders');
  },

  async getOrderById(orderId: string): Promise<Order> {
    return apiClient(`/api/orders/${orderId}`);
  },
};
