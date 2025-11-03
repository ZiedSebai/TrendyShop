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

const transformProduct = (product: any): Product => ({
  id: product._id || product.id,
  name: product.name,
  price: product.price,
  description: product.description,
  category: product.category,
  images: product.images || [],
  sizes: product.sizes || [],
  colors: product.colors || [],
  inStock: product.inStock,
});

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
    const response = await apiClient(`/api/products${query ? `?${query}` : ''}`);
    return {
      ...response,
      products: response.products.map(transformProduct),
    };
  },

  async getById(id: string): Promise<Product> {
    const product = await apiClient(`/api/products/${id}`);
    return transformProduct(product);
  },

  async search(query: string): Promise<SearchResponse> {
    const response = await apiClient(`/api/products/search?q=${encodeURIComponent(query)}`);
    return {
      ...response,
      results: response.results.map(transformProduct),
    };
  },
};
