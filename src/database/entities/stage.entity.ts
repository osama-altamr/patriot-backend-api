import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IUser, User } from './user.entity'
import { CommonEntity } from './common.entity'

@Entity()
export class Stage extends CommonEntity {
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
}

export abstract class IStage {
  id: string
  name: object
  description: object
  imageUrl: string
}