import { Injectable, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderDto } from '../api/dto/create-order.dto'
import { UpdateOrderDto } from '../api/dto/update-order.dto'
import { Order, OrderStatus } from '../../../database/entities/order.entity'
import { OrderItem } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
import { NotificationService } from '/notifications/services/notification.service'
import { UserService } from '/users/services/user.service'
import { OrderCodeService } from './order-code.service'
import { OrderItemService } from './order-items.service'
import { GlassCuttingDto } from '../api/dto/glass-cutting.dto'
import { MaterialService } from '/materials/services/material.service'
@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly orderItemService: OrderItemService,
        private readonly userService: UserService,
        private readonly orderCodeService: OrderCodeService,
        private readonly notificationService: NotificationService,
        private readonly materialService: MaterialService,

    ) { }

    async glassCutting(inputData: GlassCuttingDto) {
        const material = await this.materialService.getMaterial(inputData.materialId)
        if(inputData.type === 'item') {

        }
        if(inputData.type === 'order') {
            
        }
        return {}
    }
    async create(createOrderDto: CreateOrderDto): Promise<Order> {
          const random4Digit = Math.floor(1000 + Math.random() * 9000); 
          const newRef = `DO-${random4Digit}`;
        const user = await this.userService.getMe(createOrderDto.userId)
        const order = await this.ordersRepository.create({
            ...createOrderDto,
            ref: newRef,
            user,
        } as any) as Order
        for (const item of createOrderDto.items) {
            console.log(order)
            await this.orderItemService.createOrderItem(order.id, item)
        }
        await this.notificationService.createNotification({
            title: {
                en: `New Order #${order.ref }`,
                ar: `طلب جديد #${order.ref}`
              },
              content: {
                en: `Your order has been placed successfully`,
                ar: `تم تقديم طلبك بنجاح.`
              },
            recordId: order.id,
            type: 'order',
            userId: user.id,
            user: user,
        })

        return await this.ordersRepository.findOneById(order.id)
    }

    async findAll(query: QueryValue<GetAllOrdersDto>, pagination: Pagination): Promise<Order[]> {
        return await this.ordersRepository.findAll({
            filter: {
                where: {
                    ...query
                },
                relations: ['user'],
                order: {
                    createdAt: 'DESC'
                },
                ...pagination
            }
        })
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOneById(id)
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`)
        }
        return order
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id)
        const user = await this.userService.getMe(order.user.id)
        if(updateOrderDto.driverId){
            if(!order.driver) {
                updateOrderDto.driver = {id: updateOrderDto.driverId}
                updateOrderDto.status = OrderStatus.outForDelivery
                await this.orderCodeService.createOrderCode({ order, user }, updateOrderDto.estimatedDeliveryTime)
            }
            delete updateOrderDto.driverId;
        }
        if(updateOrderDto.status === OrderStatus.delivered){
            updateOrderDto.deliveredAt = new Date()
        }
        return await this.ordersRepository.update(id, updateOrderDto as any)
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id)
        await this.ordersRepository.delete(id)
    }

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        await this.findOne(orderId)
        return await this.orderItemRepository.findAll({
            filter: {
                where: {
                    order: { id: orderId }
                }
            }
        })
    }
} 
