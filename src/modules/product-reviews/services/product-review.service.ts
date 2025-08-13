import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductReviewReviewRepository } from '../repository/product-review.repository'
import { CreateProductReviewDto } from '../api/dto/request/create-product-review.dto'
import { UpdateProductReviewDto } from '../api/dto/request/update-product-review.dto'
import { ProductReview } from 'src/database'
import { CategoryRepository } from '/categories/repository/category.repository'

@Injectable()
export class ProductReviewService {
  constructor(
    private readonly productReviewRepo: ProductReviewReviewRepository,

    ) {}

  async createProductReview(productData: CreateProductReviewDto): Promise<ProductReview | ProductReview[]> {
    productData.product = { id: productData.productId } as any
    return this.productReviewRepo.create(productData as any)
  }

  async getByProductId(productId: string): Promise<ProductReview[]> {
    return this.productReviewRepo.getOneBy({
      product: {
        id: productId,
      },
    },)
  }

  async updateProductReview(id: string, updateData: UpdateProductReviewDto): Promise<ProductReview> {
    return await this.productReviewRepo.update(id, updateData as any)
  }

  async getProductRatingStats(productId: string) {
    return this.productReviewRepo.calculateProductRatingStats(productId)
  }

  async deleteProductReview(id: string): Promise<void> {
   await this.productReviewRepo.delete(id)
  }
}