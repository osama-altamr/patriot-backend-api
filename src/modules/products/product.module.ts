import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './api/controllers/prodcut.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database';
import { ProductRepository } from './repository/product.repository';
import { CategoryModule } from '/categories/category.module';
import { ProductReviewModule } from '/product-reviews/product-review.module';
import { StageModule } from '/stages/stage.module';
import { UserModule } from '/users/user.module';
import { NotificationModule } from '/notifications/notification.module';
import { OrdersModule } from '/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), forwardRef(() => OrdersModule), CategoryModule, ProductReviewModule, StageModule,UserModule, NotificationModule],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}