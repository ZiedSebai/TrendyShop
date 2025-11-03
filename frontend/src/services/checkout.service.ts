import { apiClient } from '@/lib/api';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
}

export const checkoutService = {
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntentResponse> {
    return apiClient('/api/checkout/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  },

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentStatusResponse> {
    return apiClient(`/api/checkout/payment-intent/${paymentIntentId}`);
  },
};
