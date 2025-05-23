import { Injectable, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderItemDto } from '../api/dto/create-order.dto'
import { OrderItem, OrderItemStatus } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { ProductService } from '../../products/services/product.service'
import { Not, IsNull } from 'typeorm'
import { UserService } from '/users/services/user.service'
import { OrderCodeService } from './order-code.service'
import { QrcodeService } from './qrcode.service'
import { StageRepository } from '/stages/repository/stage.repository'
import { UpdateOrderItemDto } from '../api/dto/update-order-item.dto'
import { OrderItemActionRepository } from '../repository/order-item-action.repository'
import { OrderStatus } from 'src/database'
@Injectable()
export class OrderItemService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly qrcodeService: QrcodeService,
        private readonly stageRepo: StageRepository,
        private readonly orderItemActionRepository: OrderItemActionRepository,
    ) { }

async createOrderItem(orderId: string, orderItemData: CreateOrderItemDto): Promise<OrderItem> {
    const product = await this.productService.getProduct(orderItemData.productId)
    await this.ordersRepository.findOneById(orderId)
    const stages = await this.stageRepo.findByIds(orderItemData.stageIds)
    const orderItem  = await this.orderItemRepository.create({
        ...orderItemData,
        order: { id: orderId } as any,
        product: product.id,
        status: OrderItemStatus.pending,
        price: 0,
        stages
    } as any) as OrderItem


    const qrCode = await this.qrcodeService.generateQRCode(`${orderId}|${orderItem.id}`)
    const updatedOrderItem =  await this.orderItemRepository.update(orderItem.id, {
        qrCode
    })
    return updatedOrderItem
}

async updateOrderItem(orderId: string,itemId:string, orderItemData: UpdateOrderItemDto): Promise<OrderItem> {
 await this.ordersRepository.findOneById(orderId)
 
 const orderItem = await this.orderItemRepository.findOneBy({ id: itemId })
  console.log(orderItem)
  if (!orderItem) {
    throw new NotFoundException('Order item not found');
  }


  const stage = await this.stageRepo.findOneById(orderItemData.currentStageId);
  if (!stage) {
    throw new NotFoundException('Stage not found');
  }
  console.log(stage)

  const employee = await this.userService.getMe(orderItemData.employeeId);
  if (!employee) {
    throw new NotFoundException('Employee not found');
  }
  console.log(employee)
  
   let dataToUpdate: any = {}
   if(!orderItem.currentStage && orderItemData.currentStageId){
    console.log('Inside if condition')
    await this.orderItemActionRepository.create({
        startsAt: new Date(),
        stage: { id: stage.id },
        employee: { id: employee.id },
        orderItem: { id: orderItem.id }
    } as any)
    dataToUpdate.status = OrderItemStatus.inProgress
    console.log('End If condition')
   } else {
    const currentAction = await this.orderItemActionRepository.findOneBy({
        orderItem: { id: orderItem.id },
        stage: { id: orderItem.currentStage.id },
    })
    if(orderItemData.status === OrderItemStatus.completed &&
         orderItem.currentStage.id === orderItemData.currentStageId ){
        await this.orderItemActionRepository.update(currentAction.id, {
            endsAt: new Date()
        })
        dataToUpdate.status = OrderItemStatus.completed
        await this.orderItemRepository.update(orderItem.id,dataToUpdate)
        await this.checkCompletedOrder(orderId)
    return await this.orderItemRepository.findOneByIdWithPop(orderItem.id)
  }

        await this.orderItemActionRepository.update(currentAction.id, {
            endsAt: new Date()
        })
        await this.orderItemActionRepository.create({
            startsAt: new Date(),
            stage: { id: stage.id },
            employee: { id: employee.id },
            orderItem: { id: orderItem.id }
        } as any)
    }
    dataToUpdate.currentStage = stage 

     await this.orderItemRepository.update(orderItem.id,dataToUpdate)
     await this.checkCompletedOrder(orderId)
     return await this.orderItemRepository.findOneByIdWithPop(orderItem.id)
}
    async checkCompletedOrder(orderId: string) {
       const order =  await this.ordersRepository.findOneById(orderId)
       const completedItems = order.items.filter(item => item.status === OrderItemStatus.completed)
       if(order.items.length === completedItems.length){
        await this.ordersRepository.update(orderId, {
            status: OrderStatus.completed
        })
       }
      // Send Notification to drivers
    }
} 
