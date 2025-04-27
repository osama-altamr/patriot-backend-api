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
}
