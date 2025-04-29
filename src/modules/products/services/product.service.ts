import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '../repository/product.repository'
import { CreateProductDto } from '../api/dto/request/create-product.dto'
import { UpdateProductDto } from '../api/dto/request/update-product.dto'
import { Product } from 'src/database'
import { CategoryRepository } from '/categories/repository/category.repository'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,

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
    return this.productRepo.findAll()
  }

  async getProduct(id: string): Promise<Product | null> {
    const product = await this.productRepo.findOneById(id)
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`)
    }
    return product
  }

  async updateProduct(id: string, updateData: UpdateProductDto): Promise<Product> {
    return await this.productRepo.update(id, updateData as any)
  }

  async deleteProduct(id: string): Promise<void> {
   await this.productRepo.delete(id)
  }
}