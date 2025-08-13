import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, ProductReview } from '../../../database';
import {  } from '../../../database';

@Injectable()
export class ProductReviewReviewRepository extends BaseRepository<ProductReview> {
  constructor(
    @InjectRepository(ProductReview)
    repository: Repository<ProductReview>,
  ) {
    super(repository);
  }

   getOneBy = (query: object) => {
    return this.repository.find({
      where: query
      
    });
  }

  async calculateProductRatingStats(productId: string) {
    const stats = await this.repository.createQueryBuilder('review')
      .select('COUNT(review.id)', 'ratingsQuantity')
      .addSelect('AVG(review.rating)', 'ratingsAverage')
      .where('review.productId = :productId', { productId })
      .getRawOne();
    return {
      ratingsQuantity: parseInt(stats.ratingsQuantity, 10) || 0,
      ratingsAverage: parseFloat(stats.ratingsAverage) || 0,
    };
  }
}
