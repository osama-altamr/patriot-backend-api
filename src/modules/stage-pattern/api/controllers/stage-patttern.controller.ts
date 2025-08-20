import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { CreateStagePatternDto } from "../dto/request/create-stage-pattern.dto";
import { UpdateStagePatternDto } from "../dto/request/update-stage-pattern.dto";
import { StagePattern } from "src/database";
import { CreateStagePatternValidation } from "../validation/create-stage-pattern.pipe";
import { UpdateStagePatternValidation } from "../validation/update-stage-pattern.pipe";
import { JwtAuthGuard } from "@Package/auth";
import { StagePatternService } from "/stage-pattern/services/stage-pattern.service";

@Controller("stage-patterns")
@UseGuards(JwtAuthGuard)
export class StagePatternController {
    constructor(private readonly patternService: StagePatternService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPattern(@Body(CreateStagePatternValidation) patternData: CreateStagePatternDto): Promise<StagePattern> {
        return await this.patternService.createPattern(patternData);
    }

    @Get()
    async getAll(@Query('stageId') stageId?: string): Promise<{ results: StagePattern[]; total: number }> {
        return await this.patternService.getAllPatterns(stageId);
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<StagePattern> {
        return await this.patternService.getPattern(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(UpdateStagePatternValidation) updateData: UpdateStagePatternDto
    ): Promise<StagePattern> {
        return await this.patternService.updatePattern(id, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePattern(@Param('id') id: string): Promise<void> {
        await this.patternService.deletePattern(id);
    }
}