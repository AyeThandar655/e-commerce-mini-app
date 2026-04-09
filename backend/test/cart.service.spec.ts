import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from '../src/cart/cart.service';
import { CartRepository } from '../src/cart/cart.repository';
import { PrismaService } from '../src/prisma/prisma.service';

describe('CartService', () => {
  let service: CartService;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 50,
    category: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCartItem = {
    id: 1,
    cartId: 1,
    productId: 1,
    quantity: 2,
    product: mockProduct,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCart = {
    id: 1,
    userId: 1,
    items: [mockCartItem],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    getCartByUserId: jest.fn(),
    addItemToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
    getCartItem: jest.fn(),
  };

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartRepository,
          useValue: mockRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart with calculated totals', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);

      const result = await service.getCart(1);

      expect(result.id).toBe(1);
      expect(result.totalItems).toBe(2);
      expect(result.totalPrice).toBe(59.98); // 29.99 * 2
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(null);

      await expect(service.getCart(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToCart', () => {
    it('should successfully add item to cart', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockRepository.addItemToCart.mockResolvedValue(mockCartItem);

      const result = await service.addToCart(1, 1, 1);

      expect(result.id).toBe(1);
      expect(mockRepository.addItemToCart).toHaveBeenCalledWith(1, 1, 1);
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(null);

      await expect(service.addToCart(1, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.addToCart(1, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const lowStockProduct = { ...mockProduct, stock: 0 };
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockPrismaService.product.findUnique.mockResolvedValue(lowStockProduct);

      await expect(service.addToCart(1, 1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateCartItem', () => {
    it('should successfully update cart item quantity', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockRepository.getCartItem.mockResolvedValue(mockCartItem);
      mockRepository.updateCartItem.mockResolvedValue(mockCartItem);

      const result = await service.updateCartItem(1, 1, 5);

      expect(result.id).toBe(1);
      expect(mockRepository.updateCartItem).toHaveBeenCalledWith(1, 5);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockRepository.getCartItem.mockResolvedValue(null);

      await expect(service.updateCartItem(1, 1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const lowStockItem = {
        ...mockCartItem,
        product: { ...mockProduct, stock: 2 },
      };
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockRepository.getCartItem.mockResolvedValue(lowStockItem);

      await expect(service.updateCartItem(1, 1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeFromCart', () => {
    it('should successfully remove item from cart', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockRepository.getCartItem.mockResolvedValue(mockCartItem);
      mockRepository.removeCartItem.mockResolvedValue(undefined);

      const result = await service.removeFromCart(1, 1);

      expect(result.id).toBe(1);
      expect(mockRepository.removeCartItem).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      mockRepository.getCartByUserId.mockResolvedValue(mockCart);
      mockRepository.getCartItem.mockResolvedValue(null);

      await expect(service.removeFromCart(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
