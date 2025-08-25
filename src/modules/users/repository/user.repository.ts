import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../database';
import { User } from '../../../database';
import { UserRole } from '../api/enums/user.enum';
import { GetAllUsersDto } from '../api/dto/request/get-all.dto';
import { Pagination, QueryValue } from '@Package/api';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }
  async getAllUsers(myQuery: QueryValue<GetAllUsersDto>, pagination: Pagination) {
    const queryBuilder = this.repository.createQueryBuilder('user');

    console.log(pagination)
    if (myQuery.search) {
      const searchTerm = `%${myQuery.search}%`;
      queryBuilder.andWhere(
        `LOWER(user.name) LIKE LOWER(:search)`,
        { search: searchTerm }
      )
    }
  
    if (myQuery.role) {
      queryBuilder.andWhere('user.role = :role', { role: myQuery.role });
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);
  
    const [data, total] = await queryBuilder.getManyAndCount();
    return { results: data, total };
  }
}
