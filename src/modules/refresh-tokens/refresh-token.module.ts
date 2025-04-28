import { Module } from '@nestjs/common';
import { RefreshTokenService } from './services/refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/database';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository],
})

export class RefreshTokenModule {}