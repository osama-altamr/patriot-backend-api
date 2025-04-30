import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JWTModule } from '@Package/auth';
import { AuthAdminController } from './api/controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [JWTModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthAdminController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}