import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { IUser, User } from './user.entity'
import { Product } from './product.entity'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'

@Entity()
export class Category extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: "jsonb"})
  name: LocalizedString

  @Column({type: "jsonb"})
  description?: LocalizedString

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
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
}