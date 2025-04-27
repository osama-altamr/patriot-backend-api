import { Module } from '@nestjs/common';
import { StageService } from './services/stage.service';
import { StageController } from './api/controllers/stage.controller';

@Module({
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {}