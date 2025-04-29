import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category, ICategory } from './category.entity'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'

@Entity()
export class Product extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb' }) 
  name: LocalizedString

  @Column({ type: 'jsonb' }) 
  description: LocalizedString 

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl?: string

  @Column({
   type: 'decimal'
  })
  height?: number
 
  @Column({
   type: 'decimal'
  })
  width?: number

  @ManyToOne(() => Category, (category) => category.products)
  category: Category
}

export abstract class IProduct {
  id: string;
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  category?: ICategory
}