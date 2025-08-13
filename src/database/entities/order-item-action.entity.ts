import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { CommonEntity } from './common.entity'
import { User } from './user.entity'
import { Stage } from './stage.entity'
import { OrderItem } from './order-item.entity'

@Entity('order_item_actions')
export class OrderItemAction extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => OrderItem)
    @JoinColumn({ name: 'order_item_id' })
    orderItem: OrderItem[]

    @ManyToOne(() => User)
    @JoinColumn({ name: 'employee_id' })
    employee: User

    @ManyToOne(() => Stage)
    @JoinColumn({})
    stage: Stage

    @Column({ nullable: true })
    startsAt: Date | null;

    @Column({ nullable: true })
    endsAt: Date | null;
}

export abstract class IOrderItemAction {
    id: string
    orderItem: OrderItem
    employee: User
    stage: Stage
    startsAt: Date | null
    endsAt: Date | null
} 