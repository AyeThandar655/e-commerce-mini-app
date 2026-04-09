import api from './api';
import type { Product, ProductsResponse } from '@/types/product';

interface GetProductsParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
}

export const productService = {
  async getProducts(params: GetProductsParams): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<{ categories: string[] }>('/products/categories');
    return response.data.categories;
  },
};
