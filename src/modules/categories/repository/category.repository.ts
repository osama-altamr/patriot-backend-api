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
}
