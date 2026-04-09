import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from '../src/products/products.service';
import { ProductsRepository } from '../src/products/products.repository';

describe('ProductsService', () => {
  let service: ProductsService;

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

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockResult = {
        data: [mockProduct],
        total: 1,
        page: 1,
        pageSize: 10,
        hasMore: false,
      };

      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getProducts(1, 10);

      expect(result).toEqual(mockResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle multiple pages', async () => {
      const mockResult = {
        data: Array(10).fill(mockProduct),
        total: 25,
        page: 1,
        pageSize: 10,
        hasMore: true,
      };

      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getProducts(1, 10);

      expect(result.hasMore).toBe(true);
      expect(result.data.length).toBe(10);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getProductById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
