import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Report } from '../../../database';
import {  } from '../../../database';

@Injectable()
export class ReportRepository extends BaseRepository<Report> {
  constructor(
    @InjectRepository(Report)
    repository: Repository<Report>,
  ) {
    super(repository);
  }
}
