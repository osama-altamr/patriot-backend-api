import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemAction } from "src/database";
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
}