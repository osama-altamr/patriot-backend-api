import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/database';
import { ReportService } from './services/report.service';
import { ReportController } from './api/controllers/report.controller';
import { ReportRepository } from './repository/report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportService, ReportRepository],
  controllers: [ReportController],
  exports: [ReportService, ReportRepository],
})
export class ReportModule {}