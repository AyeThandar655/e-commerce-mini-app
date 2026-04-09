import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductListQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  pageSize: number = 10;
}
