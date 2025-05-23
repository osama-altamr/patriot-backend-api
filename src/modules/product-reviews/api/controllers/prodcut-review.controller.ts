import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ProductReviewService } from "../../services/product-review.service"; 
import { CreateProductReviewDto } from "../dto/request/create-product-review.dto";
import { UpdateProductReviewDto } from "../dto/request/update-product-review.dto";
import { ProductReview, User } from "src/database"; 
import { CreateProductReviewValidation } from "../validation/create-product-review.pipe";
import { UpdateProductValidation } from "../validation/update-product-review.pipe";
import { CurrentUser } from "@Package/api";
import { JwtAuthGuard } from "@Package/auth";
import { UserService } from "/users/services/user.service";

@Controller("product-reviews") 
export class ProductReviewController {
    constructor(
        private readonly productReviewService: ProductReviewService,
        private readonly userService: UserService,

    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProductReview(@CurrentUser() user: User, @Body(CreateProductReviewValidation) productData: CreateProductReviewDto): Promise<ProductReview| ProductReview[]> {
        productData.user = await this.userService.getMe(user.id)
        return await this.productReviewService.createProductReview(productData);
    }
    
    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateProductValidation) updateData: UpdateProductReviewDto
    ): Promise<ProductReview> {
        return await this.productReviewService.updateProductReview(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(@Param('id') idParam: string): Promise<void> {
        await this.productReviewService.deleteProductReview(idParam);
    }
}