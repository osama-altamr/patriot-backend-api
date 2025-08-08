import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Category } from '../../../database';
import {  } from '../../../database';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
  ) {
    super(repository);
  }
      async getAllCategories(search?: string) {
        const queryBuilder = this.repository.createQueryBuilder('category');
        if (search) {
            const searchTerm = `%${search}%`;
            queryBuilder.where(
              `(LOWER(category.name->>'en') LIKE LOWER(:search) OR LOWER(category.name->>'ar') LIKE LOWER(:search))`,
              { search: searchTerm }
            );
        }
        const [data, total] = await queryBuilder.getManyAndCount();
    
        return { results: data, total: total }; 
    }
}
