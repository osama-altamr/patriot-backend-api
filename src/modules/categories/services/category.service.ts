import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoryRepository } from '../repository/category.repository' // Adjust path
import { CreateCategoryDto } from '../api/dto/request/create-category.dto'
import { UpdateCategoryDto } from '../api/dto/request/update-category.dto'
import { Category } from 'src/database' // Adjust path
import { Pagination, QueryValue } from '@Package/api'
import { GetAllCategoriesDto } from '../api/dto/request/get-all.dto'

@Injectable()
export class CategoryService {
  constructor(
      private readonly categoryRepo: CategoryRepository,
    ) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category| Category[]> {
    return this.categoryRepo.create(categoryData as any)
  }

  async getAllCategories(query: QueryValue<GetAllCategoriesDto>, pagination: Pagination){
    return this.categoryRepo.getAllCategories(query, pagination)
  }

  async getCategory(id: string): Promise<Category | null> {
    const category = await this.categoryRepo.findOneById(id)
    if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`)
    }
    return category
  }

  async updateCategory(id: string, updateData: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryRepo.update(id, updateData as any)
    if (!updatedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found for update`)
    }
    return updatedCategory
  }

  async deleteCategory(id: string): Promise<void> {
   await this.categoryRepo.delete(id)
  }
}