import { Injectable, NotFoundException } from '@nestjs/common'
import { NotificationRepository } from '../repository/notification.repository'
import { Notification, User } from 'src/database'
import { UserRepository } from '/users/repository/user.repository'
import { CreateNotificationDto } from '../api/dto/request/create-notification.dto'
import { UnReadNotificationsDto } from '../api/dto/request/unread-notification.dto'

@Injectable()
export class NotificationService {
  constructor(
      private readonly NotificationRepo: NotificationRepository,
      private readonly userRepo: UserRepository
    ) {}

  async createNotification(notificationData: CreateNotificationDto): Promise<Notification| Notification[]> {
     const user = await this.userRepo.findOneById(notificationData.userId)
     notificationData.user = user
    return this.NotificationRepo.create(notificationData as any)
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    const user = await this.userRepo.findOneById(userId)
    return this.NotificationRepo.findForMe(user)
  }

  async getNotification(id: string): Promise<Notification | null> {
    const Notification = await this.NotificationRepo.findOneById(id)
    if (!Notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`)
    }
    return Notification
  }

  async getUnredNotifications(userId: string): Promise<Notification[]> {
    const user = await this.userRepo.findOneById(userId)
    return await this.NotificationRepo.findForMe(user, false)
  }

  async dismissByIds(uncreadData: UnReadNotificationsDto)  {
    await this.NotificationRepo.dismissByIds(uncreadData)
  }

  async deleteNotification(id: string): Promise<void> {
   await this.NotificationRepo.delete(id)
  }
}