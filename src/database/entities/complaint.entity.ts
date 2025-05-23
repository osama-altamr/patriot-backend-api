import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
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
    type: 'varchar',
    nullable: true
  })
  type?: string

  @Column({
    type: 'varchar',
    nullable: true
  })
  location?: string

   @Column({
    type: 'text',
    default: ComplaintStatus.pending,
   })
   status?: ComplaintStatus

   @ManyToOne(() => User, (user) => user.complaints)
   user: User

   @ManyToOne(() => User, (user) => user.closedComplaints)
   closedBy: User
}

export abstract class IComplaint {
  id: string
  description: string
  fileUrl?: string 
  status: ComplaintStatus 
  user?: IUser
  closedBy?: IUser | null 
}