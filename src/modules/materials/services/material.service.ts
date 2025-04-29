import { Injectable } from '@nestjs/common';
import { MaterialRepository } from '../repository/material.repository';
import { MaterialError } from './material.error';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialRepo: MaterialRepository, 
    private readonly materialError: MaterialError
  ) {}

  async create(){
    
  }
 
}
