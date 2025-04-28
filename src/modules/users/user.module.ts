import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '/users/services/user.service';
import { User } from '../../database';
import { UserRepository } from '/users/repository/user.repository';
import { UserController } from './api/controllers/user.controller';
import { AuthModule } from '/auth/auth.module';
import { RefreshTokenModule } from '/refresh-tokens/refresh-token.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]),RefreshTokenModule, AuthModule, ],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}