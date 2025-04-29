import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './api/controllers/prodcut.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database';
import { ProductRepository } from './repository/product.repository';
import { CategoryModule } from '/categories/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}