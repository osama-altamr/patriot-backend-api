import { Module } from '@nestjs/common';
import { AuthSessionService } from './services/auth-session.service';
import { AuthSessionController } from './api/controllers/auth-sessions.controller';
import { UserModule } from '/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthSessionController],
  providers: [AuthSessionService],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}