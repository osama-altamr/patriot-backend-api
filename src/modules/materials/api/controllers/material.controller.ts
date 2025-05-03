import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { MaterialService } from "/materials/services/material.service";
import { CreateMaterialDto } from "../dto/request/create-material.dto";
import { CreateMaterialValidation } from "../validation/create-material.pipe";
import { Material } from "src/database";
import { UpdateMaterialDto } from "../dto/request/update-material.dto";
import { UpdateMaterialValidation } from "../validation/update-material.pipe";

@Controller("materials")
export class MaterialController {
    constructor(private readonly materialService: MaterialService){}
    @Post()
    async create(
        @Body(CreateMaterialValidation) data: CreateMaterialDto
    ){
       return await this.materialService.create(data)
    }
        @Get()
        async getAll(): Promise<Material[]> {
            return await this.materialService.getAllMaterials();
        }
    
        @Get(':id')
        async getOne(@Param('id') idParam: string): Promise<Material> {
            return await this.materialService.getMaterial(idParam);
        }
    
        @Patch(':id')
        async update(
            @Param('id') idParam: string,
            @Body(UpdateMaterialValidation) updateData: UpdateMaterialDto
        ): Promise<Material> {
            return await this.materialService.updateMaterial(idParam, updateData);
        }
    
        @Delete(':id')
        @HttpCode(HttpStatus.NO_CONTENT)
        async deleteMaterial(@Param('id') idParam: string): Promise<void> {
         await this.materialService.deleteMaterial(idParam);
        }
}