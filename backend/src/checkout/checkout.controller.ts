import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
    return this.checkoutService.createPaymentIntent(body.amount, body.currency);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    return this.checkoutService.confirmPayment(id);
  }
}
