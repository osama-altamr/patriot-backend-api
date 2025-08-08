import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, FindManyOptions, Repository } from 'typeorm'
import { Order, OrderStatus } from '../../../database/entities/order.entity'
import { BaseRepository } from 'src/database/repositories/base.repository'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
import { User } from 'src/database'

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository)
    }

     async getStatsForSingleDriver(
      driver: User,
      startDate: Date,
      endDate: Date
    ) {
  
      const queryBuilder = this.orderRepository.createQueryBuilder('order');

      const [deliveredOrders, totalDeliveredOrders] = await queryBuilder
        .where('order.driver_id = :driverId', { driverId: driver.id })
        .andWhere('order.status = :status', { status: OrderStatus.delivered })
        .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .getManyAndCount();
  
      let averageDeliveryTimeMinutes: number | null = null;
      if (totalDeliveredOrders > 0) {
          const totalMilliseconds = deliveredOrders.reduce((sum, order) => {
              const deliveryTime = new Date(order.deliveredAt).getTime();
              const creationTime = new Date(order.createdAt).getTime();
              return sum + (deliveryTime - creationTime);
          }, 0);
          
          const averageMilliseconds = totalMilliseconds / totalDeliveredOrders;
          averageDeliveryTimeMinutes = Math.round(averageMilliseconds / 60000); // Convert ms to minutes
      }
      return {
        totalDeliveredOrders: totalDeliveredOrders,
        averageDeliveryTimeMinutes: averageDeliveryTimeMinutes,
      };
    }

    async findAllForUser(query: QueryValue<GetAllOrdersDto>, pagination: Pagination){
        const queryBuilder = this.orderRepository.createQueryBuilder('order');
        queryBuilder.leftJoinAndSelect('order.user', 'user');
        if (query.status) {
            queryBuilder.andWhere('order.status = :status', { status: query.status });
        }

        if (query.priority) {
            queryBuilder.andWhere('order.priority = :priority', { priority: query.priority });
        }

        if (pagination) {
            queryBuilder.skip(pagination.skip).take(pagination.take);
        }
        if (query.startDate) {
            queryBuilder.andWhere('order.createdAt >= :startDate', { startDate: query.startDate });
          }
      
          if (query.endDate) {
            queryBuilder.andWhere('order.createdAt <= :endDate', { endDate: query.endDate });
          }

          queryBuilder.orderBy('order.createdAt', 'DESC');
      
          console.log('Executing SQL:', queryBuilder.getSql())
          return await queryBuilder.getMany();
    }
    async findOneById(id: string): Promise<Order> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: {
                user: true,
                driver: true,
                items: {
                  stages: true,
                   product: true,
                    category: true,
                    currentStage: true,
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

    
  async generateOrderReport(startDate: Date, endDate: Date){
    
    
    const summaryQuery = this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'totalOrders')       
    //   .addSelect('SUM(order.price)', 'totalRevenue') 
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const breakdownQuery = this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')      
      .addSelect('COUNT(order.id)', 'count')  
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('order.status')      
      .getRawMany(); 

    // 3. الاستعلام الثالث: للحصول على قائمة الطلبات الكاملة في هذه الفترة
    const ordersQuery = this.orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    

    const [summary, breakdownByStatus, orders] = await Promise.all([
      summaryQuery,
      breakdownQuery,
      ordersQuery,
    ]);
    
   
    return {
       orderSummary: {
        totalOrders: parseInt(summary.totalOrders, 10) || 0,
        totalRevenue: parseFloat(summary.totalRevenue) || 0,
        startDate,
        endDate,
      },
      orderBreakdownByStatus: breakdownByStatus.map(item => ({
        ...item,
        count: parseInt(item.count, 10)
      })),
      orders,
    };
  }
} 