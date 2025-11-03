// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Req() req, @Body() body: any) {
    return this.ordersService.createOrder(req.user.userId, body);
  }

  @Get()
  getUserOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @Get(':orderId')
  getOrderById(@Req() req, @Param('orderId') orderId: string) {
    return this.ordersService.getOrderById(req.user.userId, orderId);
  }
}