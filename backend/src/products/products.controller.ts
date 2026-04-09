import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductListQueryDto } from './dto/product-list.dto';
import { Product } from '../common/types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() query: ProductListQueryDto,
  ): Promise<PaginatedResult<Product>> {
    return await this.productsService.getProducts(query.page, query.pageSize);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.getProductById(Number(id));
  }
}
