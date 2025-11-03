import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('products')
  getAllProducts(@Query() query: any) {
    return this.adminService.getAllProducts(query);
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.adminService.getProductById(id);
  }

  @Post('products')
  @UseInterceptors(FilesInterceptor('images', 5))
  async createProduct(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.adminService.uploadImage(file);
        imageUrls.push(url);
      }
    }

    const productData = {
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      sizes: JSON.parse(body.sizes || '[]'),
      colors: JSON.parse(body.colors || '[]'),
      inStock: body.inStock === 'true',
    };

    return this.adminService.createProduct(productData, imageUrls);
  }

  @Put('products/:id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateProduct(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.adminService.uploadImage(file);
        imageUrls.push(url);
      }
    }

    const productData: any = {};
    if (body.name) productData.name = body.name;
    if (body.price) productData.price = body.price;
    if (body.description) productData.description = body.description;
    if (body.category) productData.category = body.category;
    if (body.sizes) productData.sizes = JSON.parse(body.sizes);
    if (body.colors) productData.colors = JSON.parse(body.colors);
    if (body.inStock !== undefined) productData.inStock = body.inStock === 'true';

    return this.adminService.updateProduct(id, productData, imageUrls.length > 0 ? imageUrls : undefined);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('orders')
  getAllOrders(@Query() query: any) {
    return this.adminService.getAllOrders(query);
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.adminService.getOrderById(id);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateOrderStatus(id, body.status);
  }

  @Get('users')
  getAllUsers(@Query() query: any) {
    return this.adminService.getAllUsers(query);
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/admin')
  toggleAdminStatus(@Param('id') id: string, @Body() body: { isAdmin: boolean }) {
    return this.adminService.toggleAdminStatus(id, body.isAdmin);
  }
}
