import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { Order } from './order.entity'
import { Category } from './category.entity'
import { Product } from './product.entity'

export enum OrderItemStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
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
        default: OrderItemStatus.PENDING
    })
    status: OrderItemStatus

    @Column({ type: 'varchar', length: 60 })
    qrCode: string

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product

    @Column({ type: 'int' })
    price: number
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