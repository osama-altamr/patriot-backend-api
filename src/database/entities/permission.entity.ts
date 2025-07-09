import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IUser, User } from './user.entity'
import { PermissionAccessType, PermissionFeature } from '/permissions/api/enums/permission.enum'
import { CommonEntity } from './common.entity'

export interface IScope {
  feature: string,
  read: boolean
  write: boolean
}
@Entity()
export class Permission extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb', nullable: true }) 
  scopes: IScope[]

  @Column({ type: 'varchar' }) 
  accessType: string 
  
  @ManyToOne(() => User, (user) => user.permissions)
  user: User
}

export abstract class IPermission {
  id: string
  scopes: IScope[]
  accessType: PermissionAccessType
  user: IUser
}