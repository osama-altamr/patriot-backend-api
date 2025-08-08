import { Module } from '@nestjs/common';
import { HomeService } from './services/home.service';
import { HomeController } from './api/controllers/home.controller';
import { UserModule } from '/users/user.module';
import { ProductModule } from '/products/product.module';
import { MaterialModule } from '/materials/material.module';
import { ComplaintModule } from '/complaints/complaint.module';
import { OrdersModule } from '/orders/orders.module';
import { StageModule } from '/stages/stage.module';
import { ReportModule } from '/reports/report.module';
import { CategoryModule } from '/categories/category.module';

@Module({
  imports: [ProductModule, UserModule, MaterialModule, ComplaintModule, OrdersModule, StageModule, ReportModule, CategoryModule],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}