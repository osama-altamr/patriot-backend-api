import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '/users/services/user.service';
import { User } from '../../database';
import { UserRepository } from '/users/repository/user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}