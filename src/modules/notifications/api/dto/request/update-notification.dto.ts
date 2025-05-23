import { LocalizedString } from "@Package/api";
import { IUser } from "src/database";

export class UpdateNotificationDto {
  title?: LocalizedString
  content?: LocalizedString;
  isSeen?: boolean;
  type?: string
  recordId?: string
}