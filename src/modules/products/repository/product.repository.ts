import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Product } from '../../../database';
import {  } from '../../../database';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository);
  }
  async findAllWithPop() {
    return await this.findAll({
      filter: {
        relations: ['category']
      }
    })
  }
}
