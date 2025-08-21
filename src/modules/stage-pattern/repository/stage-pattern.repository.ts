import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, StagePattern } from 'src/database'; // Adjust path

@Injectable()
export class StagePatternRepository extends BaseRepository<StagePattern> {
  constructor(
    @InjectRepository(StagePattern)
    repository: Repository<StagePattern>,
  ) {
    super(repository);
  }

  async findOneByIdWithPop(id: string): Promise<StagePattern | null> {
    return this.repository.findOne({ where: { id }, relations: ['stage'] });
  }

  async getAllPatterns(stageId?: string): Promise<{ results: StagePattern[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('stagePattern')
        .leftJoinAndSelect('stagePattern.stage', 'stage');

    if (stageId) {
      queryBuilder.where('stage.id = :stageId', { stageId });
    }
  
    const [data, total] = await queryBuilder.getManyAndCount();

    return { results: data, total }; 
  }
}