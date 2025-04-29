import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '../repository/product.repository'
import { CreateProductDto } from '../api/dto/request/create-product.dto'
import { UpdateProductDto } from '../api/dto/request/update-product.dto'
import { Product } from 'src/database'

@Injectable()
export class ProductService {
  constructor(
      private readonly productRepo: ProductRepository,
    ) {}

  async createProduct(productData: CreateProductDto): Promise<Product | Product[]> {
    return this.productRepo.create(productData)
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