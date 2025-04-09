import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({type: "text"})
  lastName: string;

  @Column({type: "text", default: "user"})
  role: string;

  @Column({ default: true })
  isActive: boolean;

}

export abstract class IUser
{
  role: string 
  firstName: string
  lastName: string
  id: string
}