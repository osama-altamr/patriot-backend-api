import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagePattern } from 'src/database';
import { StagePatternService } from './services/stage-pattern.service';
import { StagePatternRepository } from './repository/stage-pattern.repository';
import { StageModule } from 'src/modules/stages/stage.module'; // Import StageModule to use StageService
import { StagePatternController } from './api/controllers/stage-patttern.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StagePattern]),
    StageModule // We need this to get access to StageService
  ],
  controllers: [StagePatternController],
  providers: [StagePatternService, StagePatternRepository],
  exports: [StagePatternService, StagePatternRepository],
})
export class StagePatternModule {}