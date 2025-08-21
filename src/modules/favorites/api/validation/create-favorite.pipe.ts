import { BaseValidationPipe } from '@Package/api';
import { object, string } from 'zod';
import { CreateFavoriteDto } from '../dto/request/create-favorite.dto';

export class CreateFavoriteValidation extends BaseValidationPipe<CreateFavoriteDto> {
  constructor() {
    const schema = object({
      productId: string().uuid({ message: 'Product ID must be a valid UUID' }),
    });
    super(schema);
  }
}