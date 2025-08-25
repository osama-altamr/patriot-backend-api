import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, State } from '../../../database';
import { Pagination, QueryValue } from '@Package/api'
import { GetAllStatesDto } from '../api/dto/request/get-all.dto'

@Injectable()
export class StateRepository extends BaseRepository<State> {
  constructor(
    @InjectRepository(State)
    repository: Repository<State>,
  ) {
    super(repository);
  }
  
  async getAllStates(query: QueryValue<GetAllStatesDto>, pagination: Pagination) {
    const queryBuilder = this.repository.createQueryBuilder('state');

    if (query.search) {
      const searchTerm = `%${query.search}%`;
      queryBuilder.where(
        `(LOWER(state.name->>'en') LIKE LOWER(:search) OR LOWER(state.name->>'ar') LIKE LOWER(:search))`,
        { search: searchTerm },
      ).skip(pagination.skip).take(pagination.take);
    }
    const [data, total] = await queryBuilder.getManyAndCount();

    return { results: data, total };
  }

}