import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { IUser, User } from './user.entity'
import { Product } from './product.entity'
import { CommonEntity } from './common.entity'

@Entity()
export class Category extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: "jsonb"})
  name: object

  @Column({type: "jsonb"})
  description?: object

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl?: string

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}

export abstract class ICategory {
  id: string
  name: object
  description: object
  imageUrl: string
}