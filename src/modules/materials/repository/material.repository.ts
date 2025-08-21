import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Material } from '../../../database';
import {  } from '../../../database';

@Injectable()
export class MaterialRepository extends BaseRepository<Material> {
  constructor(
    @InjectRepository(Material)
    repository: Repository<Material>,
  ) {
    super(repository);
  }

   async getAllMaterials(search?: string, stateId?:string): Promise<{ results: Material[]; total: number }> {
        const queryBuilder = this.repository.createQueryBuilder('material')
        if (search) {
            const searchTerm = `%${search}%`;
            queryBuilder.andWhere(
                `(LOWER(material.name->>'en') LIKE LOWER(:search) OR LOWER(material.name->>'ar') LIKE LOWER(:search))`,
                { search: searchTerm }
            );
        }
      
        const [data, total] = await queryBuilder.getManyAndCount();
    
        return { results: data, total }; 
    }
}
