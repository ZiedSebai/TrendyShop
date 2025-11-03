import { apiClient } from '@/lib/api';

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    return apiClient('/api/cart');
  },

  async addItem(data: {
    productId: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }): Promise<{ message: string; item: CartItem }> {
    return apiClient('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateItem(
    itemId: string,
    data: { quantity: number }
  ): Promise<{ message: string; item: CartItem }> {
    return apiClient(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async removeItem(itemId: string): Promise<{ message: string }> {
    return apiClient(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clearCart(): Promise<{ message: string }> {
    return apiClient('/api/cart', {
      method: 'DELETE',
    });
  },
};
