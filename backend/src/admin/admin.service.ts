import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'trendy-shop' },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload failed'));
        },
      ).end(file.buffer);
    });
  }

  async getDashboardStats() {
    const totalProducts = await this.productModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();
    const totalUsers = await this.userModel.countDocuments();

    const orders = await this.orderModel.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const completedOrders = await this.orderModel.countDocuments({ status: 'completed' });
    const inStockProducts = await this.productModel.countDocuments({ inStock: true });

    const recentOrders = await this.orderModel
      .find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.orderNumber,
      customer: order.userId ? (order.userId as any).name : 'Unknown',
      total: order.total,
      status: order.status,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt,
    }));

    return {
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        completedOrders,
        inStockProducts,
      },
      recentOrders: formattedRecentOrders,
    };
  }

  async getAllProducts(query: any) {
    const { page = 1, limit = 20, category, search } = query;
    const filter: any = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await this.productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await this.productModel.countDocuments(filter);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(data: any, imageUrls: string[]) {
    const product = await this.productModel.create({
      ...data,
      images: imageUrls,
      price: Number(data.price),
    });
    return { message: 'Product created successfully', product };
  }

  async updateProduct(id: string, data: any, imageUrls?: string[]) {
    const updateData: any = { ...data };
    if (data.price) updateData.price = Number(data.price);
    if (imageUrls && imageUrls.length > 0) {
      updateData.images = imageUrls;
    }

    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product updated successfully', product };
  }

  async deleteProduct(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }

  async getAllOrders(query: any) {
    const { page = 1, limit = 20, status, search } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const orders = await this.orderModel
      .find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await this.orderModel.countDocuments(filter);

    return {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string) {
    const order = await this.orderModel.findById(id).populate('userId', 'name email');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Order status updated successfully', order };
  }

  async getAllUsers(query: any) {
    const { page = 1, limit = 20, search } = query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await this.userModel
      .find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await this.userModel.countDocuments(filter);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleAdminStatus(id: string, isAdmin: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true }
    ).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User admin status updated successfully', user };
  }
}
