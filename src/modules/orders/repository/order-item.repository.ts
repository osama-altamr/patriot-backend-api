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
            console.log(query)
          return await this.repository.findOne({
            where: { ...query },
            relations: ['stages', 'stagePattern', 'currentStage', 'order', 'orderItemActions.stage'],
          });
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
      async findOneByIdWithPop(id: string): Promise<OrderItem | null> {
        if (!id) {
            console.log('Empty ID provided');
            return null;
        }
    
        console.log('Searching for ID:', id, 'Type:', typeof id);
    
        // First try a simple find without relations to verify the item exists
        const simpleFind = await this.repository.findOne({ where: { id } });
        console.log('Simple find result:', simpleFind);
    
        if (!simpleFind) {
            console.log('Item not found with simple query');
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
    
        console.log("Final SQL query:", queryBuilder.getSql());
        console.log("Parameters:", queryBuilder.getParameters());
        
        const result = await queryBuilder.getOne();
        console.log("Query result:", result);
        
        return result;
    }
}