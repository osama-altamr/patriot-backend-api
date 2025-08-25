import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository, OrderItem, OrderStatus, Product } from '../../../database';
import { OrderItemRepository } from '/orders/repository/order-item.repository';
import { randomUUID } from 'crypto';
import { QueryValue, Pagination } from '@Package/api';
import { GetAllProductsDto } from '../api/dto/request/get-all.dto';

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
  async findAllWithPop(query: QueryValue<GetAllProductsDto>, pagination: Pagination) {
    console.log(query)  
    const queryBuilder: FindOptionsWhere<Product> = {}
    console.log(query)
    if(query.categoryId) {
      queryBuilder.category = { id: query.categoryId }
    }
    return await this.findAll({
      filter: {
        where: queryBuilder,
        relations: ['category', 'stages'],
        skip: pagination.skip,
        take: pagination.take,
      },
    })
  }


  async getAllWithTotal(query: QueryValue<GetAllProductsDto>, pagination: Pagination) {
    const queryBuilder = this.repository.createQueryBuilder('product');
    
    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.leftJoinAndSelect('product.stages', 'stages');
    
    if (query.categoryId) {
      queryBuilder.where('category.id = :categoryId', { categoryId: query.categoryId });
    }
    
    queryBuilder.skip(pagination.skip);
    queryBuilder.take(pagination.take);
    
    const [data, total] = await queryBuilder.getManyAndCount();
  
    return { results: data, total };
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
