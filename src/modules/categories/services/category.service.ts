import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}
 
}
