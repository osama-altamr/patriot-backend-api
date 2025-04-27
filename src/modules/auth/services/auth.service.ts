import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentService } from '@Package/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.environmentService.get('jwt.jwtAccessToken'),
      expiresIn: this.environmentService.get('jwt.jwtExpiredAccess'),
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.environmentService.get('jwt.jwtAccessToken'),
    });
  }
}