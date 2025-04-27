// users/user.service.ts
import { Injectable } from '@nestjs/common';
import { IUser, User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';
import { HashService, JwtAuthGuard } from '@Package/auth';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}

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

  async createUser(data: Partial<IUser>): Promise<{
    user: IUser,
    accessToken: string,
    refreshToken: string
  }> {
    data.password = await HashService.hashPassword(data.password)
    const user =  await this.userRepo.create(data) as User
    
    const accessToken = ''
    const refreshToken = ''
    
    return {
      user,
      accessToken,
      refreshToken,
 }
}
}
