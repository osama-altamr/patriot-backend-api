import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './api/controllers/material.admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from 'src/database';
import { MaterialRepository } from './repository/material.repository';
import { MaterialError } from './services/material.error';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [MaterialService, MaterialRepository, MaterialError],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}