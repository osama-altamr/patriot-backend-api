import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../../database/entities/order.entity'
import { OrderItem } from '../../database/entities/order-item.entity'
import { OrdersController } from './api/controllers/orders.controller'
import { OrdersService } from './services/orders.service'
import { OrdersRepository } from './repository/orders.repository'
import { OrderItemRepository } from './repository/order-item.repository'
import { ProductModule } from '../products/product.module'
import { MailerModule } from '/mailer/mailer.module'
import { NotificationModule } from '/notifications/notification.module'
import { UserModule } from '/users/user.module'
import { OrderCodeRepository } from './repository/order-code.repository'
import { OrderCode, OrderItemAction } from 'src/database'
import { OrderCodeService } from './services/order-code.service'
import { QrcodeService } from './services/qrcode.service'
import { StageModule } from '/stages/stage.module'
import { OrderItemService } from './services/order-items.service'
import { OrderItemActionRepository } from './repository/order-item-action.repository'
import { MaterialModule } from '/materials/material.module'
import { CategoryModule } from '/categories/category.module'
import { PermissionModule } from '/permissions/permission.module'

@Module({
    imports: [MailerModule,TypeOrmModule.forFeature([Order, OrderItem, OrderCode, OrderItemAction]), ProductModule, NotificationModule, UserModule, StageModule, MaterialModule, CategoryModule, PermissionModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrderCodeService, OrdersRepository, OrderItemService, OrderItemActionRepository, OrderItemRepository, OrderCodeRepository, QrcodeService],
    exports: [OrdersService, OrdersRepository, OrderCodeRepository]
})
export class OrdersModule { } 