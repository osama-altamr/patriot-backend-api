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
import { CategoryRepository } from '/categories/repository/category.repository'
import { MaterialRepository } from '/materials/repository/material.repository'
import { PermissionService } from '/permissions/services/permission.service'
import { NotificationRepository } from '/notifications/repository/notification.repository'
@Injectable()
export class OrderItemService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly materialRepo: MaterialRepository,
        private readonly permissionService: PermissionService,
        private readonly notificationRepo: NotificationRepository,

        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly qrcodeService: QrcodeService,
        private readonly stageRepo: StageRepository,
        private readonly orderItemActionRepository: OrderItemActionRepository,
        
    ) { }

async createOrderItem(orderId: string, orderItemData: CreateOrderItemDto): Promise<OrderItem> {
    try {
        // التحقق من وجود المنتج
        const product = await this.productService.getProduct(orderItemData.productId)
        if (!product) {
            throw new NotFoundException(`Product with ID ${orderItemData.productId} not found`)
        }

        // التحقق من وجود الطلب
        const order = await this.ordersRepository.findOneById(orderId)
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`)
        }

        let material = null
        let category = null

        // التحقق من الفئة إذا تم تمريرها
        if (orderItemData.categoryId) {
            category = await this.categoryRepo.findOneById(orderItemData.categoryId)
            if (!category) {
                throw new NotFoundException(`Category with ID ${orderItemData.categoryId} not found`)
            }
        }

        // التحقق من المادة إذا تم تمريرها
        if (orderItemData.materialId) {
            material = await this.materialRepo.findOneById(orderItemData.materialId)
            if (!material) {
                throw new NotFoundException(`Material with ID ${orderItemData.materialId} not found`)
            }
        }

        // تحديد المرحلة الحالية الأولى
        let currentStage = null

        // إذا تم تمرير معرف المرحلة الحالية
        if (orderItemData.currentStageId) {
            currentStage = await this.stageRepo.findOneById(orderItemData.currentStageId)
            if (!currentStage) {
                throw new NotFoundException(`Stage with ID ${orderItemData.currentStageId} not found`)
            }
        }
        // إذا كان المنتج له مراحل، استخدم المرحلة الأولى
        else if (product.stages && product.stages.length > 0) {
            // ترتيب المراحل حسب الترتيب إذا كان متوفراً
            const sortedStages = product.stages.sort((a, b) => (a.order || 0) - (b.order || 0))
            currentStage = sortedStages[0]
        }

        // إنشاء عنصر الطلب
        const orderItem = await this.orderItemRepository.create({
            width: orderItemData.width,
            height: orderItemData.height,
            note: orderItemData.note,
            order: { id: orderId } as any,
            product,
            status: OrderItemStatus.pending,
            price: 0,
            category,
            material,
            currentStage,
            stages: product.stages || [], // نسخ جميع المراحل من المنتج
        } as any) as OrderItem

        // إنشاء رمز QR
        try {
            const qrCode = await this.qrcodeService.generateQRCode(
                `http://localhost:3000/confirm-state?orderId=${orderId}&orderItem=${orderItem.id}`
            )

            const updatedOrderItem = await this.orderItemRepository.update(orderItem.id, {
                qrCode,
            })

            return updatedOrderItem
        } catch (qrError) {
            // إذا فشل إنشاء QR code، نحذف عنصر الطلب ونرمي خطأ
            await this.orderItemRepository.delete(orderItem.id)
            throw new Error(`Failed to generate QR code: ${qrError.message}`)
        }

    } catch (error) {
        // معالجة شاملة للأخطاء
        if (error instanceof NotFoundException) {
            throw error
        }
        throw new Error(`Failed to create order item: ${error.message}`)
    }
}

async updateOrderItem(orderId: string, itemId:string, orderItemData: UpdateOrderItemDto): Promise<OrderItem> {
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
    await this.orderItemActionRepository.create({
        startsAt: new Date(),
        stage: { id: stage.id },
        employee: { id: employee.id },
        orderItem: { id: orderItem.id }
    } as any)
    dataToUpdate.status = OrderItemStatus.inProgress
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
      };
      await this.notificationRepo.create({
        title: notifications.title,
        content: notifications.content,
        isSeen: false,
        type: "order",
        recordId: orderId,
        user: order.user,
      });
       }
    }
} 
