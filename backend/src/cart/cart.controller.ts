// src/cart/cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Req() req, @Body() body: any) {
    return this.cartService.addItem(req.user.userId, body);
  }

  @Put('items/:itemId')
  updateItem(@Req() req, @Param('itemId') itemId: string, @Body() body: any) {
    return this.cartService.updateItem(req.user.userId, itemId, body);
  }

  @Delete('items/:itemId')
  removeItem(@Req() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}