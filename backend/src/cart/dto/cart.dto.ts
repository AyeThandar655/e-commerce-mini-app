import { Product } from '../../common/types';

export interface CartItemDto {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  createdAt: Date;
  updatedAt: Date;
  totalItems: number;
  totalPrice: number;
}
