import { Module } from '@nestjs/common';
import { ProductReviewService } from './services/product-review.service';
import { ProductReviewController } from './api/controllers/prodcut-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from 'src/database';
import { ProductReviewReviewRepository } from './repository/product-review.repository';
import { UserModule } from '/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview]), UserModule],
  providers: [ProductReviewService, ProductReviewReviewRepository],
  controllers: [ProductReviewController],
  exports: [ProductReviewService, ProductReviewReviewRepository],
})
export class ProductReviewModule {}