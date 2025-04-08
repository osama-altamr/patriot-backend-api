import { BaseValidationPipe } from '@Package/api';
import { z } from 'zod';
import { AddUserDto } from '../dto/request/add-user.dto';


export class AddUserValidation extends BaseValidationPipe<AddUserDto> {
  constructor() {
    const schema = z.object({
        firstName: z.string(),
        lastName: z.string(),
    })
    super(schema);
  }
}