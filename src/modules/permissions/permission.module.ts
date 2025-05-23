import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './api/controllers/permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/database';
import { PermissionRepository } from './repository/permission.repository';
import { UserModule } from '/users/user.module';

@Module({
  imports: [UserModule,TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}