import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './api/controllers/prodcut.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}