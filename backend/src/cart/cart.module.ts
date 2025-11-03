// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CartItem.name, schema: CartItemSchema }])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}