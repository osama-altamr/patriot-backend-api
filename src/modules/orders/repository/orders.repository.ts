import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, DataSource, FindManyOptions, Repository } from 'typeorm'
import { Order, OrderStatus } from '../../../database/entities/order.entity'
import { BaseRepository } from 'src/database/repositories/base.repository'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
import { City, OrderCode, OrderItem, OrderItemAction, State, User } from 'src/database'

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        private readonly dataSource: DataSource,
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
        queryBuilder.leftJoinAndSelect('order.driver', 'driver');
        queryBuilder.leftJoinAndSelect('order.items', 'items');
        queryBuilder.leftJoinAndSelect('items.product', 'product');
        queryBuilder.leftJoinAndSelect('items.category', 'category');
        queryBuilder.leftJoinAndSelect('items.currentStage', 'currentStage');
        queryBuilder.leftJoinAndSelect('items.stages', 'stages', null, { order: { order: 'ASC' } });
        queryBuilder.leftJoinAndSelect('items.material', 'material');
        queryBuilder.leftJoinAndSelect('items.stagePattern', 'stagePattern');

        if (query.status) {
            queryBuilder.andWhere('order.status = :status', { status: query.status });
        }

        if (query.driverId) {
          queryBuilder.andWhere('driver.id = :driverId', { driverId: query.driverId });
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

    async getAllAndCount(query: QueryValue<GetAllOrdersDto>, pagination: Pagination){
      const queryBuilder = this.orderRepository.createQueryBuilder('order');
      queryBuilder.leftJoinAndSelect('order.user', 'user');
      queryBuilder.leftJoinAndSelect('order.driver', 'driver');
      queryBuilder.leftJoinAndSelect('order.items', 'items');
      queryBuilder.leftJoinAndSelect('items.product', 'product');
      queryBuilder.leftJoinAndSelect('items.category', 'category');
      queryBuilder.leftJoinAndSelect('items.currentStage', 'currentStage');
      queryBuilder.leftJoinAndSelect('items.stages', 'stages');
      queryBuilder.leftJoinAndSelect('items.material', 'material');
      queryBuilder.leftJoinAndSelect('items.stagePattern', 'stagePattern');

      if (query.status) {
          queryBuilder.andWhere('order.status = :status', { status: query.status });
      }

      if (query.driverId) {
        queryBuilder.andWhere('driver.id = :driverId', { driverId: query.driverId });
      }

      if (query.priority) {
          queryBuilder.andWhere('order.priority = :priority', { priority: query.priority });
      }
      
      if (query.startDate) {
          queryBuilder.andWhere('order.createdAt >= :startDate', { startDate: query.startDate });
        }
    
        if (query.endDate) {
          queryBuilder.andWhere('order.createdAt <= :endDate', { endDate: query.endDate });
        }

        queryBuilder.orderBy('order.createdAt', 'DESC');
        queryBuilder.addOrderBy('stages.order', 'ASC');

        const [results, total] = await queryBuilder
          .skip(pagination.skip)
          .take(pagination.take)
          .getManyAndCount();
        
        return {
            results,
            total
        };
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
                  currentStage: true,
                  stages: true,
                  material: true,
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
      .addSelect('SUM(order.total)', 'totalRevenue') 
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
  
  async removeWithAllRelations(id: string): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const order = await transactionalEntityManager.findOne(Order, {
        where: { id },
        relations: ['items', 'items.orderItemActions'],
      });
      const itemIds = order.items.map((item) => item.id);
      const actionIds = order.items.flatMap((item) =>
        item.orderItemActions.map((action) => action.id),
      );

      // 3a. Delete ItemActions
      if (actionIds.length > 0) {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(OrderItemAction)
          .where('id IN (:...ids)', { ids: actionIds })
          .execute();
      }

      if (itemIds.length > 0) {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(OrderItem)
          .where('id IN (:...ids)', { ids: itemIds })
          .execute();
      }

      if (order) {
        try{ 
          await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(OrderCode)
          .where({ order: { id: order.id } })
          .execute();
        } catch(err) {

        }
      }

      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where({ id: id })
        .execute();
    });
  }

  async generateSalesSummary(startDate: Date, endDate: Date): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItemsSold: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder('order');

    queryBuilder
      .leftJoin('order.items', 'orderItem')
      
      .select('SUM(order.total)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT order.id)', 'totalOrders')
      .addSelect('COUNT(orderItem.id)', 'totalItemsSold')
      
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      
      .andWhere('order.status IN (:...statuses)', { 
        statuses: [OrderStatus.completed, OrderStatus.delivered] 
      });

    const summary = await queryBuilder.getRawOne();
    const totalRevenue = parseFloat(summary.totalRevenue) || 0;
    const totalOrders = parseInt(summary.totalOrders, 10) || 0;
    const totalItemsSold = parseInt(summary.totalItemsSold, 10) || 0;
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      totalItemsSold,
    };
  }

  async generateDailySalesTrend(startDate: Date, endDate: Date): Promise<{
    date: string;
    totalRevenue: number;
    orderCount: number;
  }[]> {
    const queryBuilder = this.repository.createQueryBuilder('order');

    queryBuilder
      .select("DATE_TRUNC('day', order.createdAt)", 'date')
      .addSelect('SUM(order.total)', 'totalRevenue')
      .addSelect('COUNT(order.id)', 'orderCount')
      
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { 
        statuses: [OrderStatus.completed, OrderStatus.delivered] 
      })
      
      .groupBy('date')
      .orderBy('date', 'ASC');

    const trendData = await queryBuilder.getRawMany();

    return trendData.map(day => ({
      date: new Date(day.date).toISOString().split('T')[0],
      totalRevenue: Number(parseFloat(day.totalRevenue).toFixed(2)) || 0,
      orderCount: parseInt(day.orderCount, 10) || 0,
    }));
  }



  async generateSalesBreakdownByState(startDate: Date, endDate: Date): Promise<any[]> {
    const queryBuilder = this.repository.createQueryBuilder('order')
      .innerJoin(State, 'state', "state.id = (order.address ->> 'stateId')::uuid")
      
      .select("state.id", "stateId")
      .addSelect("SUM(order.total)", "totalRevenue")
      .addSelect("COUNT(order.id)", "orderCount")
      
      // --- THE DEFINITIVE FIX: Use array_agg to pick the first JSONB object ---
      .addSelect("(array_agg(state.name))[1]", "stateName") 
      
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { 
        statuses: [OrderStatus.completed, OrderStatus.delivered] 
      })
      
      // Now, we can safely group ONLY by the unique identifier.
      .groupBy("state.id")
      
      .orderBy('"totalRevenue"', 'DESC');

    const rawData = await queryBuilder.getRawMany();
    return rawData.map(item => ({
      ...item,
      totalRevenue: Number(parseFloat(item.totalRevenue).toFixed(2)) || 0,
      orderCount: parseInt(item.orderCount, 10) || 0,
    }));
}

async generateSalesBreakdownByCity(startDate: Date, endDate: Date): Promise<any[]> {
  const queryBuilder = this.repository.createQueryBuilder('order')
    .innerJoin(City, 'city', "city.id = (order.address ->> 'cityId')::uuid")
    .innerJoin(State, 'state', "state.id = (order.address ->> 'stateId')::uuid")
    
    .select("city.id", "cityId")
    .addSelect("SUM(order.total)", "totalRevenue")
    .addSelect("COUNT(order.id)", "orderCount")
    
    // --- THE DEFINITIVE FIX: Apply the same array_agg pattern here ---
    .addSelect("(array_agg(city.name))[1]", "cityName")
    .addSelect("(array_agg(state.name))[1]", "stateName")
    
    .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
    .andWhere('order.status IN (:...statuses)', { 
      statuses: [OrderStatus.completed, OrderStatus.delivered] 
    })
    
    .groupBy("city.id, state.id")
    
    .orderBy('"totalRevenue"', 'DESC');

  const rawData = await queryBuilder.getRawMany();
  return rawData.map(item => ({
    ...item,
    totalRevenue: Number(parseFloat(item.totalRevenue).toFixed(2)) || 0,
    orderCount: parseInt(item.orderCount, 10) || 0,
  }));
}
} 