import { User } from "src/database";
import { ComplaintStatus } from "../../enums/complaint.enum";

export class UpdateComplaintDto {
  description?: string
  fileUrl?: string
  location?: string
  type?: string
  status?: ComplaintStatus
  closedById?: string | null
  closedBy?: User
}