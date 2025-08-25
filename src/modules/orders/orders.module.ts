import { forwardRef, Module } from '@nestjs/common'
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
import { StateModule } from '/states/state.module'
import { CityModule } from '/city/city.module'
import { StagePatternModule } from '/stage-pattern/stage-pattern.module'
import { TaskSchedulingService } from './services/task-scheduling.service'
import { GetAllItemsValidation } from './api/validations/get-all-items.validation'

@Module({
    imports: [
   TypeOrmModule.forFeature([Order, OrderItem, OrderCode, OrderItemAction]),
   forwardRef(() => ProductModule),
   forwardRef(() => CategoryModule),
   UserModule,
   MailerModule,
    NotificationModule,
    PermissionModule,
      UserModule, StageModule, MaterialModule, PermissionModule, 
    StateModule, CityModule,
    
    StagePatternModule
],
    controllers: [OrdersController],
    providers: [OrdersService, OrderCodeService, OrdersRepository, OrderItemService, OrderItemActionRepository, OrderItemRepository, OrderCodeRepository, QrcodeService, TaskSchedulingService,GetAllItemsValidation],
    exports: [ OrdersService, OrdersRepository, OrderItemRepository, OrderCodeRepository, OrderItemActionRepository]
})
export class OrdersModule { } 