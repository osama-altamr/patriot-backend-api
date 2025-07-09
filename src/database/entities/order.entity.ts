import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { IUser, User } from './user.entity'
import { OrderItem } from './order-item.entity'

export enum OrderStatus {
  pending = 'pending',
  inProgress = 'in-progress',
  completed = 'completed',
  cancelled = 'cancelled',
  delivered = 'delivered',
  outForDelivery = 'out-for-delivery',
}

export enum OrderPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent'
}

export enum OrderType {
  custom = 'custom',
}


@Entity()
export class Order extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: OrderPriority,
    default: OrderPriority.medium
  })
  priority: OrderPriority

  @Column({
    type: 'text',
    nullable: true
  })
  note: string

  @Column({
    type: 'text',
    nullable: true
  })
  ref: string
  
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.pending
  })
  status: OrderStatus

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryTime: Date; 

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[]
}

export abstract class IOrder {
  id: string
  priority: OrderPriority
  note?: string
  status: OrderStatus
  user?: IUser
  items?: OrderItem[]
  driver?: IUser
  estimatedDeliveryTime?: Date; 
  deliveredAt?: Date;
}