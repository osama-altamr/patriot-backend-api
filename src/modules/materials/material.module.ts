import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './api/controllers/material.controller';

@Module({
  providers: [MaterialService],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}