import { BaseValidationPipe } from '@Package/api';
import { string, object } from 'zod';
import { CreateComplaintDto } from '../dto/request/create-complaint.dto';

export class CreateComplaintValidation extends BaseValidationPipe<CreateComplaintDto> {
  constructor() {
    const schema = object({
      description: string().min(10),
      fileUrl: string().url().optional(),
      type: string().optional().nullable(),
      location: string().optional().nullable(),
      userId: string().optional(),
    })
    super(schema);
  }
}