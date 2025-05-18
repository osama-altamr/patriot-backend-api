import { Injectable, NotFoundException } from '@nestjs/common';
import { MaterialRepository } from '../repository/material.repository';
import { MaterialError } from './material.error';
import { CreateMaterialDto } from '../api/dto/request/create-material.dto';
import { Material } from 'src/database';
import { UpdateMaterialDto } from '../api/dto/request/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialRepo: MaterialRepository, 
    private readonly materialError: MaterialError,
  ) {}

  async create(body: CreateMaterialDto){
    return await this.materialRepo.create(body as unknown as Material)
  }
  async getAllMaterials(): Promise<Material[]> {
    return this.materialRepo.findAll()
  }

  async getMaterial(id: string): Promise<Material | null> {
    const Material = await this.materialRepo.findOneById(id)
    if (!Material) {
        throw new NotFoundException(`Material with ID ${id} not found`)
    }
    return Material
  }

  async updateMaterial(id: string, updateData: UpdateMaterialDto): Promise<Material> {
    return await this.materialRepo.update(id, updateData as any)
  }

  async deleteMaterial(id: string): Promise<void> {
   await this.materialRepo.delete(id)
  }
}
