import { Injectable } from '@nestjs/common';
import { MaterialRepository } from '../repository/material.repository';
import { MaterialError } from './material.error';
import { CreateMaterialDto } from '../api/dto/response/create-material.dto';
import { Material } from 'src/database';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialRepo: MaterialRepository, 
    private readonly materialError: MaterialError,
  ) {}

  async create(body: CreateMaterialDto){
    await this.materialRepo.create(body as unknown as Material)
  }

}
