import { Injectable, NotFoundException } from '@nestjs/common';
import { StagePatternRepository } from '../repository/stage-pattern.repository';
import { CreateStagePatternDto } from '../api/dto/request/create-stage-pattern.dto';
import { UpdateStagePatternDto } from '../api/dto/request/update-stage-pattern.dto';
import { StagePattern } from 'src/database';
import { StageService } from 'src/modules/stages/services/stage.service'; // Assuming path to StageService

@Injectable()
export class StagePatternService {
  constructor(
    private readonly patternRepo: StagePatternRepository,
    private readonly stageService: StageService, // Inject StageService to find the parent stage
  ) {}

  async createPattern(patternData: CreateStagePatternDto): Promise<StagePattern> {
    const stage = await this.stageService.getStage(patternData.stageId);
    if (!stage) {
      throw new NotFoundException(`Stage with ID ${patternData.stageId} not found.`);
    }
    patternData.stage = stage
    return await this.patternRepo.create(patternData as any) as StagePattern
  }

  async getAllPatterns(stageId?: string): Promise<{ results: StagePattern[]; total: number }> {
    return  await this.patternRepo.getAllPatterns(stageId);
  }

  async getPattern(id: string): Promise<StagePattern> {
    const pattern = await this.patternRepo.findOneByIdWithPop(id);
    if (!pattern) {
        throw new NotFoundException(`StagePattern with ID ${id} not found`);
    }
    return pattern;
  }

  async updatePattern(id: string, updateData: UpdateStagePatternDto): Promise<StagePattern> {
    await this.getPattern(id);
    return await this.patternRepo.update(id, updateData as any);
  }

  async deletePattern(id: string): Promise<void> {
    await this.patternRepo.delete(id);
  }
}