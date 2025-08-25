import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository, OrderItem, OrderStatus, Product } from '../../../database';
import { OrderItemRepository } from '/orders/repository/order-item.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
    @Inject(forwardRef(() => OrderItemRepository))
    private readonly orderItemRepo: OrderItemRepository,
  ) {
    super(repository);
  }
  async findAllWithPop(categoryId: string) {
    const query: FindOptionsWhere<Product> = {}
    if(categoryId) {
      query.category = { id: categoryId }
    }
    return await this.findAll({
    
      filter: {
        where: query,
        relations: ['category', 'stages'],
      }
    })
  }

  async findOneByIdWithPop(id: string){
    return this.repository.findOne({ where: {id}, relations: ['category', 'stages'], } as any)
  }

  async updateManyToMany(data: any){
    return this.repository.save(data)
  }
  

  async generateSalesBreakdownByProduct(startDate: Date, endDate: Date): Promise<any[]> {
    const queryBuilder = this.orderItemRepo.repository.createQueryBuilder('orderItem');
    
    // ... your existing query builder logic ...
    queryBuilder
      .innerJoin('orderItem.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('COUNT(orderItem.id)', 'quantitySold')
      .addSelect('SUM(orderItem.price)', 'totalRevenue')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.completed, OrderStatus.delivered]
      })
      .groupBy('product.id, product.name')
      .orderBy('"totalRevenue"', 'DESC');

    const breakdown = await queryBuilder.getRawMany();
    
    return breakdown.map(item => ({
      id: randomUUID(),
      productId: item.productId,
      productName: item.productName,
      quantitySold: parseInt(item.quantitySold, 10) || 0,
      totalRevenue: Number(parseFloat(item.totalRevenue).toFixed(2)) || 0,
    }));
  }
}
