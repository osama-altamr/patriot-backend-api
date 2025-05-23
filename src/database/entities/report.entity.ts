import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'

export enum ReportType {
  employee = 'employee',
  order = 'order',
  sales = 'sales'
}

@Entity()
export class Report extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'jsonb' }) 
  name: LocalizedString

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type: ReportType

  @Column({ type: 'timestamp with time zone' })
  startDate: Date

  @Column({ type: 'timestamp with time zone' })
  endDate: Date

  @Column({ nullable: true })
  xlsxUrl?: string
 
  @Column({ nullable: true })
  pdfUrl?: string
}

export abstract class IReport {
  id: string;
  name: LocalizedString
  type: ReportType
  startDate: Date
  endDate: Date
  xlsxUrl?: string
  pdfUrl?: string
}