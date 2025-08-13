import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Notification, User } from '../../../database';
import {  } from '../../../database';
import { UnReadNotificationsDto } from '../api/dto/request/unread-notification.dto';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(
    @InjectRepository(Notification)
    repository: Repository<Notification>,
  ) {
    super(repository);
  }

  async findForMe(user: User, isSeen?: boolean ) {
    return this.repository.findBy({  user: { id: user.id }, isSeen })
  }

  async dismissByIds(unreadData: UnReadNotificationsDto) {
    console.log(unreadData)
    await this.repository.createQueryBuilder()
    .update(Notification)
    .set({ isSeen: true })
    .where('id IN (:...ids)', { ids: unreadData.notificationIds })
    .returning('*') // Returns all columns of the updated records
    .execute();

  }



}
