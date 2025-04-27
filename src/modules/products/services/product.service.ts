import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
 
}
