import { Injectable, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderDto, CreateOrderItemDto } from '../api/dto/create-order.dto'
import { UpdateOrderDto } from '../api/dto/update-order.dto'
import { Order } from '../../../database/entities/order.entity'
import { IOrderItem, OrderItem, OrderItemStatus } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { ProductService } from '../../products/services/product.service'
import { SaveOptions, RemoveOptions } from 'typeorm'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly productService: ProductService
    ) { }

    async create(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
        const order = await this.ordersRepository.create({
            ...createOrderDto,
            user: { id: user.id } as any
        } as any) as Order
        for (const item of createOrderDto.items) {
            await this.createOrderItem(order.id, item)
        }
        return order
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
        return await this.ordersRepository.update(id, updateOrderDto)
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id)
        await this.ordersRepository.delete(id)
    }

    async createOrderItem(orderId: string, orderItemData: CreateOrderItemDto): Promise<OrderItem> {
        const product = await this.productService.getProduct(orderItemData.productId)
        await this.findOne(orderId)
        const orderItem = {
            ...orderItemData,
            order: { id: orderId } as any,
            product: product.id,
            category: product.category.id,
            status: OrderItemStatus.PENDING,
            qrCode: '',
            price: 0,
        }
        return await this.orderItemRepository.create(orderItem as any) as OrderItem
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