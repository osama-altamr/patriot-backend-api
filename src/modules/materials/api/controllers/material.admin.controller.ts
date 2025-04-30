import { Body, Controller, Post } from "@nestjs/common";
import { MaterialService } from "/materials/services/material.service";
import { AuthControllerAdmin } from "@Package/api";
import { PostPolicy } from "@Package/api/decorators/auth-method.decorator";
import { UserRole } from "/users/api/enums/user.enum";
import { CreateMaterialDto } from "../dto/response/create-material.dto";
import { CreateMaterialValidation } from "../validation/material.pipe";

@AuthControllerAdmin({
    prefix: "materials"
})
export class MaterialController {
    constructor(private readonly materialService: MaterialService){}

    @PostPolicy({
        path: "",
        role: [UserRole.admin]
    })
    async create(
        @Body(CreateMaterialValidation) data: CreateMaterialDto
    ){
        console.log(data)
        await this.materialService.create(data)
    }
}