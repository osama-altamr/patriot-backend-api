import { BadRequestException, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { IUser, OrderStatus } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';
import { ProductRepository } from '/products/repository/product.repository';
import { MaterialRepository } from '/materials/repository/material.repository';
import { ComplaintRepository } from '/complaints/repository/complaint.repository';
import { OrdersRepository } from '/orders/repository/orders.repository';
import { ReportRepository } from '/reports/repository/report.repository';
import { StageRepository } from '/stages/repository/stage.repository';
import { CategoryRepository } from '/categories/repository/category.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
    private readonly materialRepo: MaterialRepository,
    private readonly complaintRepo: ComplaintRepository,
    private readonly orderRepo: OrdersRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly stageRepo: StageRepository,
    private readonly reportRepo: ReportRepository,
  ) {}
  async getStatistics() {
    const [
      totalUsers,
      totalProducts,
      totalMaterials,
      totalComplaints,
      totalOrders,
      totalCategories,
      totalStages,
      totalReports,
    ] = await Promise.all([
      this.userRepo.count(),
      this.productRepo.count(),
      this.materialRepo.count(),
      this.complaintRepo.count(),
      this.orderRepo.count(),
      this.categoryRepo.count(),
      this.stageRepo.count(),
      this.reportRepo.count(),
    ]);
    return {
      totals: {
        users: totalUsers,
        products: totalProducts,
        materials: totalMaterials,
        complaints: totalComplaints,
        orders: totalOrders,
        categories: totalCategories,
        reports: totalReports,
        stages:  totalStages 
    }
    }
  }

  async getStatisticsMe(userId: string) {
    const statusCounts = await this.orderRepo.count({
      user: { id: userId }
    });
    const statusGroups = await this.orderRepo.getStatusGroups(userId)

    const counts = statusGroups.reduce((acc, group) => {
      acc[group.status] = parseInt(group.count, 10);
      return acc;
    }, {} as Partial<Record<OrderStatus, number>>);
  
    return {
      total: statusCounts,
      pending: counts[OrderStatus.pending] || 0,
      inProgress: counts[OrderStatus.inProgress] || 0,
      cancelled: counts[OrderStatus.cancelled] || 0,
      delivered: counts[OrderStatus.delivered] || 0,
      
    };
  }
}
