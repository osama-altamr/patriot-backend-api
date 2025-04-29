import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ProductService } from "../../services/product.service"; 
import { CreateProductDto } from "../dto/request/create-product.dto";
import { UpdateProductDto } from "../dto/request/update-product.dto";
import { Product } from "src/database"; 
import { CreateProductValidation } from "../validation/create-product.pipe";
import { UpdateProductValidation } from "../validation/update-product.pipe";

@Controller("products") 
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async createProduct(@Body(CreateProductValidation) productData: CreateProductDto): Promise<Product| Product[]> {
        return await this.productService.createProduct(productData);
    }

    @Get()
    async getAll(): Promise<Product[]> {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Product> {
        return await this.productService.getProduct(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateProductValidation) updateData: UpdateProductDto
    ): Promise<Product> {
        return await this.productService.updateProduct(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(@Param('id') idParam: string): Promise<void> {
        await this.productService.deleteProduct(idParam);
    }
}