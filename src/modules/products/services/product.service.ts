import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '../repository/product.repository'
import { CreateProductDto } from '../api/dto/request/create-product.dto'
import { UpdateProductDto } from '../api/dto/request/update-product.dto'
import { Product } from 'src/database'
import { CategoryRepository } from '/categories/repository/category.repository'
import { ProductReviewService } from '/product-reviews/services/product-review.service'
import { StageRepository } from '/stages/repository/stage.repository'
import { In } from 'typeorm'
import { NotificationService } from '/notifications/services/notification.service'
import { UserRepository } from '/users/repository/user.repository'
import { UserRole } from '/users/api/enums/user.enum'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly productReviewService: ProductReviewService,
    private readonly StageRepo: StageRepository,
    private readonly notificationService: NotificationService,
    private readonly userRepo: UserRepository,
    ) {}

  async createProduct(productData: CreateProductDto): Promise<Product | Product[]> {
    const product =  new Product()
    product.name = productData.name
    product.description = productData.description
    product.height = productData.height
    product.imageUrl = productData.imageUrl
    product.width = productData.width
    product.pricePerSquareMeter = productData.pricePerSquareMeter
    product.category = await this.categoryRepo.findOneById(productData.categoryId)
    product.stages = await this.StageRepo.findBy({
      id: In( productData.stageIds)
    })

    Logger.debug({ st: product.stages })
    const savedProduct = await this.productRepo.create(product) as Product
    const users = await this.userRepo.findBy({
      role: UserRole.user
    })

    if(users && users.length > 0) {
      await Promise.all(users.map(async user => {
        await this.notificationService.createNotification({
          title: {
            en: 'New Product Available!',
            ar: 'منتج جديد متوفر!'
        },
        content: {
            en: `Check out the new product: ${product.name.en}`,
            ar: `تفقد المنتج الجديد: ${product.name.ar}`
        },
              type: 'product',
              recordId: savedProduct.id,
              userId: user.id,
        })
      }))
    }
    return savedProduct
  }

  async getAllProducts(categoryId: string): Promise<Product[]> {
    const products = await this.productRepo.findAllWithPop(categoryId)
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
    const product = await this.productRepo.findOneByIdWithPop(id)
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`)
    }
    const productStats = await this.productReviewService.getProductRatingStats(id)
    product.ratingsQuantity =productStats.ratingsQuantity
    product.ratingsAverage = productStats.ratingsAverage
    return product
  }

  async updateProduct(id: string, updateData: UpdateProductDto): Promise<Product> {
    let stageIds 
    let categoryId
    if(updateData.stageIds){
      stageIds = updateData.stageIds
     delete updateData.stageIds
    }

    if(updateData.categoryId){
      categoryId = updateData.categoryId
      delete updateData.categoryId
    }

   return await this.productRepo.update(id, updateData as any)
  }

  async deleteProduct(id: string): Promise<void> {
   await this.productRepo.delete(id)
  }
}