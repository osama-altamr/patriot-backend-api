import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Product } from '../../../database';
import {  } from '../../../database';
import { UpdateProductDto } from '../api/dto/request/update-product.dto';

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
        relations: ['category', 'stages'],
      }
    })
  }

  async findOneByIdWithPop(id: string){
    return this.repository.findOne({ where: {id}, relations: ['category', 'stages'], } as any)
  }

  async updateManyToMany(data: any){
    return this.repository.save(data)
  }
  
}
