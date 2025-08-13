import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Product, IProduct } from './product.entity'
import { CommonEntity } from './common.entity'
import { IUser, User } from './user.entity'

@Entity()
export class ProductReview extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    nullable: true,
  })
  title?: string

  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string

  @Column({ type: 'smallint' })
  rating: number

  @ManyToOne(() => Product, (product) => product.reviews, { 
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product

   @ManyToOne(() => User)
   user: User
}

export abstract class IProductReview {
  id: string
  title?: string
  comment?: string
  rating: number
  product?: IProduct
  user?: IUser
}