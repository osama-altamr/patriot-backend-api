import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';
import { Report, ReportType } from 'src/database';
import { CreateReportlDto } from '../api/dto/request/create-report.dto';
import { OrdersRepository } from '/orders/repository/orders.repository';
import { ExcelExportService } from './genereate-xlsx.service';
import { ComplaintRepository } from '/complaints/repository/complaint.repository';
import { PermissionRepository } from '/permissions/repository/permission.repository';
import { OrderItemActionRepository } from '/orders/repository/order-item-action.repository';
import { randomUUID } from 'crypto';
import { ProductRepository } from '/products/repository/product.repository';
import { CategoryRepository } from '/categories/repository/category.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository, 
    private readonly orderRepo: OrdersRepository,
    private readonly orderItemActionRepo: OrderItemActionRepository,
    private readonly complaintRepo: ComplaintRepository,
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
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
          id: randomUUID(),
          name: driver.user.name,
          deliveredOrders: orderStatus.totalDeliveredOrders,
          averageDeliveryTimeMinutes: orderStatus.totalDeliveredOrders,
        }
      })

      const employeeReportPromises = breakdownByType.employees.map(async employee => {
        const performanceStats = await this.orderItemActionRepo.getStatsForSingleEmployee(employee.user, body.startDate, body.endDate);
        return {
          id: randomUUID(),
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

    if(body.type === ReportType.sale) {
      const [
        salesSummary,
        dailySales,
        productBreakdown,
        categoryBreakdown,
        stateBreakdown,
        cityBreakdown,
      ] = await Promise.all([
        this.orderRepo.generateSalesSummary(body.startDate, body.endDate),
        this.orderRepo.generateDailySalesTrend(body.startDate, body.endDate),
        this.productRepo.generateSalesBreakdownByProduct(body.startDate, body.endDate),
        this.categoryRepo.generateSalesBreakdownByCategory(body.startDate, body.endDate),
        this.orderRepo.generateSalesBreakdownByState(body.startDate, body.endDate),
        this.orderRepo.generateSalesBreakdownByCity(body.startDate, body.endDate),
      ]);

      const salesReportData = {
        saleSummary: salesSummary,
        saleDailyTrend: dailySales,
        saleBreakdownByProduct: productBreakdown.map(pr => {
          pr.id = randomUUID()
          return pr
        }),
        saleBreakdownByCategory: categoryBreakdown.map(ct => {
          ct.id = randomUUID()
          return ct
        }),
        salesBreakdownByState: stateBreakdown.map(state => {
          state.id = randomUUID()
          return state
        }),
        salesBreakdownByCity: cityBreakdown.map(city => {
          city.id = randomUUID()
          return city
        }),
      };

      const xlsxUrl = await this.excelService.createSalesReportFile(salesReportData);
      body.xlsxUrl = xlsxUrl;

      const report = await this.reportRepo.create({
        ...body,
       ...salesReportData
      }) as Report;
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
