import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../../database/entities/order.entity'
import { OrderItem } from '../../database/entities/order-item.entity'
import { OrdersController } from './api/controllers/orders.controller'
import { OrdersService } from './services/orders.service'
import { OrdersRepository } from './repository/orders.repository'
import { OrderItemRepository } from './repository/order-item.repository'
import { ProductModule } from '../products/product.module'
@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository, OrderItemRepository],
    exports: [OrdersService]
})
export class OrdersModule { } 