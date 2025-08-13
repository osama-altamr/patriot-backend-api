import { LocalizedString } from "@Package/api";
import { ReportType } from "src/database";

export class CreateReportlDto {
  name: LocalizedString
  type: ReportType
  startDate: Date
  endDate: Date
  xlsxUrl?: string
  pdfUrl?: string
}