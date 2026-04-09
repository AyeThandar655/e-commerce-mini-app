import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../common/types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Product>> {
    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      }),
      this.prismaService.product.count(),
    ]);

    return {
      data: products,
      total,
      page,
      pageSize,
      hasMore: skip + pageSize < total,
    };
  }

  async findById(id: number): Promise<Product | null> {
    return await this.prismaService.product.findUnique({
      where: { id },
    });
  }
}
