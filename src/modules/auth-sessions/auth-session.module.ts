import { Module } from '@nestjs/common';
import { AuthSessionService } from './services/auth-session.service';
import { AuthSessionController } from './api/controllers/auth-sessions.controller';
import { UserModule } from '/users/user.module';
import { AuthModule } from '/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AuthSessionController],
  providers: [AuthSessionService],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}