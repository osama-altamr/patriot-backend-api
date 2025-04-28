import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IUser, User } from './user.entity'
import { CommonEntity } from './common.entity'

@Entity()
export class RefreshToken extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: "text" })
  token: string

  @Column({
    nullable: true,
    type: 'date',
  })
  expiresAt?: Date

  @Column({
    nullable: true,
    type: 'date',
  })
  issuedAt: Date

  @Column({
    nullable: true,
    type: 'date',
  })
  revokedAt?: Date | null

  @ManyToOne(() => User, user => user.refreshTokens)
  user: User
}

export abstract class IRefreshToken {
  id: string
  token: string
  expiresAt: Date
  issuedAt: Date
  revokedAt: Date
  user: User
}