import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseRepository, Permission } from '../../../database';
import {  } from '../../../database';
import { PermissionAccessType } from '../api/enums/permission.enum';
import { Pagination } from '@Package/api';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    repository: Repository<Permission>,
  ) {
    super(repository);
  }
   
  async getReportSummary(startDate: Date, endDate: Date)  {
    const rawSummary: { accessType: string; count: string }[] = await this.repository
      .createQueryBuilder('permission')
      .select('permission.accessType', 'accessType')
      .addSelect('COUNT(permission.id)', 'count')
      .where('permission.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('permission.accessType')
      .getRawMany();

      const initialSummary = {};
      for (const type of Object.values(PermissionAccessType)) {
        initialSummary[`${type}s`] = 0;
      }
      const accessLevelSummary = rawSummary.reduce((accumulator, currentItem) => {
        const key = `${currentItem.accessType}s`
        const count = parseInt(currentItem.count, 10) || 0;
        if (key in accumulator) {
          accumulator[key] = count;
        }
        
        return accumulator;
      }, initialSummary);

      const allPermissions = await this.repository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.user', 'user')
      .where('permission.accessType IN (:...types)', { 
        types: ['driver', 'employee'] 
      })
      .andWhere('permission.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('permission.createdAt', 'DESC')
      .getMany();

      const sortedResult = allPermissions.reduce(
        (accumulator, permission) => {
          if (permission.accessType === 'driver') {
            accumulator.drivers.push(permission);
          } else if (permission.accessType === 'employee') {
            accumulator.employees.push(permission);
          }
          return accumulator;
        },
        { drivers: [], employees: [] } 
      );

      return { accessLevelSummary, breakdownByType: sortedResult }
  }

  async getAllDrivers(){
    return await this.repository.find({
      where: {
        accessType: PermissionAccessType.driver
      },
      relations: ['user']
    })
  }

  async findOneByWithPop(query: object){
    return await this.repository.findOne({
      where: {
        ...query
      },
      relations: ['stage', 'user']
    })
  }

  async getAllWithPop(query?: object){
    return await this.repository.find({
      where: query ?? {
      },
      relations: ['user', 'stage',]
    })
  }

  async getAllAndCountWithPop(query?: object, pagination?: Pagination){
    const findOptions: FindManyOptions<Permission> = {
      where: query ?? {},
      relations: ['user', 'stage'],
      order: {
        createdAt: 'DESC',
      },
    };

    if (pagination) {
      findOptions.skip = pagination.skip;
      findOptions.take = pagination.take;
    }

    const [results, total] = await this.repository.findAndCount(findOptions);

    return {
      results,
      total,
    };
  }
}
