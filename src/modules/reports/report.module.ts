import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/database';
import { ReportService } from './services/report.service';
import { ReportController } from './api/controllers/report.controller';
import { ReportRepository } from './repository/report.repository';
import { OrdersModule } from '/orders/orders.module';
import { ExcelExportService } from './services/genereate-xlsx.service';
import { AWSModule } from '/aws/aws.module';
import { ComplaintModule } from '/complaints/complaint.module';
import { UserModule } from '/users/user.module';
import { PermissionModule } from '/permissions/permission.module';
import { ProductModule } from '/products/product.module';
import { CategoryModule } from '/categories/category.module';
import { GetAllReportsValidation } from './api/validation/get-all.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), OrdersModule, AWSModule, ComplaintModule, UserModule, PermissionModule, ProductModule, CategoryModule],
  providers: [ReportService, ReportRepository, ExcelExportService, GetAllReportsValidation],
  controllers: [ReportController],
  exports: [ReportService, ReportRepository, ExcelExportService],
})
export class ReportModule {}