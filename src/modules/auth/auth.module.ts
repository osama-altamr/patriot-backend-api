import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JWTModule } from '@Package/auth';

@Module({
  imports: [JWTModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}