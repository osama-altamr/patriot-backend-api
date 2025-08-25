import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Category, OrderItem, OrderStatus } from '../../../database';
import {  } from '../../../database';
import { LocalizedString } from '@Package/api';
import { OrderItemRepository } from '/orders/repository/order-item.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
    @Inject(forwardRef(() => OrderItemRepository))
    private readonly orderItemRepo: OrderItemRepository,
  ) {
    super(repository);
  }
      async getAllCategories(search?: string) {
        const queryBuilder = this.repository.createQueryBuilder('category');
        if (search) {
            const searchTerm = `%${search}%`;
            queryBuilder.where(
              `(LOWER(category.name->>'en') LIKE LOWER(:search) OR LOWER(category.name->>'ar') LIKE LOWER(:search))`,
              { search: searchTerm }
            );
        }
        const [data, total] = await queryBuilder.getManyAndCount();
    
        return { results: data, total: total }; 
    }
    async generateSalesBreakdownByCategory(startDate: Date, endDate: Date): Promise<{
      categoryId: string;
      categoryName: LocalizedString;
      quantitySold: number;
      totalRevenue: number;
      id: string
    }[]> {
      const queryBuilder = this.orderItemRepo.repository.createQueryBuilder('orderItem');
  
      queryBuilder
        // Join to the Category table to get its ID and name
        .innerJoin('orderItem.category', 'category')
        // Join to the Order table to filter by date and status
        .innerJoin('orderItem.order', 'order')
  
        // Select the aggregated data
        .select('category.id', 'categoryId')
        .addSelect('category.name', 'categoryName')
        .addSelect('COUNT(orderItem.id)', 'quantitySold')
        .addSelect('SUM(orderItem.price)', 'totalRevenue')
  
        // Filter by the order's creation date
        .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        
        // IMPORTANT: Only include items from completed or delivered orders
        .andWhere('order.status IN (:...statuses)', {
          statuses: [OrderStatus.completed, OrderStatus.delivered]
        })
        
        // Group the results by category to aggregate the data correctly
        .groupBy('category.id, category.name')
        
        // Optional: Order by the highest revenue to see top-performing categories first
        .orderBy('"totalRevenue"', 'DESC');
  
      const breakdown = await queryBuilder.getRawMany();
      
      // The raw result needs to be parsed into the correct types
      return breakdown.map(item => ({
        id: randomUUID(),
        categoryId: item.categoryId,
        categoryName: item.categoryName, // This should be the JSONB object
        quantitySold: parseInt(item.quantitySold, 10) || 0,
        totalRevenue: Number(parseFloat(item.totalRevenue).toFixed(2)) || 0,
      }));
    }
}
