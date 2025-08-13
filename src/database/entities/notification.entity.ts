import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { CommonEntity } from './common.entity';
import { LocalizedString } from '@Package/api/interfaces/localized.interface';

@Entity()
export class Notification extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "jsonb" })
  title: LocalizedString;

  @Column({ type: "jsonb", nullable: true })
  content?: LocalizedString;

  @Column({
    type: 'boolean',
    default: false
  })
  isSeen?: boolean;
  
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ type: 'varchar', nullable: true })
  recordId?: string

  @Column({ type: 'varchar' })
  type: string
}

export interface INotification {
  id: string;
  title: LocalizedString;
  content?: LocalizedString;
  isSeen?: boolean;
  type?: string
  recordId?: string
  user: User;
  userId: string
}