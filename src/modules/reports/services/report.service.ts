import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';
import { Report } from 'src/database';
import { CreateReportlDto } from '../api/dto/request/create-report.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository, 
  ) {}

  async create(body: CreateReportlDto){
    return await this.reportRepo.create(body)
  }
  async getAllReports(): Promise<Report[]> {
    return this.reportRepo.findAll({})
  }

  async getReport(id: string): Promise<Report | null> {
    const Report = await this.reportRepo.findOneById(id)
    if (!Report) {
        throw new NotFoundException(`Report with ID ${id} not found`)
    }
    return Report
  }

  async deleteReport(id: string): Promise<void> {
   await this.reportRepo.delete(id)
  }
}
