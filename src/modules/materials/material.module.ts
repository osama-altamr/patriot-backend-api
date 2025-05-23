import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './api/controllers/material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from 'src/database';
import { MaterialRepository } from './repository/material.repository';
import { MaterialError } from './services/material.error';
import { JWTStrategy } from '@Package/auth/passport/strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [MaterialService, MaterialRepository, MaterialError, JWTStrategy],
  controllers: [MaterialController],
  exports: [MaterialService, MaterialRepository],
})
export class MaterialModule {}