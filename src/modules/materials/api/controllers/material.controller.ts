import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { MaterialService } from "/materials/services/material.service";
import { CreateMaterialDto } from "../dto/request/create-material.dto";
import { CreateMaterialValidation } from "../validation/create-material.pipe";
import { Material } from "src/database";
import { UpdateMaterialDto } from "../dto/request/update-material.dto";
import { UpdateMaterialValidation } from "../validation/update-material.pipe";
import { GetAllMaterialsValidation } from "../validation/get-all.pipe";
import { GetAllMaterialsDto } from "../dto/request/get-all.dto";
import { parseQuery } from "@Package/api/functions";

@Controller("materials")
export class MaterialController {
    constructor(private readonly materialService: MaterialService){}
    @Post()
    
    async create(
        @Body(CreateMaterialValidation) data: CreateMaterialDto
    ){
        console.log(data)
       return await this.materialService.create(data)
    }
        @Get()
        async getAll(@Query(GetAllMaterialsValidation) query: GetAllMaterialsDto) {
            const {pagination, myQuery} = parseQuery(query)
            return await this.materialService.getAllMaterials(myQuery, pagination);
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