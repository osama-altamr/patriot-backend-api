import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './api/controllers/prodcut.controller';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}