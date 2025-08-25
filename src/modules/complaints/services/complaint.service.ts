import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComplaintRepository } from '../repository/complaint.repository'; // Adjust path
import { CreateComplaintDto } from '../api/dto/request/create-complaint.dto';
import { UpdateComplaintDto } from '../api/dto/request/update-complaint.dto';
import { Complaint, User } from 'src/database'; // Adjust path
import { ComplaintStatus } from '../api/enums/complaint.enum';
import { UserRepository } from '/users/repository/user.repository';
import { UserRole } from '/users/api/enums/user.enum';
import { LocalizedString, Pagination, QueryValue } from '@Package/api';
import { GetAllComplaintsDto } from '../api/dto/request/get-all.dto';
import { NotificationService } from '/notifications/services/notification.service';
import { PermissionRepository } from '/permissions/repository/permission.repository';
import { In, Or } from 'typeorm';

@Injectable()
export class ComplaintService {
  constructor(
      private readonly complaintRepo: ComplaintRepository,
      private readonly userRepo: UserRepository,
      private readonly notificationService: NotificationService,
      private readonly permissionRepo: PermissionRepository,
    ) {}

  async createComplaint(complaintData: CreateComplaintDto) {
    const admins = await this.permissionRepo.getAllWithPop({
      accessType: In(['admin', 'employee'])
    })

    const user = await this.userRepo.findOneById(complaintData.userId)
    complaintData.user = user
    const complaint = await this.complaintRepo.create(complaintData as any) as Complaint

    if(admins && admins.length > 0){
      await Promise.all(admins.map(async admin => {
        const complaintRef = complaint.id.substring(0, 5).toUpperCase();

        if(admin.scopes.some(scope => scope.feature === 'complaints')) {
           await this.notificationService.createNotification({
            title: {
              en: `New Complaint Filed: #${complaintRef}`,
              ar: `تم تسجيل شكوى جديدة: #${complaintRef}`
            },
            isSeen: false,
            content: {
              en: `A new complaint has been submitted by user ${user.name}. Please review it.`,
              ar: `تم تقديم شكوى جديدة من قبل المستخدم ${user.name}. يرجى مراجعتها.`
            },
            recordId: complaint.id,
            type: 'complaint',
            userId: admin.user.id,
          });
        }
      }))
    }
    return complaint
  }

 async findAll(query: QueryValue<GetAllComplaintsDto>, pagination: Pagination){
        return await this.complaintRepo.findAllForUser(query, pagination)
    }


  async getComplaint(id: string): Promise<Complaint | null> {
    const complaint = await this.complaintRepo.findOneByWithPop({ id })
    if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${id} not found`)
    }
    return complaint;
  }

  async updateComplaint(id: string, updateData: UpdateComplaintDto): Promise<Complaint> {
    const user = await this.userRepo.findOneById(updateData.closedById)
    const complaint = await this.complaintRepo.findOneByWithPop({ id });
    const complaintRef = complaint.id.substring(0, 5).toUpperCase();

    if (updateData.status && updateData.status !== complaint.status) {
      let notificationContent: LocalizedString;

      switch (updateData.status) {
        case ComplaintStatus.in_progress:
          notificationContent = {
            en: `Your complaint #${complaintRef} is now in progress. We are looking into it.`,
            ar: `شكواك #${complaintRef} قيد المراجعة الآن. نحن نعمل على حلها.`
          };
          break;
        case ComplaintStatus.resolved:
          notificationContent = {
            en: `Your complaint #${complaintRef} has been resolved. Please check the details.`,
            ar: `تم حل شكواك #${complaintRef}. يرجى مراجعة التفاصيل.`
          };
          break;
        case ComplaintStatus.rejected:
          notificationContent = {
            en: `Your complaint #${complaintRef} has been reviewed and rejected.`,
            ar: `تمت مراجعة شكواك #${complaintRef} ورفضها.`
          };
          break;
        default:
          break;
      }

      if (notificationContent && complaint.user) {
        await this.notificationService.createNotification({
          title: {
            en: `Update on your Complaint #${complaintRef}`,
            ar: `تحديث بخصوص شكواك #${complaintRef}`
          },
          content: notificationContent,
          recordId: complaint.id,
          type: 'complaint',
          userId: complaint.user.id,
        });
      }
    }



    updateData.closedBy = user
    await this.complaintRepo.update(id, updateData);
    const query = {
      id
    }
    return this.complaintRepo.findOneByWithPop(query)
  }

  async deleteComplaint(id: string): Promise<void> {
    await this.complaintRepo.delete(id);
  }
}