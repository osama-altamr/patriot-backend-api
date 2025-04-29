import { ComplaintStatus } from "../../enums/complaint.enum";

export class UpdateComplaintDto {
  description?: string
  fileUrl?: string
  status?: ComplaintStatus
  closedById?: string | null
}