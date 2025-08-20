import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { IUser, User } from './user.entity'
import { OrderItem } from './order-item.entity'
import { State } from './state.entity'
import { City } from './city.entity'

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
}

export enum OrderType {
  custom = 'custom',
  static = 'static'
}

export interface IAddress {
  stateId: string
  state: State
  cityId?: string
  city: City
  street1: string
  street2?: string
  postalCode: string
  apartment?: string
  complex?: string
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

  @Column({ type: "json", nullable: true  })
  address: IAddress
  

  @Column({ type: 'timestamp', nullable: true })
  outForDeliveryAt: Date; 

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User

  @Column({ type: 'decimal', nullable: true })
  total: number

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
  outForDeliveryAt?: Date; 
  deliveredAt?: Date;
  address: IAddress
  total?: number
}