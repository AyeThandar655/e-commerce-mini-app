import api from './api';
import type { Cart } from '@/types/cart';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  async addItem(productId: number, quantity: number): Promise<Cart> {
    const response = await api.post<Cart>('/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  async updateItem(cartItemId: number, quantity: number): Promise<Cart> {
    const response = await api.patch<Cart>(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  async removeItem(cartItemId: number): Promise<Cart> {
    const response = await api.delete<Cart>(`/cart/items/${cartItemId}`);
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
