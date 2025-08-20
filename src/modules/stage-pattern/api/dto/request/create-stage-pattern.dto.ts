import { LocalizedString } from '@Package/api/interfaces/localized.interface';
import { Stage } from 'src/database'; // Adjust path

export class CreateStagePatternDto {
  stageId: string;
  stage?: Stage; 
  title: LocalizedString;
  imageUrl?: string;
}