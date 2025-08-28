import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Report } from '../../../database';
import {  } from '../../../database';
import { GetAllReportsDto } from '../api/dto/request/get-all.dto';
import { Pagination, QueryValue } from '@Package/api';

@Injectable()
export class ReportRepository extends BaseRepository<Report> {
  constructor(
    @InjectRepository(Report)
    repository: Repository<Report>,
  ) {
    super(repository);
  }
  async getAllReports(
    query: QueryValue<GetAllReportsDto>, 
    pagination: Pagination
  ): Promise<{ results: Report[]; total: number }> {
    const [results, total] = await this.repository.findAndCount({
      where: {},
      skip: pagination.skip,
      take: pagination.take,
    });

    return { results, total };
  }
}
