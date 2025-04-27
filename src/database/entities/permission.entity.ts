import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IUser, User } from './user.entity'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 }) 
  feature: string

  @Column({ type: 'boolean', default: false }) 
  write: boolean 

  @Column({ type: 'boolean', default: true }) 
  read: boolean 

  @Column({ type: 'varchar', length: 50 }) 
  accessType: string 

  
  @Column({ type: 'uuid' }) 
  userId: string

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'userId' }) 
  user: User
}

export abstract class IPermission {
  id: string
  feature: string
  write: boolean 
  read: boolean  
  accessType: string 
  userId?: string
  user?: IUser
}