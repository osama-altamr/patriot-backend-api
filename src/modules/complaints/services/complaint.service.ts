import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComplaintRepository } from '../repository/complaint.repository'; // Adjust path
import { CreateComplaintDto } from '../api/dto/request/create-complaint.dto';
import { UpdateComplaintDto } from '../api/dto/request/update-complaint.dto';
import { Complaint, User } from 'src/database'; // Adjust path
import { ComplaintStatus } from '../api/enums/complaint.enum';
import { UserRepository } from '/users/repository/user.repository';
import { UserRole } from '/users/api/enums/user.enum';
import { Pagination, QueryValue } from '@Package/api';
import { GetAllComplaintsDto } from '../api/dto/request/get-all.dto';

@Injectable()
export class ComplaintService {
  constructor(
      private readonly complaintRepo: ComplaintRepository,
      private readonly userRepo: UserRepository,
    ) {}

  async createComplaint(complaintData: CreateComplaintDto): Promise<Complaint | Complaint[]> {
    const complaint = new Complaint()
    const user = await this.userRepo.findOneById(complaintData.userId)
    complaintData.user = user
    complaint.description = complaintData.description;
    complaint.fileUrl = complaintData.fileUrl;
    complaint.type = complaintData.type;
    complaint.location = complaintData.location;
    complaint.status = ComplaintStatus.pending
    return this.complaintRepo.create(complaint as any)
  }

 async findAll(query: QueryValue<GetAllComplaintsDto>, pagination: Pagination){
        return await this.complaintRepo.findAllForUser(query, pagination)
    }


  async getComplaint(id: string): Promise<Complaint | null> {
    const complaint = await this.complaintRepo.findOneById(id)
    if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${id} not found`)
    }
    return complaint;
  }

  async updateComplaint(id: string, updateData: UpdateComplaintDto, requestingUser: User): Promise<Complaint> {
    const user = await this.userRepo.findOneById(requestingUser.id)
    if(user.role !== UserRole.user && updateData.status === ComplaintStatus.in_progress) {
      updateData.closedBy = user
    }
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