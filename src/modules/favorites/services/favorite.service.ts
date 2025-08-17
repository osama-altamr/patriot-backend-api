import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FavoriteRepository } from '../repository/favorite.repository'; // Adjust path
import { CreateFavoriteDto } from '../api/dto/request/create-favorite.dto';
import { Favorite, Product, User } from 'src/database'; // Adjust path

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepo: FavoriteRepository,
  ) {}

  async addFavorite(userId: string, favoriteData: CreateFavoriteDto): Promise<Favorite> {
    const { productId } = favoriteData;

    const existingFavorite = await this.favoriteRepo.findOneByUserAndProduct(userId, productId);
    if (existingFavorite) {
      throw new ConflictException('This product is already in your favorites.');
    }

    return await this.favoriteRepo.create({
      user: { id: userId } as User,
      product: { id: productId } as Product,
    }) as Favorite
    
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteRepo.findUserFavorites(userId);
  }

  async removeFavorite(userId: string, productId: string): Promise<void> {
    const favoriteToRemove = await this.favoriteRepo.findOneByUserAndProduct(userId, productId);
    
    if (!favoriteToRemove) {
      throw new NotFoundException(`Product with ID ${productId} is not in your favorites.`);
    }
    await this.favoriteRepo.delete(favoriteToRemove.id);
  }
}