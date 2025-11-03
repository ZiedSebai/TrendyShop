// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>) {}

  async getCart(userId: string) {
    const items = await this.cartModel.find({ userId });
    const subtotal = items.reduce((sum, item) => sum + item.quantity * 189, 0); // Replace 189 with actual product price lookup
    return {
      items,
      subtotal,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addItem(userId: string, dto: any) {
    const item = await this.cartModel.create({ userId, ...dto });
    return { message: 'Item added to cart', item };
  }

  async updateItem(userId: string, itemId: string, dto: any) {
    const item = await this.cartModel.findOneAndUpdate(
      { _id: itemId, userId },
      { $set: dto },
      { new: true }
    );
    if (!item) throw new NotFoundException('Item not found');
    return { message: 'Cart item updated', item };
  }

  async removeItem(userId: string, itemId: string) {
    await this.cartModel.deleteOne({ _id: itemId, userId });
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.cartModel.deleteMany({ userId });
    return { message: 'Cart cleared' };
  }
}