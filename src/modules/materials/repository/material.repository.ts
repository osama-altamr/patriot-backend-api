import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Material } from '../../../database';
import { Pagination } from '@Package/api';

@Injectable()
export class MaterialRepository extends BaseRepository<Material> {
  constructor(
    @InjectRepository(Material)
    repository: Repository<Material>,
  ) {
    super(repository);
  }

   async getAllMaterials(pagination: Pagination, search?: string): Promise<{ results: Material[]; total: number }> {
        const queryBuilder = this.repository.createQueryBuilder('material')
        if (search) {
            const searchTerm = `%${search}%`;
            queryBuilder.andWhere(
                `(LOWER(material.name->>'en') LIKE LOWER(:search) OR LOWER(material.name->>'ar') LIKE LOWER(:search))`,
                { search: searchTerm }
            ).skip(pagination.skip).take(pagination.take);
        }
      
        const [data, total] = await queryBuilder.getManyAndCount();
    
        return { results: data, total }; 
    }
}
