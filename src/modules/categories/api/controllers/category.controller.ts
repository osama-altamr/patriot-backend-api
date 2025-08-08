import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { CategoryService } from "../../services/category.service"; // Adjust path
import { CreateCategoryDto } from "../dto/request/create-category.dto";
import { UpdateCategoryDto } from "../dto/request/update-category.dto";
import { Category } from "src/database"; // Adjust path
import { CreateCategoryValidation } from "../validation/create-category.pipe";
import { UpdateCategoryValidation } from "../validation/update-category.pipe";

@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body(CreateCategoryValidation) categoryData: CreateCategoryDto): Promise<Category | Category[]> {
        return await this.categoryService.createCategory(categoryData);
    }

    @Get()
    async getAll(@Query('search') search?: string) {
       return await this.categoryService.getAllCategories(search);
    }

    
    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Category> {
        return await this.categoryService.getCategory(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateCategoryValidation) updateData: UpdateCategoryDto
    ): Promise<Category> {
        return await this.categoryService.updateCategory(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategory(@Param('id') idParam: string): Promise<void> {
     await this.categoryService.deleteCategory(idParam);
    }
}