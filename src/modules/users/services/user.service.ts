// users/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async createUser(data: Partial<User>): Promise<User> {
    return await this.userRepo.create(data) as User;
  }
}
