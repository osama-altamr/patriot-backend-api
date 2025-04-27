import { Module } from '@nestjs/common';
import { AuthSessionService } from './services/auth-session.service';
import { UserRepository } from '/users/repository/user.repository';
import { AuthSessionController } from './api/controllers/auth-sessions.controller';

@Module({
  providers: [UserRepository, AuthSessionService],
  controllers: [AuthSessionController],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}