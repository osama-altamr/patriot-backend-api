import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderCode } from "src/database/entities/order-code.entity";
import { BaseRepository } from "src/database/repositories/base.repository";
import { Repository } from "typeorm";

@Injectable()
export class OrderCodeRepository extends BaseRepository<OrderCode> {
    constructor(
        @InjectRepository(OrderCode)
        private readonly OrderCodeRepository: Repository<OrderCode>
    ) {
        super(OrderCodeRepository)
    }
}