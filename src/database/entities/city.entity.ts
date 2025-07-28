// FILE: src/database/entities/city.entity.ts

import { Entity, Column, ObjectIdColumn,  ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { State } from './state.entity'

@Entity()
export class City extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'stateId' })
  state: State

  @Column({ type: "json" })
  name: LocalizedString

  @Column({ type: 'boolean', default: true })
  isActive: boolean
}

export abstract class ICity {
  id: string
  stateId?: string
  state: State
  name: LocalizedString
  isActive: boolean
}