import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Permission } from '../../../database';
import {  } from '../../../database';
import { PermissionAccessType } from '../api/enums/permission.enum';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    repository: Repository<Permission>,
  ) {
    super(repository);
  }
   
  async getAllDrivers(){
    return await this.repository.find({
      where: {
        accessType: PermissionAccessType.driver
      },
      relations: ['user']
    })
  }
}
