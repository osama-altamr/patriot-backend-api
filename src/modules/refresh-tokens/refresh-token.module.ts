import { Module } from '@nestjs/common';
import { RefreshTokenService } from './services/refresh-token.service';
import { UserRepository } from '/users/repository/user.repository';
import { RefreshTokenController } from './api/controllers/refresh-tokens.controller';

@Module({
  providers: [UserRepository, RefreshTokenService],
  controllers: [RefreshTokenController],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}