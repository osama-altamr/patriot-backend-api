import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComplaintRepository } from '../repository/complaint.repository'; // Adjust path
import { CreateComplaintDto } from '../api/dto/request/create-complaint.dto';
import { UpdateComplaintDto } from '../api/dto/request/update-complaint.dto';
import { Complaint, User } from 'src/database'; // Adjust path
import { ComplaintStatus } from '../api/enums/complaint.enum';

@Injectable()
export class ComplaintService {
  constructor(
      private readonly complaintRepo: ComplaintRepository,
    ) {}

  async createComplaint(complaintData: CreateComplaintDto, requestingUser: User): Promise<Complaint | Complaint[]> {
    const complaint = new Complaint()
    complaint.description = complaintData.description;
    complaint.fileUrl = complaintData.fileUrl;
    complaint.user = requestingUser
    complaint.status = ComplaintStatus.pending
    return this.complaintRepo.create(complaint as any)
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return this.complaintRepo.findAll();
  }

  async getComplaint(id: string): Promise<Complaint | null> {
    const complaint = await this.complaintRepo.findOneById(id)
    if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${id} not found`)
    }
    return complaint;
  }

  async updateComplaint(id: string, updateData: UpdateComplaintDto, requestingUser: User): Promise<Complaint> {
    return await this.complaintRepo.update(id, updateData)
  }

  async deleteComplaint(id: string): Promise<void> {
    await this.complaintRepo.delete(id);
  }
}