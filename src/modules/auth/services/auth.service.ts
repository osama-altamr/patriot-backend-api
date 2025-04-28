import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from '@Package/auth'
import { EnvironmentService } from '@Package/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async generateAccessToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.environmentService.get('jwt.jwtAccessToken'),
      expiresIn: this.environmentService.get('jwt.jwtExpiredAccess'),
    })
  }

  async generateRefreshToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.environmentService.get('jwt.jwtRefreshToken'),
      expiresIn: this.environmentService.get('jwt.jwtExpiredRefresh'),
    })
  }

  async verifyToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.environmentService.get('jwt.jwtAccessToken'),
    })
  }
}