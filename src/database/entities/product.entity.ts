import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { Category, ICategory } from './category.entity'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { ProductReview } from './product-review.entity'
import { Stage } from './stage.entity'

@Entity()
export class Product extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb' }) 
  name: LocalizedString

  @Column({ type: 'jsonb', nullable: true }) 
  description: LocalizedString 

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl?: string

  @Column({
   type: 'decimal',
   nullable: true
  })
  height?: number
 
  @Column({
   type: 'decimal',
   nullable: true
  })
  width?: number

  @ManyToOne(() => Category, (category) => category.products)
  category: Category

  @ManyToMany(() => Stage, (stage) => stage.products)
  @JoinTable()
  stages: Stage[]

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[]

  ratingsAverage?: number
  ratingsQuantity?: number
}

export abstract class IProduct {
  id: string;
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
  height?: number
  width?: number
  category?: ICategory
  stages: Stage[]

  ratingsQuantity?: number
  ratingsAverage?: number
}