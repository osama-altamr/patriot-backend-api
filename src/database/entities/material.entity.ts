import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { MaterialType } from '/materials/api/enums/material.enum'

@Entity()
export class Material extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb' }) 
  name: object

  @Column({ type: 'jsonb' }) 
  description: object 

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

  @Column({
    type: 'decimal',
    nullable: true
   })
   quantity?: number

   @Column({
    type: 'text',
    nullable: true
   })
   type?: MaterialType

   @Column({
    type: 'text',
    nullable: true
   })
   location?: string
}

export abstract class IMaterial {
  id: string;
  name: object
  description?: object
  imageUrl?: string
  height?: number
  width?: number
  quantity?: number
  type: MaterialType
  location?: string
}