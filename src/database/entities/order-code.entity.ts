import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { CommonEntity } from './common.entity'
import { IOrder, Order } from './order.entity'
import { Product } from './product.entity'
import { IUser, User } from './user.entity'

@Entity('order_codes')
export class OrderCode extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order

    @Column({ type: 'varchar', nullable: true })
    code: string | null

    @Column({ name: 'expires_at', nullable: true })
    expiresAt: Date

    @Column({ name: 'verified_at', nullable: true })
    verifiedAt: Date

    @Column({ type: 'boolean', default: false })
    isVerified: boolean

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User
}

export abstract class IOrderCode {
    id: string
    order: IOrder
    code: string | null
    expiresAt: Date
    user: IUser
    isVerified: boolean
} 