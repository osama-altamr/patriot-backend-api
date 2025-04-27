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
}
