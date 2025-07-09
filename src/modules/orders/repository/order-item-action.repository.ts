import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemAction, User } from "src/database";
import { BaseRepository } from "src/database/repositories/base.repository";
import { Repository } from "typeorm";

@Injectable()
export class OrderItemActionRepository extends BaseRepository<OrderItemAction> {
    constructor(
        @InjectRepository(OrderItemAction)
        private readonly orderItemActionRepository: Repository<OrderItemAction>
    ) {
        super(orderItemActionRepository)
    }
  async getStatsForSingleEmployee(
    employee: User, 
    startDate: Date, 
    endDate: Date
  ) {
    
    const stats = await this.orderItemActionRepository
      .createQueryBuilder('action')
      
      .select('COUNT(action.id)', 'totalCompletedItems')
      
      .addSelect('AVG(EXTRACT(EPOCH FROM (action.endsAt - action.startsAt)))', 'averageDurationSeconds')
      .where('action.employee_id = :employeeId', { employeeId: employee.id })
      .andWhere('action.endsAt IS NOT NULL')
      .andWhere('action.startsAt IS NOT NULL')
      .andWhere('action.endsAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    if (!stats || !stats.totalCompletedItems || parseInt(stats.totalCompletedItems, 10) === 0) {
      return {
        totalCompletedItems: 0,
        averageItemCompletionTimeMinutes: null,
      };
    }

    const totalCompletedItems = parseInt(stats.totalCompletedItems, 10);
    const averageDurationSeconds = parseFloat(stats.averageDurationSeconds);
    const averageItemCompletionTimeMinutes = Math.round(averageDurationSeconds / 60);
    return {
      totalCompletedItems,
      averageItemCompletionTimeMinutes,
    };
  }
}