import { Injectable, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderDto, CreateOrderItemDto } from '../api/dto/create-order.dto'
import { UpdateOrderDto } from '../api/dto/update-order.dto'
import { Order } from '../../../database/entities/order.entity'
import { IOrderItem, OrderItem, OrderItemStatus } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { ProductService } from '../../products/services/product.service'
import { SaveOptions, RemoveOptions, Not, IsNull } from 'typeorm'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
import { MailerService } from '/mailer/services/mailer.service'
import { NotificationService } from '/notifications/services/notification.service'
import { UserService } from '/users/services/user.service'
import { OrderCodeService } from './order-code.service'
import { QrcodeService } from './qrcode.service'
import { StageService } from '/stages/services/stage.service'
import { StageRepository } from '/stages/repository/stage.repository'
import { UpdateOrderItemDto } from '../api/dto/update-order-item.dto'
import { OrderItemActionRepository } from '../repository/order-item-action.repository'
import { OrderItemService } from './order-items.service'
@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly orderItemService: OrderItemService,
        private readonly userService: UserService,
        private readonly orderCodeService: OrderCodeService,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const user = await this.userService.getMe(createOrderDto.userId)
        const order = await this.ordersRepository.create({
            ...createOrderDto,
            user,
        } as any) as Order
        for (const item of createOrderDto.items) {
            console.log(order)
            await this.orderItemService.createOrderItem(order.id, item)
        }
        // await this.notificationService.createNotification({
        //     title: {
        //         en: 'test',
        //         ar: 'test',
        //     },
        //     content: {
        //         en: 'test',
        //         ar: 'test',
        //     },
        //     recordId: order.id,
        //     type: 'order',
        //     userId: createOrderDto.userId
        // })

        //
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
                await this.orderCodeService.createOrderCode({ order, user })
            }
            delete updateOrderDto.driverId;
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
