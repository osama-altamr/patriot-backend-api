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

    async getAllCities(search?: string, stateId?:string): Promise<{ results: City[]; total: number }> {
      const queryBuilder = this.repository.createQueryBuilder('city')
          .leftJoinAndSelect('city.state', 'state')
          if(stateId){
            queryBuilder.where('state.id = :stateId', { stateId })
          }
  
      if (search) {
          const searchTerm = `%${search}%`;
          queryBuilder.andWhere(
              `(LOWER(city.name->>'en') LIKE LOWER(:search) OR LOWER(city.name->>'ar') LIKE LOWER(:search))`,
              { search: searchTerm }
          );
      }
    
      const [data, total] = await queryBuilder.getManyAndCount();
  
      return { results: data, total }; 
  }
  
}