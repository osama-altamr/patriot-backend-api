import { Module } from '@nestjs/common';
import { RefreshTokenService } from './services/refresh-token.service';
import { UserRepository } from '/users/repository/user.repository';
import { RefreshTokenController } from './api/controllers/refresh-tokens.controller';
import { UserModule } from '/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/database';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UserModule],
  providers: [RefreshTokenService, RefreshTokenRepository],
  controllers: [RefreshTokenController],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}