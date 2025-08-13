
import { Entity, Column, ObjectIdColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { City } from './city.entity'

@Entity()
export class State extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "json" })
  name: LocalizedString

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @OneToMany(() => City, (city) => city.state)
  cities: City[]
}

export abstract class IState {
  id: string
  name: LocalizedString
  isActive: boolean
}