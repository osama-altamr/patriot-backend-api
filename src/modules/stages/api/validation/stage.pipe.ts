import { BaseValidationPipe } from '@Package/api';
import { string, object } from 'zod';
import { LoginDto } from '../dto/request/stage.dto';

export class LoginValidation extends BaseValidationPipe<LoginDto> {
  constructor() {
    const schema = object({
        email: string().email(),
        password: string().min(8),
    })
    super(schema)
  }
}