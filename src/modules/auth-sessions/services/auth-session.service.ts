import { BadRequestException, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { IUser } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';
import { LoginDto } from '../api/dto/request/login.dto';
import { HashService } from '@Package/auth';
import { AuthService } from '/auth/services/auth.service';
import { RefreshTokenRepository } from '/refresh-tokens/repository/refresh-token.repository';
import { addSeconds, isPast } from 'date-fns';
import { EnvironmentService } from '@Package/config';
import { RefreshDto } from '../api/dto/request/refresh.dto';
import { PermissionRepository } from '/permissions/repository/permission.repository';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly authService: AuthService,
    private readonly environmentService: EnvironmentService,
  ) {}

  calculateExpiration (issuedAt: Date): Date {
    return addSeconds(issuedAt, +this.environmentService.get('jwt.jwtExpiredRefresh'))
  }
    

  async login(data: LoginDto): Promise<{
    user: IUser,
    accessToken: string,
    refreshToken: string
  }> {
    const user = await this.userRepo.findOneBy({
      email: data.email,
    })
    user.permissions = await this.permissionRepo.findOneBy({
      user: {id: user.id}
    }) as any
    if(!await HashService.comparePassword(data.password, user.password)){
      throw new BadRequestException()
    }
    const accessToken =  await this.authService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    const refreshToken = await this.authService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    const issuedAt = new Date()

    await this.refreshTokenRepo.create({
      token: refreshToken,
      issuedAt,
      expiresAt: this.calculateExpiration(issuedAt),
      revokedAt: null,
      user
    })
    
    return {
      user,
      accessToken,
      refreshToken,
    }
  }

  async refresh(data: RefreshDto): Promise<{
    accessToken: string,
  }> {
    const refreshToken = await this.refreshTokenRepo.findOneByToken({
      token: data.refreshToken,
    })

    if (isPast(refreshToken.expiresAt)
      || (refreshToken.revokedAt && isPast(refreshToken.revokedAt))) {
      throw new BadRequestException()
    }
    refreshToken.revokedAt = new Date()
    await refreshToken.save()
    const accessToken =  await this.authService.generateAccessToken({
      id: refreshToken.user.id,
      email: refreshToken.user.email,
      role: refreshToken.user.role,
    })
    return {
      accessToken,
    }
  }
}
