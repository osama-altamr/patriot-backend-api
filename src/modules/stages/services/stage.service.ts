import { Injectable } from '@nestjs/common';
import { StageRepository } from '/stages/repository/stage.repository';
import { IStage, Stage } from 'src/database';

@Injectable()
export class StageService {
  constructor(private readonly stageRepo: StageRepository) {}

  createStage(stage: IStage) {
    return this.stageRepo.create(stage as any)
  }

  async getAllStages(searchTerm?: string) {
    return this.stageRepo.getAllStages(searchTerm);
  }

  async getStage(id: string) {
    return this.stageRepo.findOneById(id);

  }

  async updateStage(id: string, stageData: object): Promise<Stage> {
    return await this.stageRepo.update(id, stageData as any)
  }

  async deleteStage(id: string): Promise<void> {
    this.stageRepo.delete(id)
  }
}
