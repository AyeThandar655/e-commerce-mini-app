import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartDto } from './dto/cart.dto';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: RequestWithUser): Promise<CartDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.cartService.getCart(req.user.id);
  }

  @Post('items')
  async addToCart(
    @Req() req: RequestWithUser,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.cartService.addToCart(
      req.user.id,
      addToCartDto.productId,
      addToCartDto.quantity,
    );
  }

  @Patch('items/:cartItemId')
  async updateCartItem(
    @Req() req: RequestWithUser,
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.cartService.updateCartItem(
      req.user.id,
      Number(cartItemId),
      updateCartItemDto.quantity,
    );
  }

  @Delete('items/:cartItemId')
  async removeFromCart(
    @Req() req: RequestWithUser,
    @Param('cartItemId') cartItemId: string,
  ): Promise<CartDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.cartService.removeFromCart(
      req.user.id,
      Number(cartItemId),
    );
  }
}
