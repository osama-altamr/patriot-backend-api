import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { MaterialType } from '/materials/api/enums/material.enum'
import { ComplaintStatus } from '/complaints/api/enums/complaint.enum'
import { IUser, User } from './user.entity'

@Entity()
export class Complaint extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' }) 
  description: string 

  @Column({
    type: 'varchar',
    nullable: true
  })
  fileUrl?: string

   @Column({
    type: 'text'
   })
   status?: ComplaintStatus

   @Column({ type: 'uuid' }) 
   userId: string
 
   @ManyToOne(() => User, (user) => user.complaints)
   @JoinColumn({ name: 'userId' }) 
   user: User


   @Column({ type: 'uuid' }) 
   closedById: string
 
   @ManyToOne(() => User, (user) => user.complaints)
   @JoinColumn({ name: 'closedById' }) 
   closedBy: User
}

export abstract class IComplaint {
  id: string
  description: string
  fileUrl?: string 
  status: ComplaintStatus 
  userId: string 
  user?: IUser
  closedById?: string | null 
  closedBy?: IUser | null 
}