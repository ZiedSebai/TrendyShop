// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(query: any) {
    const { category, sort, page = 1, limit = 12 } = query;
    const filter = category ? { category } : {};
    const sortOptions: any = {
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      name: { name: 1 },
    };

    const products = await this.productModel
      .find(filter)
      .sort(sortOptions[sort] || {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async search(q: string) {
    const results = await this.productModel.find({
      name: { $regex: q, $options: 'i' },
    });
    return {
      results,
      count: results.length,
    };
  }
}