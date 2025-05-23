import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { OrderItem } from './order-item.entity'

@Entity()
export class Stage extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "jsonb" })
  name: LocalizedString

  @Column({ type: "jsonb" , nullable: true })
  description?: LocalizedString

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl?: string

  @Column({ 
    type: 'integer',
    nullable: true,
  })
  estimatedTimeMinutes?: number

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.stages)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;
}

export abstract class IStage {
  id: string
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
}