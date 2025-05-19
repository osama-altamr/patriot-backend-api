import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../../../database/entities/order.entity'
import { BaseRepository } from 'src/database/repositories/base.repository'

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository)
    }

    async findOneById(id: string): Promise<Order> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: {
                user: true,
                items: {
                    product: true,
                    category: true
                }
            }
        })
    }
} 