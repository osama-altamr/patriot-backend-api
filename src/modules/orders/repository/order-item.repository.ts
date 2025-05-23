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
    async findOneBy(query: object) {
        try {
            console.log(query)
          return await this.repository.findOne({
            where: { ...query },
            relations: ['stages', 'currentStage'],
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
      async findOneByIdWithPop(id: string) {
        return this.repository.findOne({
            where: { id },
            relations: ['stages', 'currentStage', 'orderItemActions.stage'],
        })
      }
    

}