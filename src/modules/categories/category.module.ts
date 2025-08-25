import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './api/controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, OrderItem } from 'src/database';
import { CategoryRepository } from './repository/category.repository';
import { OrdersModule } from '/orders/orders.module';
import { GetAllCategoriesValidation } from './api/validation/get-all.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Category, OrderItem]), forwardRef(() => OrdersModule)],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository,GetAllCategoriesValidation],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}