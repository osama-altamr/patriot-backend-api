import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../database';
import { User } from '../../../database';
import { UserRole } from '../api/enums/user.enum';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }
  async getAllUsers(search?: string, role?: UserRole) {
    const queryBuilder = this.repository.createQueryBuilder('user');

    if (search) {
      const searchTerm = `%${search}%`;
      queryBuilder.andWhere(
        `LOWER(user.name) LIKE LOWER(:search)`,
        { search: searchTerm }
      );
    }
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
  
    const [data, total] = await queryBuilder.getManyAndCount();
    return { results: data, total };
  }
}
