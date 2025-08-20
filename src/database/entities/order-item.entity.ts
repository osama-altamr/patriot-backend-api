import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm'
import { CommonEntity } from './common.entity'
import { Order } from './order.entity'
import { Category } from './category.entity'
import { Product } from './product.entity'
import { Stage } from './stage.entity'
import { OrderItemAction } from './order-item-action.entity'
import { Material } from './material.entity'
import { StagePattern } from './stage-pattern.entity'

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

    @ManyToMany(() => Stage) 
    @JoinTable({
        name: 'order_item_stages', 
        joinColumn: { name: 'order_item_id' },
        inverseJoinColumn: { name: 'stage_id' }
    })
    stages: Stage[];

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
    
    @Column({ type: 'text', nullable: true })
    note: string

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product
    
    @ManyToOne(() => Material)
    @JoinColumn({ name: 'material_id' })
    material: Material

    @ManyToOne(() => StagePattern)
    @JoinColumn({ name: 'stage_pattern_id' })
    stagePattern: StagePattern

    @ManyToOne(()=> Stage)
    @JoinColumn({ name: 'current_stage_id' })
    currentStage: Stage | null

    @Column({ type: 'decimal', nullable: true })
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
    note?: string
    material: Material
    stagePattern?: StagePattern
} 