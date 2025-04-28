// users/user.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { IUser, User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';
import { HashService, } from '@Package/auth';
import { AuthService } from '/auth/services/auth.service';
import { RefreshTokenRepository } from '/refresh-tokens/repository/refresh-token.repository';
import { addSeconds } from 'date-fns'
import { EnvironmentService } from '@Package/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly authService: AuthService,
      private readonly environmentService: EnvironmentService,
  ) {}
  calculateExpiration (issuedAt: Date): Date {
    return addSeconds(issuedAt, +this.environmentService.get('jwt.jwtExpiredRefresh'))
  }
  
  getAllUsers(): Promise<IUser[]> {
    return this.userRepo.findAll();
  }

  getByEmail(email: string): Promise<IUser> {
    return this.userRepo.findOneBy({
      email,
    })
  }

  getMe(id: string): Promise<IUser> {
    return this.userRepo.findOneById(id)
  }

  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    return this.userRepo.update(id, updateData)
  }
  
  async createUser(data: IUser): Promise<{
    user: IUser,
    accessToken: string,
    refreshToken: string
  }> {
    data.password = await HashService.hashPassword(data.password)
    const user =  await this.userRepo.create(data) as User

    Logger.debug({ user })
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
}
