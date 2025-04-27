import { Injectable } from '@nestjs/common';
import { StageRepository } from '/stages/repository/stage.repository';

@Injectable()
export class StageService {
  constructor(private readonly stageRepo: StageRepository) {}
 
}
