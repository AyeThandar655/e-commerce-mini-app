import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, Product } from '../common/types';

interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

@Injectable()
export class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getCartByUserId(userId: number): Promise<CartWithItems | null> {
    return await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItemToCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItemWithProduct> {
    const existingItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      include: { product: true },
    });

    if (existingItem) {
      return await this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    }

    return await this.prismaService.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: { product: true },
    });
  }

  async updateCartItem(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItemWithProduct> {
    return await this.prismaService.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeCartItem(cartItemId: number): Promise<void> {
    await this.prismaService.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async getCartItem(cartItemId: number): Promise<CartItemWithProduct | null> {
    return await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });
  }
}
