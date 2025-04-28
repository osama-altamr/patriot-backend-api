import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserRole } from '/users/api/enums/user.enum'
import { RefreshToken } from './refresh-token.entity'
import { Permission } from './permission.entity'
import { CommonEntity } from './common.entity'
import { Complaint } from './complaint.entity'

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: "text"})
  name: string

  @Column({ type: "text" })
  email: string

  @Column({ type: "text" })
  password: string

  @Column({ type: "text", nullable: true  })
  fcmToken: string

  @Column({ type: "text", default: UserRole.user })
  role: UserRole

  @Column({ type: "varchar", nullable: true  })
  photoUrl: string

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[]

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[]
  
  // if role => Admin
  @OneToMany(() => Complaint, (complaint) => complaint.closedBy)
  closedComplaints: Complaint[]

  @Column({ default: true })
  isActive: boolean
}

export abstract class IUser {
  id: string
  role: UserRole 
  email: string
  password: string
  name?: string
  photoUrl?: string
  phoneNumber?: string
  fcmToken?: string
  refreshTokens?: RefreshToken[]
}