import { BaseValidationPipe } from '@Package/api';
import { string, object, number, nativeEnum, coerce } from 'zod';
import { localizedSchema } from '@Package/api/pipes/localized.pipe'; 
import { CreateReportlDto } from '../dto/request/create-report.dto';
import { ReportType } from 'src/database';

export class CreateReportValidation extends BaseValidationPipe<CreateReportlDto> {
  constructor() {
    const schema = object({
      name: localizedSchema, 
      type: nativeEnum(ReportType),
      startDate: coerce.date().optional(),
      endDate: coerce.date().optional(),
    })
    super(schema)
  }
}