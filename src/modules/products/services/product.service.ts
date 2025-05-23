import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '../repository/product.repository'
import { CreateProductDto } from '../api/dto/request/create-product.dto'
import { UpdateProductDto } from '../api/dto/request/update-product.dto'
import { Product } from 'src/database'
import { CategoryRepository } from '/categories/repository/category.repository'
import { ProductReviewService } from '/product-reviews/services/product-review.service'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly productReviewService: ProductReviewService,
    ) {}

  async createProduct(productData: CreateProductDto): Promise<Product | Product[]> {
    const product =  new Product()
    product.name = productData.name
    product.description = productData.description
    product.height = productData.height
    product.imageUrl = productData.imageUrl
    product.width = productData.width
    product.category = await this.categoryRepo.findOneById(productData.categoryId)
    return this.productRepo.create(product)
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepo.findAll({})
    const updatedProducts = await Promise.all( products.map(async product => {
      const productStats = await this.productReviewService.getProductRatingStats(product.id)
      product.ratingsQuantity =productStats.ratingsQuantity
      product.ratingsAverage = productStats.ratingsAverage
      return product
    }))
    return updatedProducts
  }

  async getReviews(productId: string) {
    return await this.productReviewService.getByProductId(productId)
  }

  async getProduct(id: string): Promise<Product | null> {
    const product = await this.productRepo.findOneById(id)
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`)
    }
    const productStats = await this.productReviewService.getProductRatingStats(id)
    product.ratingsQuantity =productStats.ratingsQuantity
    product.ratingsAverage = productStats.ratingsAverage
    return product
  }

  async updateProduct(id: string, updateData: UpdateProductDto): Promise<Product> {
    return await this.productRepo.update(id, updateData as any)
  }

  async deleteProduct(id: string): Promise<void> {
   await this.productRepo.delete(id)
  }
}