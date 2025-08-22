import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './api/controllers/permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/database';
import { PermissionRepository } from './repository/permission.repository';
import { UserModule } from '/users/user.module';
import { StageModule } from '/stages/stage.module';

@Module({
  imports: [forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Permission]), StageModule],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})

export class PermissionModule {}