import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IUser, User } from './user.entity'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar'}) 
  feature: string

  @Column({ type: 'boolean' }) 
  write: boolean 

  @Column({ type: 'boolean' }) 
  read: boolean 

  @Column({ type: 'varchar' }) 
  accessType: string 
  
  @ManyToOne(() => User, (user) => user.permissions)
  user: User
}

export abstract class IPermission {
  id: string
  feature: string
  write: boolean 
  read: boolean  
  accessType: string 
  user: IUser
}