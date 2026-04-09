/**
 * Shared entity interfaces matching the Prisma schema.
 *
 * These decouple application code from the generated Prisma client so that
 * TypeScript can type-check even before `prisma generate` has been run.
 */

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: number;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
