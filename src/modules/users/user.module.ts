import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '/users/services/user.service';
import { User } from '../../database';
import { UserRepository } from '/users/repository/user.repository';
import { UserController } from './api/controllers/user.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}