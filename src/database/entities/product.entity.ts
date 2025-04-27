import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category, ICategory } from './category.entity'
import { CommonEntity } from './common.entity'

@Entity()
export class Product extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb' }) 
  name: object

  @Column({ type: 'jsonb' }) 
  description: boolean 

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

  @Column({ type: 'uuid' }) 
  categoryId?: string

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' }) 
  category: Category
}

export abstract class IProduct {
  id: string;
  name: object
  description?: object
  imageUrl?: string
  height?: number
  width?: number
  categoryId?: string
  category?: ICategory
}