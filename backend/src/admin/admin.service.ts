import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'urban-threads' },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload failed'));
        },
      ).end(file.buffer);
    });
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
}
