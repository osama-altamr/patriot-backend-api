import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
  } from 'typeorm'
  
  export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    abstract id: string
  
    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt: Date
  
    @UpdateDateColumn({
      name: 'updated_at',
    })
    updatedAt: Date
  
  }
  