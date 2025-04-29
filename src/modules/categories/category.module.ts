import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './api/controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/database';
import { CategoryRepository } from './repository/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}