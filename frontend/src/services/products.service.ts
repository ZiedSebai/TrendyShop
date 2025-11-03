import { apiClient } from '@/lib/api';
import { Product } from '@/types/product';

export interface ProductsResponse {
  products: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse {
  results: Product[];
  count: number;
}

export const productsService = {
  async getAll(params?: {
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient(`/api/products${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Product> {
    return apiClient(`/api/products/${id}`);
  },

  async search(query: string): Promise<SearchResponse> {
    return apiClient(`/api/products/search?q=${encodeURIComponent(query)}`);
  },
};
