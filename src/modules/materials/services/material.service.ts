import { Injectable } from '@nestjs/common';
import { MaterialRepository } from '../repository/material.repository';

@Injectable()
export class MaterialService {
  constructor(private readonly materialRepo: MaterialRepository) {}
 
}
