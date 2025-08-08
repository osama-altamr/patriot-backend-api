import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Stage } from '../../../database';

@Injectable()
export class StageRepository extends BaseRepository<Stage> {
  constructor(
    @InjectRepository(Stage)
    repository: Repository<Stage>,
  ) {
    super(repository);
  }


  async getAllStages(search?: string) {
    const queryBuilder = this.repository.createQueryBuilder('stage');

    if (search) {
      const searchTerm = `%${search}%`;
      queryBuilder.where(
        `(LOWER(stage.name->>'en') LIKE LOWER(:search) OR LOWER(stage.name->>'ar') LIKE LOWER(:search))`,
        { search: searchTerm }
      );
    }
    const [data, total] = await queryBuilder.getManyAndCount();

    return { results: data, total };
  }
}
