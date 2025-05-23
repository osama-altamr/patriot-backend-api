import { IComplaint } from 'src/database'; // Adjust path

export class CreateComplaintDto implements Pick<IComplaint, 'description' | 'fileUrl'> {
  description: string;
  fileUrl?: string;
  type?: string
  location?: string
}