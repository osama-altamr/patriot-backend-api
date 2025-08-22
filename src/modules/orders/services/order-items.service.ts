import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderItemDto } from '../api/dto/create-order.dto'
import { OrderItem, OrderItemStatus } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { ProductService } from '../../products/services/product.service'
import { Not, IsNull, In } from 'typeorm'
import { UserService } from '/users/services/user.service'
import { OrderCodeService } from './order-code.service'
import { QrcodeService } from './qrcode.service'
import { StageRepository } from '/stages/repository/stage.repository'
import { UpdateOrderItemDto } from '../api/dto/update-order-item.dto'
import { OrderItemActionRepository } from '../repository/order-item-action.repository'
import { OrderStatus } from 'src/database'
import { CategoryRepository } from '/categories/repository/category.repository'
import { MaterialRepository } from '/materials/repository/material.repository'
import { PermissionService } from '/permissions/services/permission.service'
import { NotificationRepository } from '/notifications/repository/notification.repository'
import { CreateOrderItemAction } from '../api/dto/create-order-item-action.dto'
import { StagePatternRepository } from '/stage-pattern/repository/stage-pattern.repository'
import { NotificationService } from '/notifications/services/notification.service'
@Injectable()
export class OrderItemService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly materialRepo: MaterialRepository,
        private readonly permissionService: PermissionService,
        private readonly notificationRepo: NotificationRepository,
        private readonly productService: ProductService,
        private readonly qrcodeService: QrcodeService,
        private readonly stageRepo: StageRepository,
        private readonly orderItemActionRepository: OrderItemActionRepository,
        private readonly stagePatternRepo: StagePatternRepository,
        private readonly notificationService: NotificationService,
        
        
    ) { }

async createOrderItem(orderId: string, orderItemData: CreateOrderItemDto): Promise<OrderItem> {
    const product = await this.productService.getProduct(orderItemData.productId)
    await this.ordersRepository.findOneById(orderId)
    let material
    let category
    let stagePattern

    if(orderItemData.categoryId){
        category= await this.categoryRepo.findOneById(orderItemData.categoryId)
    }
    if(orderItemData.materialId){
        material= await this.materialRepo.findOneById(orderItemData.materialId)
    }
    if(orderItemData.stagePatternId){
        stagePattern = await this.stagePatternRepo.findOneById(orderItemData.materialId)
    }
    let stages = product.stages
    let finalPrice

    if(orderItemData.stageIds && orderItemData.stageIds.length > 0) {
        stages = await this.stageRepo.findBy({ id: In( orderItemData.stageIds) })
    } else {
        const widthInMeters = orderItemData.width / 100;
        const heightInMeters = orderItemData.height / 100;
        const area = widthInMeters * heightInMeters;
        finalPrice = Number(area * product.pricePerSquareMeter).toFixed(2)
    }
    const orderItem  = await this.orderItemRepository.create({
        ...orderItemData,
        stages,
        currentStage: stages[0],
        material,
        order: { id: orderId } as any,
        product,
        status: OrderItemStatus.pending,
        price: finalPrice,
        category,
        stagePattern,
    } as any) as OrderItem
    const qrCode = await this.qrcodeService.generateQRCode(`http://locahost:3000/confirm-state?orderId=${orderId}&orderItem=${orderItem.id}`)
    const updatedOrderItem =  await this.orderItemRepository.update(orderItem.id, {
        qrCode,
    })
    return updatedOrderItem
}

    async getOrderItem(orderItemId: string): Promise<OrderItem> {
        return await this.orderItemRepository.findOneByIdWithPop(orderItemId)
    }


  async updateOrderItem( itemId:string, orderItemData: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOneBy({ id: itemId })
    if (!orderItem) {
        throw new NotFoundException('Order item not found');
    }

    if (orderItemData.currentStageId !== undefined) {
        if (orderItemData.currentStageId === null) {
            orderItemData.currentStage = null;
            await this.notificationService.createNotification({
                title: {
                    en: `Order #${orderItem.order.ref} Updated`,
                    ar: `تحديث الطلب #${orderItem.order.ref}`
                  },
                content: {
                    en: `Your item "${orderItem.product.name.en}" is now complete!`,
                    ar: `اكتمل تجهيز العنصر الخاص بك "${orderItem.product.name.ar}"!`
                },
                recordId: orderItem.order.id,
                type: 'order',
                isSeen: false,
                userId: orderItem.order.user.id,
              });

        } else {
            orderItemData.currentStage = await this.stageRepo.findOneById(orderItemData.currentStageId);
            await this.notificationService.createNotification({
                title: {
                  en: `Order #${orderItem.order.ref} Updated`,
                  ar: `تحديث الطلب #${orderItem.order.ref}`
                },
                content: {
                  en: orderItemData.currentStage
                    ? `Your item has moved to the "${orderItemData.currentStage.name.en}" stage.`
                    : 'Your item is awaiting the next stage.',
                  ar: orderItemData.currentStage
                    ? `لقد انتقل العنصر الخاص بك إلى مرحلة "${orderItemData.currentStage.name.ar}".`
                    : 'العنصر الخاص بك في انتظار المرحلة التالية.'
                },
                recordId: orderItem.order.id,
                type: 'order',
                isSeen: false,
                userId: orderItem.order.user.id,
              });
         }
        delete orderItemData.currentStageId;
    }

    if (orderItemData.stageIds !== undefined) {
        orderItemData.stages = await this.stageRepo.findBy({
            id: In(orderItemData.stageIds)
        })
        delete orderItemData.stageIds;
    }

    const updatedItem = await this.orderItemRepository.update(orderItem.id, orderItemData)
    await this.checkCompletedOrder(orderItem.order.id)
    return updatedItem
    }

    async checkCompletedOrder(orderId: string) {
       const order =  await this.ordersRepository.findOneById(orderId)
       const completedItems = order.items.filter(item => item.status === OrderItemStatus.completed)
       if(order.items.length === completedItems.length){
        const orderItems = await this.orderItemRepository.findBy({
            order: { id: orderId }
        })

        let total = 0; 
        for(const item of orderItems){
            total += Number(item.price)
        }        
        await this.ordersRepository.update(orderId, {
            status: OrderStatus.completed,
            total
        })
       const drivers = await this.permissionService.getAllDrivers()
       for(const driver of drivers) {
        const notifications = {
            title:  {
                en: "Order Completed",
                ar: "تم إكمال الطلب"
             },
            content: {
                en: `Order #${order.ref} has been completed successfully`,
                ar: `تم إكمال الطلب رقم #${order.ref} بنجاح`
            }
          };
          await this.notificationRepo.create({
            title: notifications.title,
            content: notifications.content,
            isSeen: false,
            type: "order",
            recordId: orderId,
            user: driver,
          });
       }

    const notifications = {
        title:  {
            en: "Order Completed",
            ar: "تم إكمال الطلب"
         },
        content: {
            en: `Order #${order.ref} has been completed successfully`,
            ar: `تم إكمال الطلب رقم #${order.ref} بنجاح`
        }
      }
      await this.notificationRepo.create({
        title: notifications.title,
        content: notifications.content,
        isSeen: false,
        type: "order",
        recordId: orderId,
        user: order.user,
      })
       }
    }

    async createAction(itemId: string, reqData: CreateOrderItemAction){
        const orderItem = await this.orderItemRepository.findOneBy({ id: itemId })
        if (!orderItem) {
            throw new NotFoundException('Order item not found');
        }

     const employee = await this.permissionService.getUserByStage(orderItem.currentStage.id)

     if (!employee) {
       throw new NotFoundException('Employee not found');
     }

    if(reqData.isStart){
        return await this.orderItemActionRepository.create({
                startsAt: new Date(),
                stage: { id: orderItem.currentStage.id },
                employee: { id: employee.id },
                orderItem: { id: orderItem.id }
            } as any)
        }
        const currentAction = await this.orderItemActionRepository.findOneBy({
            orderItem: { id: orderItem.id },
            stage: { id: orderItem.currentStage.id },
          })
       return  await this.orderItemActionRepository.update(currentAction.id, {
           endsAt: new Date()
       })
    }
} 
