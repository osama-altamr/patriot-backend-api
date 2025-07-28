import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, State } from '../../../database';

@Injectable()
export class StateRepository extends BaseRepository<State> {
  constructor(
    @InjectRepository(State)
    repository: Repository<State>,
  ) {
    super(repository);
  }
}