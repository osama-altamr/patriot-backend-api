import { Module } from '@nestjs/common';
import { StageService } from './services/stage.service';
import { StageController } from './api/controllers/stage.controller';
import { StageRepository } from './repository/stage.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([Stage])],
  providers: [StageRepository, StageService],
  exports: [StageService],
})
export class StageModule {}