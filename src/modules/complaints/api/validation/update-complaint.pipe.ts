import { BaseValidationPipe } from '@Package/api';
import { string, object, nativeEnum } from 'zod';
import { UpdateComplaintDto } from '../dto/request/update-complaint.dto';
import { ComplaintStatus } from '../enums/complaint.enum';

export class UpdateComplaintValidation extends BaseValidationPipe<UpdateComplaintDto> {
  constructor() {
    const schema = object({
      description: string().min(10).optional(),
      fileUrl: string().url().optional().nullable(),
      status: nativeEnum(ComplaintStatus).optional(),
      type: string().optional(),
      location: string().optional().nullable(),
      closedById: string().optional().nullable(),
    })
    super(schema);
  }
}