import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { CheckoutModule } from './checkout/checkout.module';

let cached = globalThis.mongo; // cache across serverless calls
if (!cached) {
  cached = globalThis.mongo = { conn: null, promise: null };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        if (cached.conn) return cached.conn;

        if (!cached.promise) {
          cached.promise = MongooseModule.forRoot(config.get<string>('MONGO_URI') || '', {
            // options
            dbName: config.get<string>('MONGO_DB') || 'test',
          });
        }

        cached.conn = await cached.promise;
        return cached.conn;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    AdminModule,
    CheckoutModule,
  ],
})
export class AppModule {}
