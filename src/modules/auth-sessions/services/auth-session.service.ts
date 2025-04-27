import { Injectable } from '@nestjs/common';
import { IUser, User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';

@Injectable()
export class AuthSessionService {
  constructor(private readonly userRepo: UserRepository) {}
  async login(data: Partial<User>): Promise<{
    user: IUser,
    accessToken: string
  }> {
    const user = await this.userRepo.findOneBy({
      email: data.email,
    })
    const accessToken = ''
    return {
      user,
      accessToken,
    }
  }
}
