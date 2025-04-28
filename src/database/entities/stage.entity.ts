import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'

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
}

export abstract class IStage {
  id: string
  name: LocalizedString
  description?: LocalizedString
  imageUrl?: string
}