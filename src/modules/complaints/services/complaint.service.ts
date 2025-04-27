import { Injectable } from '@nestjs/common';
import { ComplaintRepository } from '../repository/complaint.repository';

@Injectable()
export class ComplaintService {
  constructor(private readonly complaintRepo: ComplaintRepository) {}
 
}
