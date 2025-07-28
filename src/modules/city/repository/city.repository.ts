import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseRepository, City } from '../../../database';

@Injectable()
export class CityRepository extends BaseRepository<City> {
  constructor(
    @InjectRepository(City)
    repository: Repository<City>,
  ) {
    super(repository);
  }

    async findAllWithPop({ filter }: { filter?: FindManyOptions }){
      return this.repository.find({
        where: filter as any,
        relations: ['state']
      })
    }
  
    async findOneByIdWithPop(id: string){
      return this.repository.findOne({ where: {id}, relations: ['state'] } as any)
    }
  
}