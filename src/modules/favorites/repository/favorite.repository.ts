import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Favorite } from 'src/database'; // Adjust path

@Injectable()
export class FavoriteRepository extends BaseRepository<Favorite> {
  constructor(
    @InjectRepository(Favorite)
    repository: Repository<Favorite>,
  ) {
    super(repository);
  }
  
  async findUserFavorites(userId: string): Promise<Favorite[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
      },
      relations: ['product'],
    });
  }

  async findOneByUserAndProduct(userId: string, productId: string): Promise<Favorite | null> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });
  }
}