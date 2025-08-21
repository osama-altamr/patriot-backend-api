import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/database';
import { FavoriteController } from './api/controllers/favorite.controller';
import { FavoriteService } from './services/favorite.service';
import { FavoriteRepository } from './repository/favorite.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
  exports: [FavoriteService],
})

export class FavoriteModule {}