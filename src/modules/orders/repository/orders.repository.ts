import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../../../database/entities/order.entity'
import { BaseRepository } from 'src/database/repositories/base.repository'
import { OrderStatus } from 'aws-sdk/clients/outposts'

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
                driver: true,
                items: {
                    product: true,
                    category: true,
                    stages: true
                }
            }
        })
    }
    async getStatusGroups(userId: string) {
        const statusGroups = await this.orderRepository
        .createQueryBuilder('o')
        .select('o.status', 'status')
        .addSelect('COUNT(o.id)', 'count')
        .where('o.user_id = :userId', { userId })
        .groupBy('o.status')
        .getRawMany<{ status: OrderStatus; count: string }>();
    
      return statusGroups
    }
} 