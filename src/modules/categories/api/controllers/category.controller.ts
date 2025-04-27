import { Body, Controller, Post } from "@nestjs/common";
import { CategoryService } from "/categories/services/category.service";

@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService){}
}