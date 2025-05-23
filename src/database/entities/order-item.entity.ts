import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { CommonEntity } from './common.entity'
import { Order } from './order.entity'
import { Category } from './category.entity'
import { Product } from './product.entity'
import { Stage } from './stage.entity'
import { OrderItemAction } from './order-item-action.entity'

export enum OrderItemStatus {
    pending = 'pending',
    inProgress = 'inProgress',
    completed = 'completed'
}

@Entity('order_items')
export class OrderItem extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category

    @Column({ type: 'int' })
    width: number

    @Column({ type: 'int' })
    height: number

    @Column({
        type: 'enum',
        enum: OrderItemStatus,
        default: OrderItemStatus.pending
    })
    status: OrderItemStatus

    @Column({ type: 'text', nullable: true })
    qrCode: string

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product
    
    @OneToMany(() => Stage, (stage) => stage.orderItem, {
        cascade: true,
        eager: true,
      })
    stages: Stage[];

    @ManyToOne(()=> Stage)
    @JoinColumn({ name: 'current_stage_id' })
    currentStage: Stage

    @Column({ type: 'int' })
    price: number

    @OneToMany(() => OrderItemAction, (orderItemAction) => orderItemAction.orderItem)
    orderItemActions: OrderItemAction[]
}

export abstract class IOrderItem {
    id: string
    order: string
    category: string
    width: number
    height: number
    status: OrderItemStatus
    qrCode: string
    product: string
    price: number
} 