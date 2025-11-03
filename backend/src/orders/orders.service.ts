// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async createOrder(userId: string, dto: any) {
    const total = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await this.orderModel.create({
      userId,
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      total,
      items: dto.items,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
    });
    return {
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderModel.find({ userId });
    return orders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt,
    }));
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, userId });
    if (!order) throw new NotFoundException('Order not found');
    return {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: 'Classic Tailored Blazer', // Replace with actual product lookup if needed
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      })),
      subtotal: order.total,
      shipping: 10,
      total: order.total + 10,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}