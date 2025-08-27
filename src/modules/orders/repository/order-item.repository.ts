import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItem } from "src/database/entities/order-item.entity";
import { BaseRepository } from "src/database/repositories/base.repository";
import { EntityPropertyNotFoundError, Repository } from "typeorm";

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
    
    constructor(
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ) {
        super(orderItemRepository)
    }

   async save(item: object){
      await this.orderItemRepository.save(item)
    }
  
    async findOneBy(query: object) {
      try {
          return await this.repository
              .createQueryBuilder('orderItem')
              .leftJoinAndSelect('orderItem.stages', 'stages', null, { order: { order: 'ASC' } }) // Order stages
              .leftJoinAndSelect('orderItem.stagePattern', 'stagePattern')
              .leftJoinAndSelect('orderItem.currentStage', 'currentStage')
              .leftJoinAndSelect('orderItem.order', 'order')
              .leftJoinAndSelect('order.user', 'user')
              .leftJoinAndSelect('order.driver', 'driver')
              .leftJoinAndSelect('orderItem.orderItemActions', 'orderItemActions')
              .leftJoinAndSelect('orderItemActions.stage', 'actionStage')
              .leftJoinAndSelect('orderItem.category', 'category')
              .leftJoinAndSelect('orderItem.product', 'product')
              .leftJoinAndSelect('orderItem.material', 'material')
              .where(query)
              .getOne();
      } catch (error) {
          if (error instanceof EntityPropertyNotFoundError) {
              return await this.repository.findOne({
                  where: { ...query }
              });
          }
          throw error;
      }
  }
    async  findAllWithPop(query: object){
        return this.repository.find({
          where: query,
          relations: {
            stages: true,
            currentStage: true,
            orderItemActions: {
              stage: true
            },
            stagePattern: true,
            product: true,
            category: true,
            material: true,
            order: true,
          },
          order: {
            createdAt: 'DESC', 
            stages: {
                order: 'ASC',
            },
            orderItemActions: {
                createdAt: 'ASC'
            }
        },
          }) 
      }
      async  findAllWithOrder(query: object){
        return this.repository.find({
          where: query,
          relations: {
            order: true,
          },
          }) 
      }
      
      async findOneByIdWithPop(id: string): Promise<OrderItem | null> {
        if (!id) {
            return null;
        }
    
        const simpleFind = await this.repository.findOne({ where: { id } });
        if (!simpleFind) {
            return null;
        }
    
        // Now try the complex query
        const queryBuilder = this.repository
            .createQueryBuilder('orderItem')
            .leftJoinAndSelect('orderItem.stages', 'stage')
            .leftJoinAndSelect('orderItem.currentStage', 'currentStage')
            .leftJoinAndSelect('orderItem.orderItemActions', 'action')
            .leftJoinAndSelect('action.stage', 'actionStage')
            .leftJoinAndSelect('orderItem.product', 'product')
            .leftJoinAndSelect('orderItem.category', 'category')
            .leftJoinAndSelect('orderItem.material', 'material')
            .leftJoinAndSelect('orderItem.stagePattern', 'stagePattern')
            .where('orderItem.id = :id', { id })
            .orderBy('stage.order', 'ASC')
            .addOrderBy('action.createdAt', 'ASC');
    
        const result = await queryBuilder.getOne();
        return result;
    }
}