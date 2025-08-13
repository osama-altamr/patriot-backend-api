import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { StageService } from "/stages/services/stage.service";
import { CreateStageDto } from "../dto/request/create-stage.dto";
import { CreateStageValidation } from "../validation/create-stage.pipe";
import { UpdateStageValidation } from "../validation/update-stage.pipe";
import { UpdateStageDto } from "../dto/request/update-stage.dto";

@Controller("stages")
export class StageController {
    constructor(private readonly stageService: StageService){}
       @Post()
        async createStage(@Body(CreateStageValidation) stageData: CreateStageDto){
            return await this.stageService.createStage(stageData)
        }
    
        @Get()
        async getAll(@Query('search') searchTerm?: string){
        return await this.stageService.getAllStages(searchTerm)
        }
    
        @Get(':id')
        async getOne(@Param('id') idParam: string){
            return await this.stageService.getStage(idParam)
        }
        
        @Patch(':id')
        async update(@Param('id') idParam: string, @Body(UpdateStageValidation) updateData: UpdateStageDto){
            return await this.stageService.updateStage(idParam, updateData)
        }
    
        @Delete(':id')
        async deleteStage(@Param('id') idParam: string){
            return await this.stageService.deleteStage(idParam)
        }
}