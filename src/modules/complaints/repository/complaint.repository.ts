import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { BaseRepository, Complaint } from '../../../database';
import { ComplaintStatus } from '../api/enums/complaint.enum';
import { GetAllComplaintsDto } from '../api/dto/request/get-all.dto';
import { Pagination, QueryValue } from '@Package/api';

@Injectable()
export class ComplaintRepository extends BaseRepository<Complaint> {
  constructor(
    @InjectRepository(Complaint)
    repository: Repository<Complaint>,
  ) {
    super(repository);
  }

      async findAllForUser(query: QueryValue<GetAllComplaintsDto>, pagination: Pagination){
          const queryBuilder = this.repository.createQueryBuilder('complaint');
          queryBuilder.leftJoinAndSelect('complaint.user', 'user');
          queryBuilder.leftJoinAndSelect('complaint.closedBy', 'closedBy');

          if (query.status) {
            queryBuilder.andWhere('complaint.status = :status', { status: query.status });
          }
  
          if (query.type) {
            queryBuilder.andWhere('complaint.type = :type', { type: query.type });
          }
          if (pagination) {
            queryBuilder.skip(pagination.skip).take(pagination.take);
          }
          if (query.startDate) {
            queryBuilder.andWhere('complaint.createdAt >= :startDate', { startDate: query.startDate });
            }
        
          if (query.endDate) {
            queryBuilder.andWhere('complaint.createdAt <= :endDate', { endDate: query.endDate });
          }
  
            queryBuilder.orderBy('complaint.createdAt', 'DESC');
        
            return await queryBuilder.getMany();
      }

  async findOneByWithPop(query: object) {
    return await this.repository.findOne({
      where: {
        ...query,
      },
      relations: ['closedBy', 'user'],
    })
  }

  async generateComplaintReport(startDate: Date, endDate: Date) {
    
    const summaryQuery = this.repository
      .createQueryBuilder('complaint')
      .select('COUNT(complaint.id)', 'totalComplaints')
      .addSelect(`COUNT(CASE WHEN complaint.status = '${ComplaintStatus.resolved}' THEN 1 END)`, 'resolvedComplaints')
      .addSelect(`COUNT(CASE WHEN complaint.status IN ('${ComplaintStatus.pending}', '${ComplaintStatus.in_progress}') THEN 1 END)`, 'openComplaints')
      .where('complaint.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const breakdownByTypeQuery = this.repository
      .createQueryBuilder('complaint')
      .select('complaint.type', 'type')
      .addSelect('COUNT(complaint.id)', 'count')
      .where('complaint.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('complaint.type')
      .getRawMany();

    const breakdownByStatusQuery = this.repository
      .createQueryBuilder('complaint')
      .select('complaint.status', 'status')
      .addSelect('COUNT(complaint.id)', 'count')
      .where('complaint.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('complaint.status')
      .getRawMany();

    const complaintsListQuery = this.repository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    const [summary, breakdownByType, breakdownByStatus, complaints] = await Promise.all([
      summaryQuery,
      breakdownByTypeQuery,
      breakdownByStatusQuery,
      complaintsListQuery,
    ]);
    
    return {
      summary: {
        totalComplaints: parseInt(summary.totalComplaints, 10) || 0,
        resolvedComplaints: parseInt(summary.resolvedComplaints, 10) || 0,
        openComplaints: parseInt(summary.openComplaints, 10) || 0,
        startDate,
        endDate,
      },
      breakdownByType: breakdownByType.map(item => ({...item, count: parseInt(item.count, 10)})),
      breakdownByStatus: breakdownByStatus.map(item => ({...item, count: parseInt(item.count, 10)})),
      complaints,
    };
  }
}
