import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "/products/services/product.service";

@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService){}
}