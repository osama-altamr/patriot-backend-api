import { LocalizedString } from '@Package/api/interfaces/localized.interface'
import { INotification, IUser } from 'src/database' // Adjust path

export class CreateNotificationDto implements Omit<INotification, 'id' | 'user'> {
    title: LocalizedString
    content: LocalizedString;
    isSeen?: boolean;
    type?: string
    recordId?: string
    user?: IUser
    userId: string
}