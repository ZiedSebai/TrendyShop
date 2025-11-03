// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

// src/orders/schemas/order.schema.ts
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ required: true })
  total: number;

  @Prop({
    type: [
      {
        productId: String,
        quantity: Number,
        selectedSize: String,
        selectedColor: String,
        price: Number,
      },
    ],
  })
  items: any[];

  @Prop({
    type: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  })
  shippingAddress: any;

  @Prop()
  paymentMethod: string;

  // ✅ Add these two lines
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);