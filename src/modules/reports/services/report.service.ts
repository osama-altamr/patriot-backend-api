import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';
import { Report, ReportType } from 'src/database';
import { CreateReportlDto } from '../api/dto/request/create-report.dto';
import { OrdersRepository } from '/orders/repository/orders.repository';
import { ExcelExportService } from './genereate-xlsx.service';
import { FileUploadService } from '/aws/services/s3.service';
import { ComplaintRepository } from '/complaints/repository/complaint.repository';
import { ComplaintService } from '/complaints/services/complaint.service';
import { PermissionRepository } from '/permissions/repository/permission.repository';
import { OrderCodeRepository } from '/orders/repository/order-code.repository';
import { OrderItemRepository } from '/orders/repository/order-item.repository';
import { OrderItemActionRepository } from '/orders/repository/order-item-action.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository, 
    private readonly orderRepo: OrdersRepository,
    private readonly orderItemActionRepo: OrderItemActionRepository,
    private readonly complaintRepo: ComplaintRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly excelService: ExcelExportService,
  ) {}

  async create(body: CreateReportlDto){
    if(body.type === ReportType.order){
      const orderReport = await this.orderRepo.generateOrderReport(body.startDate, body.endDate)
      const xlsxUrl = await this.excelService.createOrderReportFile('order', orderReport)
      body.xlsxUrl = xlsxUrl
      const report = await this.reportRepo.create({
        ...body,
        orderBreakdownByStatus: orderReport.orderBreakdownByStatus,
        orderSummary: orderReport.orderSummary,
      }) as Report 
      report.orders = orderReport.orders
      return report
    }

    if(body.type === ReportType.complaint){
      const complaintReport = await this.complaintRepo.generateComplaintReport(body.startDate, body.endDate)
      const xlsxUrl = await this.excelService.createOrderReportFile('complaint', complaintReport)
      body.xlsxUrl = xlsxUrl
      const report = await this.reportRepo.create({
        ...body,
        complaintSummary: complaintReport.summary,
        complaintBreakdownByStatus: complaintReport.breakdownByStatus,
        complaintBreakdownByType: complaintReport.breakdownByType,
      }) as Report 
      report.complaints = complaintReport.complaints as any
      return report 
    }

    if(body.type === ReportType.employee){
      const { accessLevelSummary, breakdownByType } = await this.permissionRepo.getReportSummary(body.startDate, body.endDate)
      const reportPromises = breakdownByType.drivers.map(async driver => {
        const orderStatus = await this.orderRepo.getStatsForSingleDriver(driver.user, body.startDate, body.endDate);
        return {
          name: driver.user.name,
          deliveredOrders: orderStatus.totalDeliveredOrders,
          averageDeliveryTimeMinutes: orderStatus.totalDeliveredOrders,
        }
      })

      const employeeReportPromises = breakdownByType.employees.map(async employee => {
        const performanceStats = await this.orderItemActionRepo.getStatsForSingleEmployee(employee.user, body.startDate, body.endDate);
        return {
          name: employee.user.name,
          completedItems: performanceStats.totalCompletedItems,
          averageTime: performanceStats.averageItemCompletionTimeMinutes, 
        }
      })
      breakdownByType.drivers = await Promise.all(reportPromises);
      breakdownByType.employees = await Promise.all(employeeReportPromises);

      const xlsxUrl = await this.excelService.createOrderReportFile('employee', { breakdownByType , startDate: body.startDate, endDate: body.endDate })
      body.xlsxUrl = xlsxUrl

      const report = await this.reportRepo.create({
        ...body,
        accessLevelSummary: accessLevelSummary as any,
        employeeBreakdownByType: breakdownByType
      }) as Report 

      return report
    }
    return await this.reportRepo.create(body)
  }
  async getAllReports(): Promise<Report[]> {
    return this.reportRepo.findAll({})
  }

  async getReport(id: string) {
    const report = await this.reportRepo.findOneById(id)
    if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`)
    }
    if(report.type === ReportType.order){
      const orders = await this.orderRepo.findAllForUser({
        startDate: report.startDate,
        endDate: report.endDate,
      },{
        take: 100,
        skip: 0,
        needPagination: true,
      })
      report.orders = orders
    }

    if(report.type === ReportType.complaint){
      const complaints = await this.complaintRepo.findAllForUser({
        startDate: report.startDate,
        endDate: report.endDate,
      },{
        take: 100,
        skip: 0,
        needPagination: true,
      })
      report.complaints = complaints as any
    }
    return report
  }

  async deleteReport(id: string): Promise<void> {
   await this.reportRepo.delete(id)
  }
}
