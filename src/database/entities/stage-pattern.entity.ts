import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { Stage } from '.'

@Entity()
export class StagePattern extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "jsonb" })
  title: LocalizedString

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl: string

  @ManyToOne(() => Stage, (stage) => stage.patterns, {
    onDelete: 'CASCADE'
  })
  stage: Stage
}

export abstract class IStagePattern {
  id: string
  title: LocalizedString
  imageUrl: string
}