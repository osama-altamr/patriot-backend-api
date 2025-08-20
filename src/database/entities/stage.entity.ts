import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, OneToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { OrderItem } from './order-item.entity'
import { Product } from './product.entity'
import { StagePattern } from './stage-pattern.entity'

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

  @Column({ type: 'int',  nullable: true })
  order: number;

  @Column({ 
    type: 'integer',
    nullable: true,
  })
  estimatedTimeMinutes?: number

  @ManyToMany(() => Product, (product) => product.stages)
  products: Product[];

  @OneToMany(() => StagePattern, (pattern) => pattern.stage)
  patterns
}

export abstract class IStage {
  id: string
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  order?: number
}