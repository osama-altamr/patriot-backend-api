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
  
  async getAllStates(search?: string) {
    const queryBuilder = this.repository.createQueryBuilder('state');

    if (search) {
      const searchTerm = `%${search}%`;
      queryBuilder.where(
        `(LOWER(state.name->>'en') LIKE LOWER(:search) OR LOWER(state.name->>'ar') LIKE LOWER(:search))`,
        { search: searchTerm }
      );
    }
    const [data, total] = await queryBuilder.getManyAndCount();

    return { results: data, total };
  }

}