import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { IUser, User } from './user.entity'
import { OrderItem } from './order-item.entity'

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity()
export class Order extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: OrderPriority,
    default: OrderPriority.MEDIUM
  })
  priority: OrderPriority

  @Column({
    type: 'text',
    nullable: true
  })
  note: string

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

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
}