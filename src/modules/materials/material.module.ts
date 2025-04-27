import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './api/controllers/material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from 'src/database';
import { MaterialRepository } from './repository/material.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [MaterialService, MaterialRepository],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}