import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository, Product } from '../../../database';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository);
  }
  async findAllWithPop(categoryId: string) {
    const query: FindOptionsWhere<Product> = {}
    if(categoryId) {
      query.category = { id: categoryId }
    }
    return await this.findAll({
    
      filter: {
        where: query,
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
