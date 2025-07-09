import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { IOrder } from './order.entity'
import { IComplaint } from './complaint.entity'

export enum ReportType {
  employee = 'employee',
  order = 'order',
  complaint = 'complaint',
  sales = 'sales'
}

interface OrderSummary {
  totalOrders: number,
  totalRevenue: number,
  startDate:  Date
  endDate: Date
}

interface ComplaintSummary {
  totalComplaints: number
  resolvedComplaints: number
  openComplaints: number
  startDate:  Date
  endDate: Date
}
interface BreakdownByStatus {
  status: string
  count: number
}

interface BreakdownByType {
  type: string
  count: number
}

interface AccessLevelSummary {
  admins: number
  employees: number
  drivers: number
  viewers: number
  owners: number
}

interface EmployeeBreakdownByType {
  drivers: Array<{
    name: string
    totalDeliveredOrders: number
    averageDeliveryTimeMinutes: number
  }>
  employees: Array<{
    name: string
    totalCompletedItems: number
    averageItemCompletionTimeMinutes: number
  }>
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

  @Column({ type: 'jsonb', nullable: true }) 
  orderSummary: OrderSummary
 
  @Column({ type: 'jsonb', nullable: true }) 
  orderBreakdownByStatus: BreakdownByStatus[]

  @Column({ type: 'jsonb', nullable: true }) 
  complaintBreakdownByStatus: BreakdownByStatus[]

  @Column({ type: 'jsonb', nullable: true }) 
  complaintBreakdownByType: BreakdownByType[]

  @Column({ type: 'jsonb', nullable: true }) 
  complaintSummary: ComplaintSummary

  @Column({ type: 'jsonb', nullable: true }) 
  accessLevelSummary: AccessLevelSummary

  @Column({ type: 'jsonb', nullable: true }) 
  employeeBreakdownByType: EmployeeBreakdownByType

  orders: IOrder[]
  complaints: IComplaint[]
}

export abstract class IReport {
  id: string;
  name: LocalizedString
  type: ReportType
  startDate: Date
  endDate: Date
  xlsxUrl?: string
  pdfUrl?: string
  orderBreakdownByStatus?: BreakdownByStatus[]
  orders?: IOrder[]
  orderSummary?: OrderSummary
  complaintBreakdownByStatus?: BreakdownByStatus[]
  complaintBreakdownByType?: BreakdownByType[]
  complaintSummary?: ComplaintSummary
  accessLevelSummary?: AccessLevelSummary
  employeeBreakdownByType?: EmployeeBreakdownByType

}