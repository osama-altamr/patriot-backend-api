import { Injectable } from '@nestjs/common';
import { IUser, User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly userRepo: UserRepository) {}
}
