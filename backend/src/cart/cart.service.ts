import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async getCart(userId: number): Promise<CartDto> {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      totalItems,
      totalPrice,
    };
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<CartDto> {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Verify product exists and has sufficient stock
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${String(product.stock)}`,
      );
    }

    await this.cartRepository.addItemToCart(cart.id, productId, quantity);

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: number,
    cartItemId: number,
    quantity: number,
  ): Promise<CartDto> {
    // Verify cart belongs to user
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartRepository.getCartItem(cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.cartId !== cart.id) {
      throw new BadRequestException('Cart item does not belong to this cart');
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${String(cartItem.product.stock)}`,
      );
    }

    await this.cartRepository.updateCartItem(cartItemId, quantity);

    return this.getCart(userId);
  }

  async removeFromCart(userId: number, cartItemId: number): Promise<CartDto> {
    // Verify cart belongs to user
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartRepository.getCartItem(cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.cartId !== cart.id) {
      throw new BadRequestException('Cart item does not belong to this cart');
    }

    await this.cartRepository.removeCartItem(cartItemId);

    return this.getCart(userId);
  }
}
