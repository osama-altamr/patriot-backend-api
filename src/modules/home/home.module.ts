import { Module } from '@nestjs/common';
import { HomeService } from './services/home.service';
import { HomeController } from './api/controllers/home.controller';
import { UserModule } from '/users/user.module';
import { ProductModule } from '/products/product.module';
import { MaterialModule } from '/materials/material.module';
import { ComplaintModule } from '/complaints/complaint.module';
import { OrdersModule } from '/orders/orders.module';

@Module({
  imports: [ProductModule, UserModule, MaterialModule, ComplaintModule, OrdersModule],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}